import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('server')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiResponse({ status: 200, description: 'Hello! I am alive!' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  test(): string {
    return this.appService.getAlive();
  }
}
