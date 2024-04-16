import { Injectable, Inject } from '@nestjs/common';
import { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4JService {
    constructor(@Inject('NEO4J_DRIVER') private readonly neo4jDriver: Driver) { }

    async runQuery(query: string, params?: Record<string, any>): Promise<any> {
        const session: Session = this.neo4jDriver.session();
        try {
            const result = await session.run(query, params);
            return result.records;
        } finally {
            await session.close();
        }
    }
}