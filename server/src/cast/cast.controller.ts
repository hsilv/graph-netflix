import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CastService } from './cast.service';
import { CreateCastDto } from './dto/create-cast.dto';
import { UpdateCastDto } from './dto/update-cast.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('cast')
export class CastController {
  constructor(private readonly castService: CastService) { }

  @Post()
  create(@Body() createCastDto: CreateCastDto) {
    return this.castService.create(createCastDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'The list of all movies.', type: [CreateCastDto] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.castService.findAll(page, limit);
  }

  @Get(':id')
  @Get()
  @ApiResponse({ status: 200, description: 'The list of all movies.', type: [CreateCastDto] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findOne(@Param('id') id: string) {
    return this.castService.findMovieCrew(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCastDto: UpdateCastDto) {
    return this.castService.update(+id, updateCastDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.castService.remove(+id);
  }
}
