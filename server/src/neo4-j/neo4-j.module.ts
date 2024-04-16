import { Module, Global } from '@nestjs/common';
import { Neo4JService } from './neo4-j.service';
import { Neo4JController } from './neo4-j.controller';
import neo4j from 'neo4j-driver';
import * as dotenv from 'dotenv';

dotenv.config()

@Global()
@Module({
  controllers: [Neo4JController],
  providers: [
    Neo4JService,
    {
      provide: 'NEO4J_DRIVER',
      useValue: neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)),
    },
  ],
  exports: [Neo4JService, 'NEO4J_DRIVER'],
})
export class Neo4JModule { }