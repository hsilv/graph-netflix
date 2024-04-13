import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'The record has been successfully created.'})
  @ApiBadRequestResponse({ description: 'Bad Request.'})
  async create(@Body() createCollectionDto: any) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.collectionsService.findAll(page, limit);
  }


}
