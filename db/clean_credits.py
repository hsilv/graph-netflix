import pandas as pd
import pymongo
import json
import requests

# Leer el archivo CSV
df = pd.read_csv('credits.csv')

df['id'] = df['id'].astype(str)

def clean_json_array(x):
    if pd.notnull(x):
        try:
            # Intentar decodificar la cadena JSON
            return json.loads(x.replace("'", '"'))
        except json.JSONDecodeError:
            # Si falla, intentar corregir problemas comunes de formato JSON
            x = x.replace('null', 'None').replace('false', 'False').replace('true', 'True')
            try:
                return eval(x)
            except:
                # Si todavía falla, devolver una lista vacía
                return []
    else:
        return []
    

df['cast'] = df['cast'].apply(clean_json_array)
df['crew'] = df['crew'].apply(clean_json_array)

# Crear una conexión a MongoDB
client = pymongo.MongoClient("mongodb+srv://silva:$eB30937484@cluster0.u0mksjj.mongodb.net/?retryWrites=true&w=majority")

# Definir el tamaño de la página
page_size = 100

# Calcular el número total de páginas
total_pages = len(df) // page_size
if len(df) % page_size > 0:
    total_pages += 1

if 'poster_path' not in df.columns:
    df['poster_path'] = None

# Especificar la base de datos y la colección
db = client["project"]
collection = db["cast_crew"]

# Iterar sobre cada página
for page in range(114, total_pages + 1):
    # Seleccionar las filas para esta página
    start = page * page_size
    end = start + page_size
    df_page = df[start:end]

    # Convertir el DataFrame a un formato de diccionario
    data_dict = df_page.to_dict("records")

    # Insertar los datos en MongoDB
    collection.insert_many(data_dict)

    print(f"Inserted page {page+1} of {total_pages}")
    