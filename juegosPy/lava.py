import time
import random
import os

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

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
   
    print(f"¡Qué tal {nombre}! Ahora elige tu nivel:")
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
    print(f"\n¡Genial! Elegiste {nivel_nombre} con {filas} filas.")
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
        print(f"\n{'━'*50}")
        print(f"🎮 {nombre} | 🎯 {nivel_nombre}")
        print(f"🔄 Ronda: {columnas} | ⭐ Puntos: {puntos}")
        print(f"📊 Columnas: {columnas}")
        print(f"{'━'*50}")
        
        # Mostrar el tablero con formato del PDF
        print(f"\n🏁 TABLERO RONDA {columnas}:")
        
        # Mostrar números de columna si hay más de una
        if columnas > 1:
            print("    ", end="")
            for c in range(columnas):
                print(f" C{c+1} ", end="")
            print()
        
        # Mostrar cada fila del tablero con emojis
        for f in range(filas):
            fila_str = " ".join(tablero[c][f] for c in range(columnas))
            print(f"F{f+1}: {fila_str}")
        
        print(f"\n💡 ¡Memoriza dónde están las zonas seguras 🟢!")
        print("⏰ Tienes 4 segundos antes de que desaparezca...")
       
        # Tiempo fijo de 4 segundos según especificaciones
        time.sleep(4)
        clear_screen()
       
        # Solicitar las respuestas del jugador
        print(f"\n💨 ¡Puf! El tablero desapareció...")
        print(f"🧠 Ahora a ver qué tan buena es tu memoria...")
        if columnas == 1:
            print("🎯 Solo tienes que recordar 1 zona segura. ¡Fácil!")
        else:
            print(f"🎯 Tienes que recordar {columnas} zonas seguras. ¡A ver si puedes!")
        print(f"💭 Recuerda: cada columna tiene solo UNA zona segura 🟢\n")
        
        acierto = True
        for c in range(columnas):
            try:
                respuesta = int(input(f"🤔 ¿En qué fila estaba la zona segura de la COLUMNA {c+1}? (1-{filas}): ")) - 1
                if respuesta != seguros[c]:
                    acierto = False
                    print(f"\n💥 ¡AUCH! Te freíste en la lava...")
                    print(f"😵 La zona segura de la columna {c+1} estaba en la fila {seguros[c]+1}")
                    break
                else:
                    if columnas == 1:
                        print(f"🎉 ¡Dale! Lo clavaste.")
                    else:
                        print(f"✨ ¡Perfecto! Columna {c+1} ✓")
            except:
                acierto = False
                print("\n🤦 Eso no es un número válido... ¡a la lava!")
                break
       
        if acierto:
            puntos += 1
            columnas += 1
            print(f"\n🚀 ¡INCREÍBLE! Pasaste la ronda {columnas-1}")
            print(f"⭐ Puntos: {puntos}")
            if columnas <= 3:
                print(f"🔥 Ahora viene una columna más... se pone más difícil")
            elif columnas <= 5:
                print(f"😰 {columnas} columnas... esto ya se pone serio")
            else:
                print(f"🤯 {columnas} columnas?! Eres una bestia de la memoria")
            input("\nDale Enter para la siguiente ronda...")
        else:
            print(f"\n💀 F en el chat... te freíste.")
            puntos_msg = "¡Al menos conseguiste 1 punto!" if puntos == 1 else f"Conseguiste {puntos} puntos" if puntos > 1 else "0 puntos... uff, hay que practicar más 😅"
            print(f"📊 PUNTAJE FINAL: {puntos_msg}")
            print("🔍 Las zonas seguras eran:")
            for i, pos in enumerate(seguros):
                print(f"  📍 Columna {i+1}: Fila {pos+1} 🟢")
            
            print(f"\n🎮 ¿Otra ronda, {nombre}? No te rindas...")
            jugar = input("¿Sí o no? (s/n): ").lower() == 's'
            if jugar:
                puntos = 0
                columnas = 1
                seguros = []  # Reiniciar el tablero
                tablero = []
                print(f"\n🔄 ¡Dale! {nombre} va por la revancha")
                input("Enter para empezar de nuevo...")

    # Mensaje de despedida según especificaciones
    print(f"\n👋 ¡Chao {nombre}! Estuvo bueno el juego")
    print("🎮 Vuelve cuando quieras a desafiar tu memoria")
    print("🔥 ¡La lava siempre estará esperando! 😈")

if __name__ == "__main__":
    main()