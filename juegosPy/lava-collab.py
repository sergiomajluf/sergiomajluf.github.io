import time
import random
from IPython.display import clear_output

def clear_screen():
    clear_output(wait=True)

def main():
    # Pongale weno a las instrucciones
    print("🔥 EL SUELO ES LAVA - VERSIÓN MEMORICE 🔥")
    print("\n¡Ey! ¿Listo para este desafío?")
    print("📝 Acá van las reglas (súper fácil):")
    print("- Hay un tablero con lava 🔥 por todos lados")
    print("- Solo hay UN lugar seguro 🟢 por fila, el resto es lava mortal")
    print("- Te muestro el tablero por 4 segundos... ¡memoriza rápido!")
    print("- Después desaparece y tienes que acordarte dónde pisasr")
    print("- Si le pegas a todos, +1 punto y el tablero se hace más difícil")
    print("- Si te equivocas... RIP 💀 fin del juego")
    print("- El objetivo: ver hasta dónde llegas sin freírte 😅")
    print("─" * 60)
    
    nombre = input("¿Cómo te llamas? ")
    clear_screen()
   
    print("¡Qué tal", nombre, "! Ahora elige tu nivel:")
    print("🎮 Niveles disponibles:")
    print("1. EASY (3 filas) - Para principiantes 😊")
    print("2. MEDIUM (4 filas) - Un poco más intenso 😬")
    print("3. HARDCORE (6 filas) - Solo para valientes 😈")
    nivel = input("¿Cuál eliges? (1-3): ")
   
    filas = 3 if nivel == "1" else 4 if nivel == "2" else 6
    puntos = 0
    columnas = 1
    jugar = True
   
    nivel_nombre = "EASY" if nivel == "1" else "MEDIUM" if nivel == "2" else "HARDCORE"
    print("\n¡Genial! Elegiste", nivel_nombre, "con", filas, "filas.")
    print("Prepárate que esto se va a poner bueno... 🔥")
    input("Dale Enter cuando estés listo...")
    
    # Variables para mantener el tablero
    seguros = []
    tablero = []
    
    while jugar:
        # Si es la primera ronda, crear tablero desde cero
        if columnas == 1:
            seguros = []
            tablero = []
            # Generar la primera columna
            seguro = random.randint(0, filas - 1)
            seguros.append(seguro)
            columna = []
            for f in range(filas):
                columna.append('🟢' if f == seguro else '🔥')
            tablero.append(columna)
        else:
            # Agregar solo una nueva columna, manteniendo las anteriores
            seguro = random.randint(0, filas - 1)  # Solo para la nueva columna
            seguros.append(seguro)
            nueva_columna = []
            for f in range(filas):
                nueva_columna.append('🟢' if f == seguro else '🔥')
            tablero.append(nueva_columna)
       
        # Mostrar estado actual del juego
        print("\n" + "━"*50)
        print("🎮", nombre, "| 🎯", nivel_nombre)
        print("🔄 Ronda:", columnas, "| ⭐ Puntos:", puntos)
        print("📊 Columnas:", columnas)
        print("━"*50)
        
        # Mostrar el tablero con formato del PDF
        print("\n🏁 TABLERO RONDA", str(columnas) + ":")
        
        # Mostrar números de columna si hay más de una
        if columnas > 1:
            print("    ", end="")
            for c in range(columnas):
                print(" C" + str(c+1) + " ", end="")
            print()
        
        # Mostrar cada fila del tablero con emojis
        for f in range(filas):
            fila_str = " ".join(tablero[c][f] for c in range(columnas))
            print("F" + str(f+1) + ": " + fila_str)
        
        print("\n💡 ¡Memoriza dónde están las zonas seguras 🟢!")
        print("⏰ Tienes 4 segundos antes de que desaparezca...")
       
        # Tiempo fijo de 4 segundos según especificaciones
        time.sleep(4)
        clear_screen()
       
        # Solicitar las respuestas del jugador
        print("\n💨 ¡Puf! El tablero desapareció...")
        print("🧠 Ahora a ver qué tan buena es tu memoria...")
        if columnas == 1:
            print("🎯 Solo tienes que recordar 1 zona segura. ¡Fácil!")
        else:
            print("🎯 Tienes que recordar", columnas, "zonas seguras. ¡A ver si puedes!")
        print("💭 Recuerda: cada columna tiene solo UNA zona segura 🟢\n")
        
        acierto = True
        for c in range(columnas):
            try:
                respuesta = int(input("🤔 ¿En qué fila estaba la zona segura de la COLUMNA " + str(c+1) + "? (1-" + str(filas) + "): ")) - 1
                if respuesta != seguros[c]:
                    acierto = False
                    print("\n💥 ¡AUCH! Te freíste en la lava...")
                    print("😵 La zona segura de la columna", c+1, "estaba en la fila", seguros[c]+1)
                    break
                else:
                    if columnas == 1:
                        print("🎉 ¡Dale! Lo clavaste.")
                    else:
                        print("✨ ¡Perfecto! Columna", c+1, "✓")
            except:
                acierto = False
                print("\n🤦 Eso no es un número válido... ¡a la lava!")
                break
       
        if acierto:
            puntos += 1
            columnas += 1
            print("\n🚀 ¡INCREÍBLE! Pasaste la ronda", columnas-1)
            print("⭐ Puntos:", puntos)
            if columnas <= 3:
                print("🔥 Ahora viene una columna más... se pone más difícil")
            elif columnas <= 5:
                print("😰", columnas, "columnas... esto ya se pone serio")
            else:
                print("🤯", columnas, "columnas?! Eres una bestia de la memoria")
            input("\nDale Enter para la siguiente ronda...")
        else:
            print("\n💀 F en el chat... te freíste.")
            puntos_msg = "¡Al menos conseguiste 1 punto!" if puntos == 1 else ("Conseguiste " + str(puntos) + " puntos" if puntos > 1 else "0 puntos... uff, hay que practicar más 😅")
            print("📊 PUNTAJE FINAL:", puntos_msg)
            print("🔍 Las zonas seguras eran:")
            for i, pos in enumerate(seguros):
                print("  📍 Columna " + str(i+1) + ": Fila " + str(pos+1) + " 🟢")
            
            print("\n🎮 ¿Otra ronda,", nombre, "? No te rindas...")
            jugar = input("¿Sí o no? (s/n): ").lower() == 's'
            if jugar:
                puntos = 0
                columnas = 1
                seguros = []  # Reiniciar el tablero
                tablero = []
                print("\n🔄 ¡Dale!", nombre, "va por la revancha")
                input("Enter para empezar de nuevo...")

    # Mensaje de despedida según especificaciones
    print("\n👋 ¡Chao", nombre, "! Estuvo bueno el juego")
    print("🎮 Vuelve cuando quieras a desafiar tu memoria")
    print("🔥 ¡La lava siempre estará esperando! 😈")

if __name__ == "__main__":
    main()