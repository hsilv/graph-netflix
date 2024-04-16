import { Controller, Get } from '@nestjs/common';
import { Neo4JService } from './neo4-j.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Neo4J')
@Controller('neo4j')
export class Neo4JController {
  constructor(private readonly neo4jService: Neo4JService) { }

  @Get()
  async getAll(): Promise<any> {
    const results = await this.neo4jService.runQuery('MATCH (n)-[r]->(d) RETURN n, r, d');
    return results.map(record => ({
      node: record.get('n'),
      relation: record.get('r'),
      destination: record.get('d'),
    }));
  }

  @Get('/node')
  async getNodes(): Promise<any> {
    const results = await this.neo4jService.runQuery('MATCH (n) RETURN n');
    return results.map(record => record.get('n'));
  }

  @Get('/relation')
  async getRelations(): Promise<any> {
    const results = await this.neo4jService.runQuery('MATCH (n)-[r]->(d) RETURN r');
    return results.map(record => record.get('r'));
  }
}