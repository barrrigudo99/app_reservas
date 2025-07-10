from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import ast
from collections import defaultdict
import json
from transformador import insertar_resumen_a_mongo
from datetime import datetime, timedelta

# abrir navegador con interfaz
def abrir_navegador_interfaz():
    options = Options()
    options.add_argument("--incognito")
    options.add_argument("--start-maximized")
   # options.add_argument("--headless=new")
    chrome_driver_path = r"app_extractora\automatizar-reservas\extraccion_simple\driver\chromedriver-win64\chromedriver.exe"
    service = Service(chrome_driver_path)
    return webdriver.Chrome(service=service, options=options)

def abrir_navegador():
    options = Options()
    options.add_argument("--incognito")
    options.add_argument("--start-maximized")
    options.add_argument("--headless=new")  # Modo headless optimizado
    options.add_argument("--disable-gpu")  # Por compatibilidad extra
    options.add_argument("--window-size=1920,1080")  # Necesario en headless

    chrome_driver_path = r"app_extractora\automatizar-reservas\extraccion_simple\driver\chromedriver-win64\chromedriver.exe"
    service = Service(chrome_driver_path)
    return webdriver.Chrome(service=service, options=options)


def hacer_login(driver):
    wait = WebDriverWait(driver, 10)
    driver.get("https://deportesweb.madrid.es/DeportesWeb/Login")

    login_div = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "navigation-section-widget-collection-item-image-icon-square")))
    login_div.click()

    campo_correo = wait.until(EC.presence_of_element_located((By.ID, "ContentFixedSection_uLogin_txtIdentificador")))
    campo_contrasena = wait.until(EC.presence_of_element_located((By.ID, "ContentFixedSection_uLogin_txtContrasena")))

    #input("Introduce ENTER para continuar con login...")
    campo_correo.send_keys("carlosbarrientoslopez@gmail.com")
    campo_contrasena.send_keys("Lopezpipo99@")

    boton_login = wait.until(EC.element_to_be_clickable((By.ID, "ContentFixedSection_uLogin_btnLogin")))
    boton_login.click()

    print("✅ Login realizado.")

def cerrar_popup(driver):
    try:
        alerta = WebDriverWait(driver, 3).until(
            EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Aceptar']")))
        alerta.click()
        print("⚠️ Popup cerrado.")
    except:
        print("✅ No apareció popup.")

def ir_a_reservas(driver, nombre_campo):
    driver.get("https://deportesweb.madrid.es/DeportesWeb/Modulos/VentaServicios/Alquileres/ReservaEspacios?token=5F47B0942AD5C1AEC2D4D3F8309C4FA4FF1A2FCB92F3953045F815AD0CB700CC")

    chopera_element = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.XPATH, f"//h4[text()='{nombre_campo}']/ancestor::li")))
    chopera_element.click()

    futbol7 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//h4[contains(text(),'Fútbol 7')]/ancestor::li")))
    futbol7.click()
    print("✅ Página de escoger día cargada.")

def clickar_fecha(driver, fecha):
    print("⌛ Esperando calendario...")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//td[@data-action='selectDay']"))
    )
    print("📅 Calendario cargado.")
    #input("Introduce ENTER para clickar en el " + fecha + "...")

    elemento = driver.find_element(By.CSS_SELECTOR, f'td[data-day="{fecha}"]')
    xpath = obtener_xpath(driver, elemento)
    print("xpath: " + xpath)
    mi_xpath = extraer_ultimos_xpath_segmentos(xpath, cantidad=9)
    mi_xpath_def = "//*[@id='ContentFixedSection_uReservaEspacios_uFechaSeleccionar_datetimepicker']"+mi_xpath
    print("mi_xpath: " + mi_xpath_def)


    driver.execute_script(f"""
        var xpath = "{mi_xpath_def}";
        var el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (el) el.click();
    """)
    print("📍 XPath largo ejecutado para el día", fecha)

def obtener_mes_actual(driver):
    time.sleep(0.5)
    texto = driver.execute_script("""
        const elemento = document.querySelector(
            "#ContentFixedSection_uReservaEspacios_uFechaSeleccionar_datetimepicker > div > ul > li:nth-child(1) > div > div.datepicker-days > table > thead > tr:nth-child(1) > th.picker-switch"
        );
        return elemento ? elemento.textContent.trim() : null;
    """)

    # Diccionario de traducción
    meses = {
        "enero": "01", "febrero": "02", "marzo": "03", "abril": "04",
        "mayo": "05", "junio": "06", "julio": "07", "agosto": "08",
        "septiembre": "09", "octubre": "10", "noviembre": "11", "diciembre": "12"
    }

    if texto:
        mes_texto, anio = texto.lower().split()
        mes_num = meses.get(mes_texto)
        if mes_num:
            return f"{mes_num}/{anio}"
    
    return None  # Por si algo sale mal


def calcular_proximos_dias(fecha_str):
    """
    Recibe una fecha en formato 'd/mm/yyyy' o 'dd/mm/yyyy' y devuelve
    una lista con los próximos 6 días en formato 'dd/mm/yyyy'.
    """
    try:
        fecha_base = datetime.strptime(fecha_str, "%d/%m/%Y")
    except ValueError as e:
        print(f"❌ Error al convertir la fecha '{fecha_str}':", e)
        return []

    proximos = [
        (fecha_base + timedelta(days=i)).strftime("%d/%m/%Y")
        for i in range(1, 7)
    ]
    return proximos


def pulsar_continuar(driver):
    #input("Introduce ENTER para pulsar 'Continuar'...")
    boton_continuar = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "ContentFixedSection_uReservaEspacios_uFechaSeleccionar_btnContinuar")))
    boton_continuar.click()
    print("✅ Botón 'Continuar' pulsado.")
    time.sleep(1)


def obtener_xpath(driver, element):
    return driver.execute_script("""
        function getElementXPath(el) {
            while (el && el.nodeType === Node.ELEMENT_NODE) {
                if (el.id === 'ContentFixedSection_uReservaEspacios_uFechaSeleccionar_datetimepicker') {
                    return "//div[@id='ContentFixedSection_uReservaEspacios_uFechaSeleccionar_datetimepicker']" + path;
                }
                let index = 1;
                let sibling = el.previousElementSibling;
                while (sibling) {
                    if (sibling.tagName === el.tagName) index++;
                    sibling = sibling.previousElementSibling;
                }
                let tag = el.tagName.toLowerCase();
                path = '/' + tag + '[' + index + ']' + (typeof path !== 'undefined' ? path : '');
                el = el.parentNode;
            }
            return path;
        }
        let path;
        return getElementXPath(arguments[0]);
    """, element)

def extraer_ultimos_xpath_segmentos(xpath, cantidad):
    partes = xpath.strip().split('/')
    ultimos = partes[-cantidad:]  # Últimos N segmentos
    return '/' + '/'.join(ultimos)

def clickar_hora(driver, hora):
    driver.execute_script(""" document.querySelector("#ContentFixedSection_uReservaEspacios_uReservaCuadrante_img1001520830").click() """)
    time.sleep(1)
    alert = driver.switch_to.alert
    alert.dismiss()  # Esto pulsa "Cancelar"

import time
from selenium.common.exceptions import NoAlertPresentException

def clickar_hora2(driver, hora):
    driver.execute_script("""
        const tabla = document.querySelector("#ContentFixedSection_uReservaEspacios_uReservaCuadrante_tblCasillas");
        const fila = tabla.querySelector('tr[align="center"]');
        const celdas = fila.querySelectorAll('td');
        const horaBuscada = arguments[0]; // Recibimos la hora desde Python

        celdas.forEach(td => {
            const img = td.querySelector('img');
            if (img) {
                const onclick = img.getAttribute('onclick');
                if (onclick) {
                    const match = onclick.match(/'(\d{2}:\d{2})'/);
                    if (match) {
                        const hora = match[1];
                        if (hora === horaBuscada) {
                            console.log("Haciendo clic en el bloque de la hora:", hora);
                            img.click();
                        }
                    }
                }
            }
        });
    """, hora)
    
    time.sleep(1)  # Esperamos por si aparece un popup

    # Intentamos capturar la alerta si aparece
    try:
        alert = driver.switch_to.alert
        alert.dismiss()  # Pulsamos 'Cancelar'
        print("⚡ Alerta detectada y cancelada.")
    except NoAlertPresentException:
        print("✅ No apareció ninguna alerta después de hacer click.")


def pulsar_reservar(driver):
     driver.execute_script(""" document.querySelector("#ContentFixedSection_uReservaEspacios_uReservaCuadrante_btnReservar").click() """)
     
def extraerDiaActivo(driver):
    dia = driver.execute_script("""
        const elemento = document.querySelector(".day.active.today");
        if (elemento) {
            return elemento.textContent.trim(); 
        }
        return null;
    """)
    # Asegurar que siempre tenga 2 dígitos
    return dia.zfill(2) if dia else None

def extraerRangoDias(driver, dia_acual):
    return driver.execute_script("""
        const elemento = document.querySelector('.data-day').setAttribute('data-day', '12/05/2025');
        if (elemento) { -
            return elemento.textContent.trim(); 
        }
        return null;
    """)

def extraerNombreCampo(driver):
    return driver.execute_script("""
        const elemento = document.querySelector("h2");
        if (elemento) {
            return elemento.textContent.trim(); 
        }
        return null;
    """)

def hay_datos_en_tabla(driver):
    script = """
    const tbody = document.querySelector("#ContentFixedSection_uReservaEspacios_uReservaCuadrante_tblCasillas > tbody");
    if (!tbody) return false;
    const filas = tbody.querySelectorAll("tr");
    return filas.length > 1;
    """
    return driver.execute_script(script)

def extraerHorasDisponibles(driver):
    if not hay_datos_en_tabla(driver):
        print("⚠️ Tabla vacía. No se extraen horas.")
        return []  # ← No hay datos, devolvemos lista vacía

    # Si hay datos, ejecutamos el JavaScript para extraerlos
    return driver.execute_script("""
        const filaSelector_campo1 = "#ContentFixedSection_uReservaEspacios_uReservaCuadrante_tblCasillas > tbody > tr:nth-child(2)";
        const filaSelector_campo2 = "#ContentFixedSection_uReservaEspacios_uReservaCuadrante_tblCasillas > tbody > tr:nth-child(3)";
        const fila1 = document.querySelector(filaSelector_campo1);
        const fila2 = document.querySelector(filaSelector_campo2);

        const celdas1 = fila1 ? fila1.querySelectorAll("td") : [];
        const celdas2 = fila2 ? fila2.querySelectorAll("td") : [];

        const resultados1 = [];
        const resultados2 = [];

        celdas1.forEach(td => {
            const img = td.querySelector("img");
            if (img) {
                const id = img.getAttribute("id") || "";
                const src = img.getAttribute("src") || "";
                const hora = id.slice(-4);
                const estado = src.substring(src.lastIndexOf('/') + 1);
                resultados1.push({ campo: "Campo 1", hora, estado });
            }
        });

        celdas2.forEach(td => {
            const img = td.querySelector("img");
            if (img) {
                const id = img.getAttribute("id") || "";
                const src = img.getAttribute("src") || "";
                const hora = id.slice(-4);
                const estado = src.substring(src.lastIndexOf('/') + 1);
                resultados2.push({ campo: "Campo 2", hora, estado });
            }
        });

        return resultados1.concat(resultados2);
    """)

def extraerHorasDisponibles2(driver):
    return driver.execute_script("""
        const filaSelector_campo1 = "#ContentFixedSection_uReservaEspacios_uReservaCuadrante_tblCasillas > tbody > tr:nth-child(2)";
        const filaSelector_campo2 = "#ContentFixedSection_uReservaEspacios_uReservaCuadrante_tblCasillas > tbody > tr:nth-child(3)";
        const fila1 = document.querySelector(filaSelector_campo1);
        const fila2 = document.querySelector(filaSelector_campo2);

        const celdas1 = fila1 ? fila1.querySelectorAll("td") : [];
        const celdas2 = fila2 ? fila2.querySelectorAll("td") : [];

        const resultados1 = [];
        const resultados2 = [];

        celdas1.forEach(td => {
            const img = td.querySelector("img");
            if (img) {
                const id = img.getAttribute("id") || "";
                const src = img.getAttribute("src") || "";
                const hora = id.slice(-4);
                const estado = src.substring(src.lastIndexOf('/') + 1);
                resultados1.push({ campo: "Campo 1", hora, estado });
            }
        });

        celdas2.forEach(td => {
            const img = td.querySelector("img");
            if (img) {
                const id = img.getAttribute("id") || "";
                const src = img.getAttribute("src") || "";
                const hora = id.slice(-4);
                const estado = src.substring(src.lastIndexOf('/') + 1);
                resultados2.push({ campo: "Campo 2", hora, estado });
            }
        });

        return resultados1.concat(resultados2);  // <-- ESTE return es clave
    """)

def exportar_csv(driver, nombre_campo, dia_actual):
    nombre_archivo = f"{nombre_campo}_{dia_actual}.csv"
    driver.execute_script(f"""
        function exportarCSV(datos, nombreArchivo) {{
            const cabecera = "Campo,Hora,Estado\\n";
            const filas = datos.map(d => `${{d.campo}},${{d.hora}},${{d.estado}}`).join("\\n");
            const csv = cabecera + filas;

            const blob = new Blob([csv], {{ type: "text/csv;charset=utf-8;" }});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = nombreArchivo;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }}

        // Recoger datos directamente del DOM
        const filaSelector_campo1 = "#ContentFixedSection_uReservaEspacios_uReservaCuadrante_tblCasillas > tbody > tr:nth-child(2)";
        const filaSelector_campo2 = "#ContentFixedSection_uReservaEspacios_uReservaCuadrante_tblCasillas > tbody > tr:nth-child(3)";
        const fila1 = document.querySelector(filaSelector_campo1);
        const fila2 = document.querySelector(filaSelector_campo2);

        const celdas1 = fila1 ? fila1.querySelectorAll("td") : [];
        const celdas2 = fila2 ? fila2.querySelectorAll("td") : [];

        const resultados1 = [];
        const resultados2 = [];

        celdas1.forEach(td => {{
            const img = td.querySelector("img");
            if (img) {{
                const id = img.getAttribute("id") || "";
                const src = img.getAttribute("src") || "";
                const hora = id.slice(-4);
                const estado = src.substring(src.lastIndexOf('/') + 1);
                resultados1.push({{ campo: "Campo 1", hora, estado }});
            }}
        }});

        celdas2.forEach(td => {{
            const img = td.querySelector("img");
            if (img) {{
                const id = img.getAttribute("id") || "";
                const src = img.getAttribute("src") || "";
                const hora = id.slice(-4);
                const estado = src.substring(src.lastIndexOf('/') + 1);
                resultados2.push({{ campo: "Campo 2", hora, estado }});
            }}
        }});

        const datos = resultados1.concat(resultados2);
        exportarCSV(datos, "{nombre_archivo}");
    """)

def aumentar_un_dia(fecha_str):
    """
    Recibe una fecha como string en formato 'dd/mm/yyyy' y devuelve la fecha siguiente.
    """
    fecha = datetime.strptime(fecha_str, "%d/%m/%Y")
    siguiente_dia = fecha + timedelta(days=1)
    return siguiente_dia.strftime("%d/%m/%Y")


 
    

def clickar_fecha_por_data_day(driver, fecha):
    print("dia q se va a clickar: ", fecha)
    try:
        # Esperar a que el calendario esté presente
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, f'td[data-day="{fecha}"]'))
        )

        # Encontrar y hacer clic en el <td> con el data-day exacto
        celda_dia = driver.find_element(By.CSS_SELECTOR, f'td[data-day="{fecha}"]')
        celda_dia.click()

        print(f"📅 Clic realizado sobre el día {fecha}")
    except Exception as e:
        print(f"❌ No se pudo hacer clic sobre el día {fecha}: {e}")


def clickar_fecha_por_js(driver, fecha):
    script = f'''
    if (typeof $ !== "undefined") {{
        var td = $("[data-action='selectDay'][data-day='{fecha}']");
        if (td.length) {{
            td.trigger("click");
            return "✅ Clic en fecha " + td.attr("data-day");
        }} else {{
            return "❌ No se encontró el día {fecha}";
        }}
    }} else {{
        return "⚠️ jQuery no está definido";
    }}
    '''
    return driver.execute_script(script)


def click_boton_atras(driver):
    try:
        boton_atras = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//span[@class='material-icons' and normalize-space(text())='arrow_back']"))
        )
        boton_atras.click()
        print("🔙 Botón 'arrow_back' pulsado.")
    except Exception as e:
        print("❌ No se pudo pulsar el botón 'arrow_back':", e)
    
def extraer_info(driver, nombre_campo):
    print("hola")

    try:
        hacer_login(driver)
        cerrar_popup(driver)
        ir_a_reservas(driver, nombre_campo)
        # extraer dia
        #input("Introduce ENTER ...")
        nombre_campo = extraerNombreCampo(driver)
        # comenzar bucle
        # extraer mes actual
        mes_actual = obtener_mes_actual(driver) 
        print("Mes actual: ", mes_actual)
        # extraer rango de dias     
        dia_actual = extraerDiaActivo(driver)
        print("Dia actual: ", dia_actual)
        fecha = dia_actual+"/"+mes_actual
        print("fecha: ", fecha)
        # calcular dias a consultar
        proximos_dias = calcular_proximos_dias(fecha)
        print("proximos dias: ", proximos_dias)

        # PRIMERA VUELTA CON EL DIA ACTUAL
        print("dia a clickar:"+fecha)
        resultado = clickar_fecha_por_js(driver, fecha)
        print("Resultado del clic:", resultado)

        pulsar_continuar(driver)
        horas_disponibles = extraerHorasDisponibles(driver)
        print("Horas disponibles:", horas_disponibles)
        #exportar_csv(driver, nombre_campo, fecha)
        #input("Introduce ENTER para insertar json en mongo...")
        insertar_resumen_a_mongo(fecha, nombre_campo, horas_disponibles)
        #input("atras")
        click_boton_atras(driver)

        print("primer vuelta hecha")
        fecha = aumentar_un_dia(fecha)



        for i in range(len(proximos_dias)):
            #input("clickar en dia")
            print("dia a clickar:"+proximos_dias[i])
            resultado = clickar_fecha_por_js(driver, proximos_dias[i])
            print("Resultado del clic:", resultado)

            pulsar_continuar(driver)
            horas_disponibles = extraerHorasDisponibles(driver)
            print("Horas disponibles:", horas_disponibles)
            #exportar_csv(driver, nombre_campo, fecha)
            #input("Introduce ENTER para insertar json en mongo...")
            insertar_resumen_a_mongo(fecha, nombre_campo, horas_disponibles)
            #input("atras")
            click_boton_atras(driver)
            #input("fin")
            fecha = aumentar_un_dia(fecha)


    except Exception as e:
        print("❌ Error general:", e)
    finally:
        driver.quit()





#----------------------------------------------------------- INICIO DE EJECUCION
def main(nombre_campo):
    driver = abrir_navegador()
    extraer_info(driver, nombre_campo)


if __name__ == "__main__":
    main()

