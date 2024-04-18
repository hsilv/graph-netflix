import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieProjection } from 'schema/movie.schema';
import { Types } from 'mongoose';
import { Neo4JService } from 'src/neo4-j/neo4-j.service'; 

@Injectable()
export class PersonService {
  constructor(private readonly neo4jService: Neo4JService) { }
  setLanguage(
    language: string,
    since: string,
    fluent: number,
    isNative: boolean,
    username: string,
  ) {
    // MATCH the node with either the User or Actor label
    const query = `
        MATCH (n:User|Actor {username: $username})
        MATCH (l:Language {name: $language})
        MERGE (n)-[r:HABLA]->(l)
        SET r.since = $since, r.fluent = $fluent, r.isNative = $isNative
        RETURN r
    `;

    const params = {
      username: username,
      language: language,
      since: since,
      fluent: fluent,
      isNative: isNative,
    };

    return this.neo4jService.runQuery(query, params);
  }

  findAll() {
    return `This action returns all person`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  // Method to create a person
  create(createPersonDto: any): any {
    // Implementation code...
  }

  // Method to update a person
  update(id: number, updatePersonDto: any): any {
    // Implementation code...
  }

  // Method to remove a person
  remove(id: number): any {}
}
