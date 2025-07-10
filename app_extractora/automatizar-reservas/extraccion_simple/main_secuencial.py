import subprocess
import time
from mi_extractor_secuencial import abrir_navegador, abrir_navegador_interfaz, extraer_info

def lanzar_proceso_para_campo(nombre_campo):
    print(f"🚀 Lanzando extracción para: {nombre_campo}")
    driver = abrir_navegador()  # O usa abrir_navegador_interfaz() si quieres ver el navegador
    extraer_info(driver, nombre_campo)

def leer_campos_desde_properties(path=r"app_extractora\automatizar-reservas\extraccion_simple\properties\propiedades.properties"):
    with open(path, "r", encoding="utf-8") as f:
        campos = [line.strip() for line in f if line.strip()]
        print("📋 Campos encontrados en el archivo properties:")
        for campo in campos:
            print("-", campo)
        return campos

if __name__ == "__main__":
    campos = leer_campos_desde_properties()
    input("Introduce ENTER para iniciar la extracción de forma secuencial...")

    for campo in campos:
        lanzar_proceso_para_campo(campo)
        time.sleep(2)  # Pausa opcional entre campos

    print("✅ Todos los campos han sido procesados secuencialmente.")

    # Inicia la aplicación Spring Boot
    try:
        print("🚀 Iniciando aplicación Spring Boot...")
        # Ajusta esta ruta a la ubicación de tu proyecto
        ruta_jar = r"C:\Users\pedro\Desktop\Carlos Programacion\TFG\para_clase\proyecto_f7_plus - actual - trabajando\app_consumidora\proyecto_furbol - e\backend\Futbol\target\Futbol-0.0.1-SNAPSHOT.jar"

        subprocess.run(["java", "-jar", ruta_jar], check=True)
        print("✅ Aplicación Spring Boot lanzada correctamente.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al iniciar la aplicación Spring Boot: {e}")


