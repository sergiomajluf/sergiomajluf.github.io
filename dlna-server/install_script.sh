#!/bin/bash

# DLNA Media Player - Script de Instalación Automática
# Compatible con Raspberry Pi OS
# Autor: Sistema DLNA Media Player
# Versión: 1.0

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
USER_HOME="/home/pi"
INSTALL_DIR="$USER_HOME/mediaplayer"
SERVICE_NAME="dlna-mediaplayer"
SOCKET_PORT=8888

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  DLNA Media Player - Instalador     ${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Verificar que se ejecuta como pi o con sudo
if [[ $EUID -ne 0 ]] && [[ "$USER" != "pi" ]]; then
   echo -e "${RED}Este script debe ejecutarse como usuario 'pi' o con sudo${NC}"
   exit 1
fi

# Función para logging
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar conexión a internet
check_internet() {
    log "Verificando conexión a internet..."
    if ! ping -c 1 google.com &> /dev/null; then
        error "No hay conexión a internet. Verifica tu conexión."
        exit 1
    fi
    log "Conexión a internet OK"
}

# Actualizar sistema
update_system() {
    log "Actualizando sistema..."
    sudo apt-get update -y
    sudo apt-get upgrade -y
    log "Sistema actualizado"
}

# Instalar dependencias
install_dependencies() {
    log "Instalando dependencias..."
    
    # Paquetes base
    sudo apt-get install -y \
        minidlna \
        python3 \
        python3-pip \
        python3-venv \
        git \
        curl \
        netcat \
        htop \
        tree
    
    log "Dependencias instaladas"
}

# Crear estructura de directorios
create_directories() {
    log "Creando estructura de directorios..."
    
    # Crear directorio principal si no existe
    if [[ -d "$INSTALL_DIR" ]]; then
        warn "El directorio $INSTALL_DIR ya existe. ¿Deseas continuar? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            log "Instalación cancelada"
            exit 0
        fi
        # Backup del directorio existente
        sudo mv "$INSTALL_DIR" "${INSTALL_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
        log "Backup creado del directorio existente"
    fi
    
    # Crear estructura
    mkdir -p "$INSTALL_DIR"/{videos,config,src,scripts,examples,logs,tmp}
    
    # Cambiar propietario
    sudo chown -R pi:pi "$INSTALL_DIR"
    
    log "Estructura de directorios creada en $INSTALL_DIR"
}

# Configurar MiniDLNA
configure_minidlna() {
    log "Configurando MiniDLNA..."
    
    # Crear configuración personalizada
    cat > "$INSTALL_DIR/config/minidlna.conf" << EOF
# Configuración MiniDLNA para Media Player
# Directorio de medios
media_dir=V,$INSTALL_DIR/videos

# Configuración de red
friendly_name=RaspberryPi Media Player
network_interface=

# Base de datos
db_dir=$INSTALL_DIR/tmp/minidlna

# Configuración del servidor
port=8200
presentation_url=http://$(hostname -I | awk '{print $1}'):8200/

# Opciones adicionales
inotify=yes
enable_tivo=no
strict_dlna=yes
notify_interval=895
serial=12345678

# Archivos de log
log_dir=$INSTALL_DIR/logs
log_level=general,artwork,database,inotify,scanner,metadata,http,ssdp,tivo=warn

# Opciones de medios
wide_links=no
EOF

    # Backup configuración original
    sudo cp /etc/minidlna.conf /etc/minidlna.conf.backup

    # Enlazar nuestra configuración
    sudo ln -sf "$INSTALL_DIR/config/minidlna.conf" /etc/minidlna.conf
    
    # Crear directorio de base de datos
    mkdir -p "$INSTALL_DIR/tmp/minidlna"
    sudo chown -R minidlna:minidlna "$INSTALL_DIR/tmp/minidlna"
    
    log "MiniDLNA configurado"
}

# Crear controlador principal
create_controller() {
    log "Creando controlador principal..."
    
    cat > "$INSTALL_DIR/src/dlna_controller.py" << 'EOF'
#!/usr/bin/env python3
"""
DLNA Media Player Controller
Socket-based control server for playlist management
"""

import socket
import json
import os
import sys
import subprocess
import threading
import time
import logging
from pathlib import Path
from datetime import datetime

class DLNAController:
    def __init__(self, video_dir=None, port=8888, log_file=None):
        self.base_dir = Path(__file__).parent.parent
        self.video_dir = Path(video_dir) if video_dir else self.base_dir / "videos"
        self.port = port
        self.current_playlist = []
        self.current_index = 0
        self.playing = False
        self.server_socket = None
        
        # Setup logging
        log_path = Path(log_file) if log_file else self.base_dir / "logs" / "controller.log"
        log_path.parent.mkdir(exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_path),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
        # Ensure directories exist
        self.video_dir.mkdir(exist_ok=True)
        
        self.logger.info(f"DLNA Controller inicializado")
        self.logger.info(f"Directorio de videos: {self.video_dir}")
        self.logger.info(f"Puerto: {self.port}")
    
    def get_video_files(self):
        """Obtener todos los archivos de video en el directorio"""
        video_extensions = {'.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v'}
        try:
            files = [f for f in self.video_dir.iterdir() 
                    if f.is_file() and f.suffix.lower() in video_extensions]
            return sorted(files, key=lambda x: x.name.lower())
        except Exception as e:
            self.logger.error(f"Error listando archivos: {e}")
            return []
    
    def create_playlist(self, video_list):
        """Crear playlist desde lista de nombres de video"""
        playlist = []
        for video in video_list:
            if isinstance(video, str):
                video_path = self.video_dir / video
                if video_path.exists():
                    playlist.append(str(video_path))
                    self.logger.info(f"Video agregado a playlist: {video}")
                else:
                    self.logger.warning(f"Video no encontrado: {video}")
        
        self.current_playlist = playlist
        self.current_index = 0
        self.logger.info(f"Playlist creada con {len(playlist)} videos")
        return len(playlist)
    
    def refresh_dlna(self):
        """Refrescar servidor DLNA para que detecte cambios"""
        try:
            # Forzar rescan de MiniDLNA
            subprocess.run(['sudo', 'systemctl', 'reload', 'minidlna'], 
                         check=True, capture_output=True)
            self.logger.info("DLNA server refreshed")
            return True
        except subprocess.CalledProcessError as e:
            self.logger.error(f"Error refreshing DLNA: {e}")
            return False
    
    def play_current_video(self):
        """Preparar video actual para reproducción"""
        if self.current_playlist and 0 <= self.current_index < len(self.current_playlist):
            current_video = self.current_playlist[self.current_index]
            self.playing = True
            self.refresh_dlna()
            self.logger.info(f"Playing: {Path(current_video).name}")
            return current_video
        return None
    
    def next_video(self):
        """Avanzar al siguiente video"""
        if self.current_playlist and self.current_index < len(self.current_playlist) - 1:
            self.current_index += 1
            return self.play_current_video()
        return None
    
    def previous_video(self):
        """Retroceder al video anterior"""
        if self.current_playlist and self.current_index > 0:
            self.current_index -= 1
            return self.play_current_video()
        return None
    
    def jump_to_video(self, index):
        """Saltar a video específico en la playlist"""
        if self.current_playlist and 0 <= index < len(self.current_playlist):
            self.current_index = index
            return self.play_current_video()
        return None
    
    def handle_client(self, client_socket, address):
        """Manejar conexión de cliente individual"""
        self.logger.info(f"Cliente conectado desde {address}")
        try:
            while True:
                data = client_socket.recv(1024).decode('utf-8').strip()
                if not data:
                    break
                
                try:
                    command = json.loads(data)
                    self.logger.info(f"Comando recibido: {command.get('action', 'unknown')}")
                    response = self.process_command(command)
                    client_socket.send((json.dumps(response) + '\n').encode('utf-8'))
                except json.JSONDecodeError as e:
                    error_response = {"error": "Invalid JSON", "details": str(e)}
                    client_socket.send((json.dumps(error_response) + '\n').encode('utf-8'))
                except Exception as e:
                    error_response = {"error": "Command processing failed", "details": str(e)}
                    client_socket.send((json.dumps(error_response) + '\n').encode('utf-8'))
                    self.logger.error(f"Error procesando comando: {e}")
        except ConnectionResetError:
            self.logger.info(f"Cliente {address} desconectado")
        except Exception as e:
            self.logger.error(f"Error en conexión con {address}: {e}")
        finally:
            client_socket.close()
    
    def process_command(self, command):
        """Procesar comandos entrantes"""
        action = command.get('action')
        
        if action == 'list_videos':
            videos = [f.name for f in self.get_video_files()]
            return {"videos": videos, "count": len(videos)}
        
        elif action == 'create_playlist':
            video_list = command.get('videos', [])
            count = self.create_playlist(video_list)
            return {"playlist_created": True, "video_count": count}
        
        elif action == 'play':
            current_video = self.play_current_video()
            if current_video:
                return {"playing": Path(current_video).name, "index": self.current_index}
            return {"error": "No video to play"}
        
        elif action == 'next':
            next_video = self.next_video()
            if next_video:
                return {"next_video": Path(next_video).name, "index": self.current_index}
            return {"error": "No next video"}
        
        elif action == 'previous':
            prev_video = self.previous_video()
            if prev_video:
                return {"previous_video": Path(prev_video).name, "index": self.current_index}
            return {"error": "No previous video"}
        
        elif action == 'jump':
            index = command.get('index', 0)
            jumped_video = self.jump_to_video(index)
            if jumped_video:
                return {"jumped_to": Path(jumped_video).name, "index": self.current_index}
            return {"error": "Invalid index"}
        
        elif action == 'current_playlist':
            playlist_names = [Path(v).name for v in self.current_playlist]
            return {
                "playlist": playlist_names, 
                "current_index": self.current_index,
                "total_videos": len(self.current_playlist)
            }
        
        elif action == 'status':
            current_video = None
            if self.current_playlist and 0 <= self.current_index < len(self.current_playlist):
                current_video = Path(self.current_playlist[self.current_index]).name
            
            return {
                "playing": self.playing,
                "current_video": current_video,
                "playlist_length": len(self.current_playlist),
                "current_index": self.current_index,
                "server_time": datetime.now().isoformat()
            }
        
        elif action == 'stop':
            self.playing = False
            return {"stopped": True}
        
        elif action == 'refresh_dlna':
            success = self.refresh_dlna()
            return {"dlna_refreshed": success}
        
        return {"error": f"Unknown action: {action}"}
    
    def start_server(self):
        """Iniciar servidor socket"""
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self.server_socket.bind(('0.0.0.0', self.port))
            self.server_socket.listen(5)
            
            self.logger.info(f"DLNA Controller escuchando en puerto {self.port}")
            print(f"DLNA Controller iniciado en puerto {self.port}")
            print(f"Directorio de videos: {self.video_dir}")
            print(f"Logs: {self.base_dir}/logs/controller.log")
            print("Presiona Ctrl+C para detener")
            
            while True:
                try:
                    client_socket, address = self.server_socket.accept()
                    client_thread = threading.Thread(
                        target=self.handle_client, 
                        args=(client_socket, address),
                        daemon=True
                    )
                    client_thread.start()
                except socket.error as e:
                    if self.server_socket:  # Solo loguear si el socket no fue cerrado intencionalmente
                        self.logger.error(f"Error aceptando conexión: {e}")
                    break
                    
        except KeyboardInterrupt:
            self.logger.info("Deteniendo servidor por interrupción de usuario")
        except Exception as e:
            self.logger.error(f"Error iniciando servidor: {e}")
        finally:
            self.stop_server()
    
    def stop_server(self):
        """Detener servidor socket"""
        if self.server_socket:
            self.server_socket.close()
            self.server_socket = None
        self.logger.info("Servidor detenido")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='DLNA Media Player Controller')
    parser.add_argument('--port', type=int, default=8888, help='Puerto del servidor (default: 8888)')
    parser.add_argument('--video-dir', type=str, help='Directorio de videos')
    parser.add_argument('--log-file', type=str, help='Archivo de logs')
    
    args = parser.parse_args()
    
    controller = DLNAController(
        video_dir=args.video_dir,
        port=args.port,
        log_file=args.log_file
    )
    
    try:
        controller.start_server()
    except KeyboardInterrupt:
        print("\nDeteniendo servidor...")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
EOF

    chmod +x "$INSTALL_DIR/src/dlna_controller.py"
    log "Controlador principal creado"
}

# Crear scripts de utilidad
create_scripts() {
    log "Creando scripts de utilidad..."
    
    # Script de inicio
    cat > "$INSTALL_DIR/scripts/start.sh" << EOF
#!/bin/bash
cd "$INSTALL_DIR"

echo "Iniciando DLNA Media Player..."

# Iniciar MiniDLNA
echo "Iniciando MiniDLNA..."
sudo systemctl start minidlna
sleep 2

# Iniciar controlador
echo "Iniciando controlador socket..."
if pgrep -f "dlna_controller.py" > /dev/null; then
    echo "El controlador ya está ejecutándose"
    pgrep -f "dlna_controller.py"
else
    nohup python3 src/dlna_controller.py > logs/controller.out 2>&1 &
    sleep 2
    if pgrep -f "dlna_controller.py" > /dev/null; then
        echo "Controlador iniciado exitosamente (PID: \$(pgrep -f dlna_controller.py))"
    else
        echo "Error iniciando controlador"
        exit 1
    fi
fi

echo ""
echo "=== DLNA Media Player Iniciado ==="
echo "MiniDLNA: http://\$(hostname -I | awk '{print \$1}'):8200/"
echo "Socket Control: \$(hostname -I | awk '{print \$1}'):8888"
echo "Videos: $INSTALL_DIR/videos/"
echo "Logs: $INSTALL_DIR/logs/"
echo ""
EOF

    # Script de parada
    cat > "$INSTALL_DIR/scripts/stop.sh" << EOF
#!/bin/bash
echo "Deteniendo DLNA Media Player..."

# Detener controlador
if pgrep -f "dlna_controller.py" > /dev/null; then
    echo "Deteniendo controlador socket..."
    pkill -f "dlna_controller.py"
    sleep 2
fi

# Detener MiniDLNA
echo "Deteniendo MiniDLNA..."
sudo systemctl stop minidlna

echo "DLNA Media Player detenido"
EOF

    # Script de estado
    cat > "$INSTALL_DIR/scripts/status.sh" << EOF
#!/bin/bash
echo "=== Estado DLNA Media Player ==="
echo ""

# Estado MiniDLNA
echo "MiniDLNA:"
if systemctl is-active --quiet minidlna; then
    echo "  ✅ Ejecutándose"
    echo "  URL: http://\$(hostname -I | awk '{print \$1}'):8200/"
else
    echo "  ❌ Detenido"
fi

echo ""

# Estado Controlador
echo "Controlador Socket:"
if pgrep -f "dlna_controller.py" > /dev/null; then
    echo "  ✅ Ejecutándose (PID: \$(pgrep -f dlna_controller.py))"
    echo "  Puerto: 8888"
    echo "  Conexiones: \$(netstat -an | grep :8888 | grep ESTABLISHED | wc -l) activas"
else
    echo "  ❌ Detenido"
fi

echo ""

# Información de videos
echo "Videos disponibles:"
video_count=\$(find "$INSTALL_DIR/videos" -type f \( -iname "*.mp4" -o -iname "*.avi" -o -iname "*.mkv" -o -iname "*.mov" -o -iname "*.wmv" -o -iname "*.flv" \) | wc -l)
echo "  📁 \$video_count archivos en $INSTALL_DIR/videos/"

echo ""

# Red
echo "Red:"
echo "  IP: \$(hostname -I | awk '{print \$1}')"
echo "  Hostname: \$(hostname)"

echo ""

# Espacio en disco
echo "Espacio en disco:"
df -h "$INSTALL_DIR" | tail -1 | awk '{print "  💾 " \$4 " disponible de " \$2 " (" \$5 " usado)"}'
EOF

    # Hacer scripts ejecutables
    chmod +x "$INSTALL_DIR"/scripts/*.sh
    
    log "Scripts de utilidad creados"
}

# Crear ejemplos
create_examples() {
    log "Creando ejemplos de uso..."
    
    # Cliente Python
    cat > "$INSTALL_DIR/examples/client.py" << 'EOF'
#!/usr/bin/env python3
"""
Cliente ejemplo para DLNA Media Player Controller
"""

import socket
import json
import sys

class DLNAClient:
    def __init__(self, host='localhost', port=8888):
        self.host = host
        self.port = port
    
    def send_command(self, command):
        """Enviar comando al servidor"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(10)
            sock.connect((self.host, self.port))
            sock.send(json.dumps(command).encode('utf-8'))
            response = sock.recv(4096).decode('utf-8').strip()
            sock.close()
            return json.loads(response)
        except Exception as e:
            return {"error": str(e)}
    
    def list_videos(self):
        """Listar videos disponibles"""
        return self.send_command({'action': 'list_videos'})
    
    def create_playlist(self, videos):
        """Crear playlist"""
        return self.send_command({'action': 'create_playlist', 'videos': videos})
    
    def play(self):
        """Reproducir video actual"""
        return self.send_command({'action': 'play'})
    
    def next(self):
        """Siguiente video"""
        return self.send_command({'action': 'next'})
    
    def previous(self):
        """Video anterior"""
        return self.send_command({'action': 'previous'})
    
    def status(self):
        """Estado del sistema"""
        return self.send_command({'action': 'status'})

def main():
    if len(sys.argv) < 2:
        print("Uso: python3 client.py <host> [comando]")
        print("Comandos: list, status, play, next, prev")
        return
    
    host = sys.argv[1]
    command = sys.argv[2] if len(sys.argv) > 2 else 'status'
    
    client = DLNAClient(host)
    
    if command == 'list':
        result = client.list_videos()
    elif command == 'status':
        result = client.status()
    elif command == 'play':
        result = client.play()
    elif command == 'next':
        result = client.next()
    elif command == 'prev':
        result = client.previous()
    else:
        result = {"error": "Comando desconocido"}
    
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
EOF

    # Script de pruebas
    cat > "$INSTALL_DIR/examples/test_commands.py" << 'EOF'
#!/usr/bin/env python3
"""
Script de prueba para comandos DLNA
"""

import socket
import json
import time

def send_command(host, port, command):
    """Función auxiliar para enviar comandos"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((host, port))
        sock.send(json.dumps(command).encode('utf-8'))
        response = sock.recv(4096).decode('utf-8')
        sock.close()
        return json.loads(response)
    except Exception as e:
        return {"error": str(e)}

def test_dlna_controller(host='localhost', port=8888):
    """Pruebas básicas del controlador DLNA"""
    print(f"Probando DLNA Controller en {host}:{port}")
    print("=" * 50)
    
    # Test 1: Status
    print("\n1. Estado del sistema:")
    result = send_command(host, port, {'action': 'status'})
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    # Test 2: Listar videos
    print("\n2. Listando videos:")
    result = send_command(host, port, {'action': 'list_videos'})
    print(json.dumps(result, indent=2, ensure_ascii=False))
    videos = result.get('videos', [])
    
    if not videos:
        print("⚠️  No hay videos en el directorio. Agrega algunos archivos .mp4 al directorio videos/")
        return
    
    # Test 3: Crear playlist
    print("\n3. Creando playlist con todos los videos:")
    result = send_command(host, port, {'action': 'create_playlist', 'videos': videos})
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    # Test 4: Play
    print("\n4. Reproducir:")
    result = send_command(host, port, {'action': 'play'})
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    # Test 5: Ver playlist actual
    print("\n5. Playlist actual:")
    result = send_command(host, port, {'action': 'current_playlist'})
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    # Test 6: Siguiente video (si hay más de uno)
    if len(videos) > 1:
        print("\n6. Siguiente video:")
        result = send_command(host, port, {'action': 'next'})
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        print("\n7. Video anterior:")
        result = send_command(host, port, {'action': 'previous'})
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    print("\n✅ Pruebas completadas")

if __name__ == "__main__":
    import sys
    host = sys.argv[1] if len(sys.argv) > 1 else 'localhost'
    test_dlna_controller(host)
EOF

    chmod +x "$INSTALL_DIR"/examples/*.py
    log "Ejemplos creados"
}

# Crear servicio systemd
create_systemd_service() {
    log "Creando servicio systemd..."
    
    cat > "/tmp/$SERVICE_NAME.service" << EOF
[Unit]
Description=DLNA Media Player Controller
After=network.target minidlna.service
Wants=minidlna.service

[Service]
Type=simple
User=pi
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/python3 $INSTALL_DIR/src/dlna_controller.py
Restart=always
RestartSec=10

# Logging
StandardOutput=append:$INSTALL_DIR/logs/service.log
StandardError=append:$INSTALL_DIR/logs/service-error.log

# Environment
Environment=PYTHONPATH=$INSTALL_DIR/src

[Install]
WantedBy=multi-user.target
EOF

    sudo mv "/tmp/$SERVICE_NAME.service" "/etc/systemd/system/"
    sudo systemctl daemon-reload
    sudo systemctl enable "$SERVICE_NAME"
    
    log "Servicio systemd creado y habilitado"
}

# Configurar firewall
configure_firewall() {
    log "Configurando firewall..."
    
    # Si ufw está instalado, configurarlo
    if command_exists ufw; then
        sudo ufw allow 8200/tcp comment 'MiniDLNA'
        sudo ufw allow 8888/tcp comment 'DLNA Controller'
        sudo ufw allow 1900/udp comment 'SSDP'
    fi
    
    log "Firewall configurado"
}

# Crear archivos de configuración adicionales
create_config_files() {
    log "Creando archivos de configuración..."
    
    # Archivo de configuración del media player
    cat > "$INSTALL_DIR/config/mediaplayer.conf" << EOF
# DLNA Media Player Configuration
[server]
socket_port = 8888
dlna_port = 8200

[paths]
videos = $INSTALL_DIR/videos
logs = $INSTALL_DIR/logs
tmp = $INSTALL_DIR/tmp

[dlna]
friendly_name = RaspberryPi Media Player
refresh_interval = 5

[logging]
level = INFO
max_size = 10MB
backup_count = 5
EOF

    # Script de video de prueba
    cat > "$INSTALL_DIR/scripts/download_sample.sh" << 'EOF'
#!/bin/bash
# Descargar video de prueba
echo "Descargando video de prueba..."
cd "$INSTALL_DIR/videos"

# Crear video de prueba con ffmpeg si está disponible
if command -v ffmpeg >/dev/null 2>&1; then
    echo "Generando video de prueba..."
    ffmpeg -f lavfi -i testsrc=duration=10:size=320x240:rate=1 -c:v libx264 -y test_video.mp4
    echo "Video de prueba creado: test_video.mp4"
else
    echo "ffmpeg no encontrado. Instala ffmpeg para generar video de prueba:"
    echo "sudo apt install ffmpeg"
fi
EOF

    chmod +x "$INSTALL_DIR/scripts/download_sample.sh"
    
    log "Archivos de configuración creados"
}

# Mostrar información final
show_final_info() {
    local ip_address
    ip_address=$(hostname -I | awk '{print $1}')
    
    echo ""
    echo -e "${GREEN}======================================${NC}"
    echo -e "${GREEN}  Instalación Completada ✅          ${NC}"
    echo -e "${GREEN}======================================${NC}"
    echo ""
    echo -e "${BLUE}📁 Directorio de instalación:${NC} $INSTALL_DIR"
    echo -e "${BLUE}🎬 Directorio de videos:${NC} $INSTALL_DIR/videos"
    echo -e "${BLUE}📝 Logs:${NC} $INSTALL_DIR/logs"
    echo ""
    echo -e "${BLUE}🌐 URLs de acceso:${NC}"
    echo "   MiniDLNA: http://$ip_address:8200/"
    echo "   Socket Control: $ip_address:8888"
    echo ""
    echo -e "${BLUE}🚀 Comandos disponibles:${NC}"
    echo "   Iniciar:  cd ~/mediaplayer && ./scripts/start.sh"
    echo "   Detener:  cd ~/mediaplayer && ./scripts/stop.sh"
    echo "   Estado:   cd ~/mediaplayer && ./scripts/status.sh"
    echo ""
    echo -e "${BLUE}🔧 Servicio systemd:${NC}"
    echo "   sudo systemctl start $SERVICE_NAME"
    echo "   sudo systemctl status $SERVICE_NAME"
    echo ""
    echo -e "${BLUE}📖 Ejemplos y documentación:${NC}"
    echo "   Ejemplos: ~/mediaplayer/examples/"
    echo "   README:   ~/mediaplayer/README.md"
    echo ""
    echo -e "${YELLOW}📋 Próximos pasos:${NC}"
    echo "1. Copia tus videos a: $INSTALL_DIR/videos/"
    echo "2. Inicia el sistema: cd ~/mediaplayer && ./scripts/start.sh"
    echo "3. Configura tu Samsung QB43n para DLNA"
    echo "4. Prueba los ejemplos en ~/mediaplayer/examples/"
    echo ""
    echo -e "${GREEN}¡Instalación exitosa! 🎉${NC}"
    echo ""
}

# Función de limpieza en caso de error
cleanup_on_error() {
    error "Error durante la instalación. Limpiando..."
    
    # Detener servicios si están corriendo
    sudo systemctl stop "$SERVICE_NAME" 2>/dev/null || true
    sudo systemctl disable "$SERVICE_NAME" 2>/dev/null || true
    
    # Remover servicio systemd
    sudo rm -f "/etc/systemd/system/$SERVICE_NAME.service" 2>/dev/null || true
    sudo systemctl daemon-reload 2>/dev/null || true
    
    warn "Limpieza completada. El directorio $INSTALL_DIR se mantiene para inspección."
}

# Función principal
main() {
    # Trap para limpieza en caso de error
    trap cleanup_on_error ERR
    
    echo "Iniciando instalación..."
    echo "Directorio de instalación: $INSTALL_DIR"
    echo ""
    
    # Confirmar instalación
    echo -e "${YELLOW}¿Continuar con la instalación? (Y/n):${NC}"
    read -r response
    if [[ "$response" =~ ^[Nn]$ ]]; then
        log "Instalación cancelada por el usuario"
        exit 0
    fi
    
    # Ejecutar pasos de instalación
    check_internet
    update_system
    install_dependencies
    create_directories
    configure_minidlna
    create_controller
    create_scripts
    create_examples
    create_systemd_service
    configure_firewall
    create_config_files
    
    # Iniciar servicios
    log "Iniciando servicios..."
    sudo systemctl start minidlna
    sudo systemctl start "$SERVICE_NAME"
    
    # Verificar que todo esté funcionando
    sleep 3
    if systemctl is-active --quiet minidlna && systemctl is-active --quiet "$SERVICE_NAME"; then
        log "Servicios iniciados correctamente"
    else
        warn "Algunos servicios pueden no haberse iniciado correctamente. Verifica con: sudo systemctl status minidlna $SERVICE_NAME"
    fi
    
    show_final_info
}

# Ejecutar instalación
main "$@"