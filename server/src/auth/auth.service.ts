import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Neo4JService } from '../neo4-j/neo4-j.service';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

dotenv.config()
const saltOrRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

@Injectable()
export class AuthService {
  constructor(private readonly neo4jService: Neo4JService) { }

  async register(createAuthDto: RegisterDTO) {
    const user = await this.checkUserExists(createAuthDto.email, createAuthDto.username);
    if (user) {
      return { error: 'User already or email already registered ' };
    }
    const oldPassword = createAuthDto.password;
    createAuthDto.password = await bcrypt.hash(createAuthDto.password, saltOrRounds);
    await this.neo4jService.runQuery('CREATE (n:User $props) RETURN n', { props: createAuthDto });
    return this.login(createAuthDto.username, oldPassword);
  }

  async login(username: string, password: string) {
    console.log(username, password)
    const user = await this.neo4jService.runQuery('MATCH (n:User) WHERE n.username = $username RETURN n', { username });
    if (user.length === 0) {
      return { error: 'User not found' };
    }
    const match = await bcrypt.compare(password, user[0].get('n').properties.password);
    if (!match) {
      return { error: 'Invalid password' };
    }
    const tokenizable = user[0].get('n').properties;
    delete tokenizable.password;
    const token = this.signToken(tokenizable);
    return { token: token };
  }

  async checkUserExists(email: string, username: string) {
    const results = await this.neo4jService.runQuery('MATCH (n:User) WHERE n.email = $email OR n.username = $username RETURN n', { email, username });
    return results.length > 0;
  }

  signToken(payload: any) {
    return jwt.sign(payload, jwtSecret);
  }

}