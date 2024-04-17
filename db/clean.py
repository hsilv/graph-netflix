# Bulk, clean e insert de datos en MongoDB, a través de movies_metadata.csv
# Grupo 1

from py2neo import Graph, Node, Relationship
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

print(df['belongs_to_collection'].head())

graph = Graph("neo4j+s://neo4j:90DBfS6nPuYXytMmeNNjXDUmuIf9vi1PGxYOB8sczgY@217245d3.databases.neo4j.io")

for index, row in df.iterrows():
    # Crea el nodo de la película
    movie = Node("Movie", id=row['id'], title=row['title'])
    graph.merge(movie, "Movie", "id")

    # Crea o encuentra el nodo del idioma original
    original_language = Node("Language", iso_639_1=row['original_language'])
    graph.merge(original_language, "Language", "iso_639_1")

    # Crea la relación entre la película y el idioma original
    rel = Relationship(movie, "ES_HABLADO_EN", original_language, principal=True, doblado=False, variantes=[])
    graph.merge(rel)

    # Crea o encuentra los nodos de los idiomas hablados y crea las relaciones correspondientes
    for lang in row['spoken_languages']:
        spoken_language = Node("Language", iso_639_1=lang['iso_639_1'], name=lang['name'])
        graph.merge(spoken_language, "Language", "iso_639_1")

        # Determina las propiedades de la relación
        props = {"principal": False, "doblado": True, "variantes": []}
        if lang['iso_639_1'] == row['original_language']:
            props["principal"] = True
            props["doblado"] = False

        # Crea la relación entre la película y el idioma hablado
        rel = Relationship(movie, "ES_HABLADO_EN", spoken_language, **props)
        graph.merge(rel)