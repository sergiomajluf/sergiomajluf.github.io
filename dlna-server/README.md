# DLNA Media Player for Raspberry Pi

Un servidor DLNA ligero y controlable para Raspberry Pi que permite streaming de videos a displays Samsung (como el QB43n) con control de playlists vía socket.

## Características

- ✅ Servidor DLNA usando MiniDLNA
- ✅ Control remoto vía socket TCP
- ✅ Gestión de playlists programática
- ✅ Streaming sin elementos de UI
- ✅ Compatible con Samsung QB43n
- ✅ API JSON para control externo
- ✅ Auto-instalación y configuración

## Instalación Rápida

1. **Descargar e instalar:**
```bash
wget https://sergiomajluf.github.io/dlna-server/main.zip
unzip main.zip
cd dlna-mediaplayer-main
chmod +x install.sh
./install.sh
```

O instalar directamente:
```bash
curl -sSL https://https://sergiomajluf.github.io/dlna-server/install.sh | bash
```

2. **El script de instalación se encarga de:**
   - Instalar dependencias (MiniDLNA, Python3)
   - Crear directorio `~/mediaplayer/`
   - Configurar MiniDLNA
   - Instalar el controlador socket
   - Configurar servicios systemd
   - Crear scripts de utilidad

## Estructura del Proyecto

```
~/mediaplayer/
├── videos/              # Directorio para archivos de video
├── config/
│   └── minidlna.conf   # Configuración MiniDLNA
├── src/
│   └── dlna_controller.py  # Servidor de control
├── scripts/
│   ├── start.sh        # Iniciar servicios
│   ├── stop.sh         # Detener servicios
│   └── status.sh       # Ver estado
├── examples/
│   ├── client.py       # Cliente Python ejemplo
│   └── test_commands.py # Comandos de prueba
└── logs/               # Logs del sistema
```

## Uso

### Iniciar el Sistema
```bash
cd ~/mediaplayer
./scripts/start.sh
```

### Detener el Sistema
```bash
cd ~/mediaplayer
./scripts/stop.sh
```

### Ver Estado
```bash
cd ~/mediaplayer
./scripts/status.sh
```

## Control por Socket

El servidor escucha en el puerto **8888** por defecto y acepta comandos JSON.

### Comandos Disponibles

#### Listar Videos
```json
{"action": "list_videos"}
```
**Respuesta:**
```json
{"videos": ["video1.mp4", "video2.mp4", "video3.mp4"]}
```

#### Crear Playlist
```json
{
  "action": "create_playlist",
  "videos": ["video1.mp4", "video2.mp4"]
}
```
**Respuesta:**
```json
{"playlist_created": true, "video_count": 2}
```

#### Reproducir Video Actual
```json
{"action": "play"}
```

#### Siguiente Video
```json
{"action": "next"}
```

#### Video Anterior
```json
{"action": "previous"}
```

#### Ver Playlist Actual
```json
{"action": "current_playlist"}
```

#### Ver Estado del Sistema
```json
{"action": "status"}
```

### Ejemplos de Cliente

#### Python
```python
import socket
import json

def send_command(command):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect(('192.168.1.100', 8888))  # IP de tu Raspberry Pi
    sock.send(json.dumps(command).encode('utf-8'))
    response = sock.recv(1024).decode('utf-8')
    sock.close()
    return json.loads(response)

# Crear playlist
playlist = send_command({
    'action': 'create_playlist',
    'videos': ['movie1.mp4', 'movie2.mp4']
})
print(playlist)

# Reproducir
play_response = send_command({'action': 'play'})
print(play_response)
```

#### Bash/cURL (usando netcat)
```bash
# Listar videos
echo '{"action": "list_videos"}' | nc 192.168.1.100 8888

# Crear playlist
echo '{"action": "create_playlist", "videos": ["test.mp4"]}' | nc 192.168.1.100 8888
```

#### Node.js
```javascript
const net = require('net');

function sendCommand(command) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.connect(8888, '192.168.1.100', () => {
            client.write(JSON.stringify(command));
        });
        
        client.on('data', (data) => {
            resolve(JSON.parse(data.toString()));
            client.destroy();
        });
        
        client.on('error', reject);
    });
}

// Uso
sendCommand({action: 'list_videos'}).then(console.log);
```

## Configuración Samsung QB43n

1. **Habilitar DLNA:**
   - Settings → Network → Multimedia Device Settings
   - Enable "Access Notification"

2. **Auto-reproducción:**
   - Settings → System → Auto Play → Enable

3. **Ocultar UI:**
   - Settings → Picture → Picture Options → Information Display → Off
   - Settings → System → Menu Display Time → Off

## Formatos de Video Soportados

- MP4 (H.264/H.265)
- AVI
- MKV
- MOV
- WMV
- FLV

## API REST (Opcional)

Si necesitas una API REST en lugar de sockets, modifica `dlna_controller.py` para usar Flask:

```python
from flask import Flask, jsonify, request
app = Flask(__name__)

@app.route('/api/videos', methods=['GET'])
def get_videos():
    # Implementación
    pass

@app.route('/api/playlist', methods=['POST'])
def create_playlist():
    # Implementación
    pass
```

## Logs y Troubleshooting

### Ver Logs
```bash
# Logs MiniDLNA
sudo journalctl -u minidlna -f

# Logs del controlador
tail -f ~/mediaplayer/logs/controller.log
```

### Problemas Comunes

1. **Videos no aparecen en DLNA:**
   - Verificar permisos: `sudo chown -R minidlna:minidlna ~/mediaplayer/videos/`
   - Reiniciar servicio: `sudo systemctl restart minidlna`

2. **Samsung no encuentra el servidor:**
   - Verificar red: `ping [IP_SAMSUNG]`
   - Verificar puerto: `netstat -tlnp | grep 8200`

3. **Socket no responde:**
   - Verificar proceso: `ps aux | grep dlna_controller`
   - Verificar puerto: `netstat -tlnp | grep 8888`

## Desarrollo

### Estructura del Código
- `src/dlna_controller.py`: Servidor principal de control
- `config/minidlna.conf`: Configuración DLNA
- `scripts/`: Scripts de utilidad del sistema

### Contribuir
1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

MIT License - ver archivo LICENSE para detalles

## Soporte

- **Issues:** https://github.com/tu-repo/dlna-mediaplayer/issues
- **Documentación:** https://github.com/tu-repo/dlna-mediaplayer/wiki
- **Ejemplos:** `~/mediaplayer/examples/`

---

**Hecho con ❤️ para Raspberry Pi y Samsung Displays**