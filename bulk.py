# Bulk, clean e insert de datos en MongoDB, a través de movies_metadata.csv
# Grupo 1

import pandas as pd
import pymongo
import json
import requests

# Leer el archivo CSV
df = pd.read_csv('movies_metadata.csv', dtype={10: str})


def clean_json(x):
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
                # Si todavía falla, devolver un diccionario vacío
                return {}
    else:
        return {}
    
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

# Limpiar belongs to collection
df['belongs_to_collection'] = df['belongs_to_collection'].apply(clean_json)

# Convertir la columna "genres" de cadena JSON a lista de diccionarios
df['genres'] = df['genres'].apply(clean_json_array)

# Convertir la columna "production_companies" de cadena JSON a lista de diccionarios
df['production_companies'] = df['production_companies'].apply(clean_json_array)

# Convertir la columna "production_countries" de cadena JSON a lista de diccionarios
df['production_countries'] = df['production_countries'].apply(clean_json_array)

# Convertir la columna "spoken_languages" de cadena JSON a lista de diccionarios
df['spoken_languages'] = df['spoken_languages'].apply(clean_json_array)

# Crear una conexión a MongoDB
client = pymongo.MongoClient("mongodb+srv://silva:$eB30937484@cluster0.u0mksjj.mongodb.net/?retryWrites=true&w=majority")


if 'poster_path' not in df.columns:
    df['poster_path'] = None

# Iterar sobre cada fila del DataFrame para obtener el path del poster
for i in range(len(df)):
    url = "https://api.themoviedb.org/3/movie/{}/images".format(df.loc[i, 'id'])
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTMwNjVkMTQ3ODg1YmQ1YzRhZDI4YzMyMDBlM2IzZSIsInN1YiI6IjY1ZGJhZDBlYzJiOWRmMDE4MzhjNjFhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5oBNKOSYnFoAfh-tJw54w7T5iAQjCk6ij0tQiTCsv9c"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200 and 'posters' in response.json() and len(response.json()['posters']) > 0:
        df.loc[i, 'poster_path'] = 'https://image.tmdb.org/t/p/w500' + response.json()['posters'][0]['file_path']


# Especificar la base de datos y la colección
db = client["project"]
collection = db["movies"]

# Convertir el DataFrame a un formato de diccionario
data_dict = df.to_dict("records")

# Insertar los datos en MongoDB
collection.insert_many(data_dict)
