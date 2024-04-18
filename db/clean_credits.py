from py2neo import Graph, Node, Relationship
import pandas as pd
import pymongo
import json
import requests

# Leer el archivo CSV
df = pd.read_csv('credits.csv', nrows=1000)

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

graph = Graph("neo4j+s://neo4j:90DBfS6nPuYXytMmeNNjXDUmuIf9vi1PGxYOB8sczgY@217245d3.databases.neo4j.io")

for index, row in df.iterrows():
    print(row)
    # Crea el nodo de la película
    movie = Node("Movie", id=row['id'])
    graph.merge(movie, "Movie", "id")

    # Busca el nodo de la película y obtén sus propiedades
    movie_node = graph.run("MATCH (m:Movie {id: $id}) RETURN m", id=row['id']).evaluate()
    runtime = movie_node['runtime']
    release_date = movie_node['release_date']

    # Busca el nodo de lenguaje y obtén su propiedad iso_639_1
    language_node = graph.run("MATCH (m:Movie {id: $id})-[:ES_HABLADO_EN {principal: true}]->(l:Language) RETURN l", id=row['id']).evaluate()
    iso_639_1 = language_node['iso_639_1']

    # Crea los nodos de Actor y las relaciones PARTICIPA_EN y HABLA
    for cast_member in row['cast']:
        actor = Node("Actor", name=cast_member['name'], gender=cast_member['gender'])
        graph.merge(actor, "Actor", "name")

        participates_in = Relationship(actor, "PARTICIPA_EN", movie, role=cast_member['character'], runtime=runtime, release_date=release_date)
        graph.create(participates_in)

        speaks = Relationship(actor, "HABLA", language_node)
        graph.create(speaks)
    
    for cast_member in row['crew']:
        actor = Node("Actor", name=cast_member['name'], gender=cast_member['gender'])
        graph.merge(actor, "Actor", "name")

        participates_in = Relationship(actor, "PARTICIPA_EN", movie, role=cast_member['job'], runtime=runtime, release_date=release_date)
        graph.create(participates_in)

        speaks = Relationship(actor, "HABLA", language_node)
        graph.create(speaks)