import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Neo4JModule } from '../neo4-j/neo4-j.module'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [Neo4JModule], // Agrega Neo4JModule a la lista de imports
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }