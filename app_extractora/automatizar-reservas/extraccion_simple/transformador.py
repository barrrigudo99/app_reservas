from pymongo import MongoClient
from collections import defaultdict

def insertar_resumen_a_mongo(dia: int, nombre: str, datos: list):
    try:
        # Conectar a MongoDB local
        cliente = MongoClient("mongodb://localhost:27017/")
        db = cliente["disponibilidaddb"]
        #coleccion = db[f"{nombre}"]
        coleccion = db["disponibilidad"]


        # Asignar campoID basado en el nombre
        campo_ids = {
            "Adelfas": 1,
            "Félix Rubio": 2,
            "La Chopera": 3,
            "La Masó": 4
        }
        
        campoID = campo_ids.get(nombre, None)

        # Clasificamos horas por estado y campo
        disponibles = defaultdict(list)
        ocupadas = defaultdict(list)

        for item in datos:
            campo = item["campo"].replace(" ", "").lower()
            hora = item["hora"]
            if item["estado"] == "libre.jpg":
                disponibles[campo].append(hora)
            else:
                ocupadas[campo].append(hora)

        # Documento final para insertar en MongoDB
        documento = {
            "dia_actual": dia,
            "nombre": nombre,
            "campoID": campoID,
            "Horas disponibles": disponibles,
            "Horas ocupadas": ocupadas
        }

        # Insertamos en MongoDB
        resultado = coleccion.insert_one(documento)
        print(f"✅ Documento insertado con _id: {resultado.inserted_id}")

    except Exception as e:
        print(f"❌ Error general en la inserción: {e}")
