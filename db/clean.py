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
    movie = Node("Movie", id=row['id'], title=row['title'], adult=row['adult'], runtime=row['runtime'], vote_avg=row['vote_average'], vote_count=row['vote_count'], popularity=row['popularity'], release_date=row['release_date'], overview=row['overview'], genres=[genre['name'] for genre in row['genres']])
    graph.merge(movie, "Movie", "id")

    # Crea o encuentra el nodo del idioma original
    original_language = Node("Language", iso_639_1=row['original_language'])
    graph.merge(original_language, "Language", "iso_639_1")

    # Crea la relación entre la película y el idioma original
    rel = Relationship(movie, "ES_HABLADO_EN", original_language, principal=True, doblado=False, variantes=[])
    graph.merge(rel)
    
    if pd.notnull(row['belongs_to_collection']):
        id = None
        name = None
        if 'id' in row['belongs_to_collection']:
            id = row['belongs_to_collection']['id']
        
        if 'name' in row['belongs_to_collection']:
            name = row['belongs_to_collection']['name']
            
        
        if id is not None and name is not None:
            collection = Node("Collection", id=id, name=name)
            graph.merge(collection, "Collection", "id")

            # Crea la relación entre la película y la colección
            rel = Relationship(movie, "BELONGS_TO_COLLECTION", collection)
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
    # Crea o encuentra los nodos de los países de producción y crea las relaciones correspondientes
    for country in row['production_countries']:
        production_country = Node("Country", iso_3166_1=country['iso_3166_1'], name=country['name'])
        graph.merge(production_country, "Country", "iso_3166_1")

        # Crea la relación entre la película y el país de producción
        rel = Relationship(movie, "SE_PRODUJO_EN", production_country)
        company_names = [company['name'] for company in row['production_companies']]

        # Asigna los nombres de las compañías a la propiedad 'productoras' de la relación
        rel['productoras'] = company_names
        rel['budget'] = row['budget']
        rel['revenue'] = row['revenue']
        graph.merge(rel)
    
    print(f"Inserted movie {row['title']}")