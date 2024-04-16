import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Neo4JService } from '../neo4-j/neo4-j.service'; // Asegúrate de que la ruta sea correcta

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly neo4jService: Neo4JService, // Inyecta el servicio de Neo4j aquí
  ) { }

  @Post('/register')
  async register(@Body() createAuthDto: RegisterDTO) {
    return await this.authService.register(createAuthDto);
  }

  @Post('/login')
  async login(@Body() createAuthDto: LoginDTO) {
    return await this.authService.login(createAuthDto.username, createAuthDto.password);
  }
}
