import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, ProjectionDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ErrorDto } from './dto/error.dto';
import { ApiTags, ApiCreatedResponse, ApiBadRequestResponse, ApiResponse, ApiNotFoundResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get()
  async findAll() {
    return await this.moviesService.getMovies();
  }

  @Get('/:id')
  async findMovie(@Query('id') id: string) {
    return await this.moviesService.getMovie(id);
  }


  @Get('/genre')
  async findByGenre(@Query('name') name: string) {
    return await this.moviesService.getMoviesByGenre(name);
  }

  @Get('/language')
  async findByLanguage(@Query('name') name: string) {
    return await this.moviesService.getMoviesByLanguage(name);
  }

  @Get('/all/genres')
  async getAllGenres() {
    return this.moviesService.getGenres();
  }

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    return await this.moviesService.createMovie(createMovieDto);
  }

  @Patch('/property/multiple')
  @ApiBody({ schema: { example: { ids: ['123', '456'] } } })
  async addPropertyToMultiple(@Body('ids') ids: string[], @Query('property') property: string, @Query('value') value: string) {
    return await this.moviesService.addPropertyToMultipleMovies(ids, property, value);
  }

  @Patch('/property/:id')
  async addProperty(@Param('id') id: string, @Query('property') property: string, @Query('value') value: string) {
    return await this.moviesService.addPropertyToMovie(id, property, value);
  }

  @Delete('/property/:id')
  async removeProperty(@Param('id') id: string, @Query('property') property: string) {
    return await this.moviesService.removePropertyFromMovie(id, property);
  }

  @Delete('/property/multiple')
  @ApiBody({ schema: { example: { ids: ['123', '456'] } } })
  async removePropertyFromMultiple(@Body('ids') ids: string[], @Query('property') property: string) {
    return await this.moviesService.removePropertyFromMultipleMovies(ids, property);
  }

  @Patch('/multiple')
  async updateMultiple(@Body('ids') ids: string[], @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.updateMultipleMovies(ids, updateMovieDto);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return await this.moviesService.updateMovie(id, updateMovieDto);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.moviesService.deleteMovie(id);
  }




  /* @Post('/new')
  @ApiCreatedResponse({
    description: 'The movie has been successfully created.',
    type: CreateMovieDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  async create(@Body() createMovieDto: CreateMovieDto) {
    return await this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'The list of all movies.', type: [CreateMovieDto] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.moviesService.findAll(page, limit);
  }

  @Get('projections')
  @ApiResponse({ status: 200, description: 'The list of all movies with title and release date.', type: [ProjectionDto] })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllProjections(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.moviesService.findAllProjections(page, limit);
  }

  @Get('language')
  @ApiResponse({ status: 200, description: 'The list of movies by language.', type: [CreateMovieDto] })
  @ApiNotFoundResponse({ description: 'The movies that you are looking for do not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMoviesByLanguage(@Query('name') name: string, @Query('page') page: number, @Query('limit') limit: number) {
    const movies = await this.moviesService.findMoviesByLanguage(name, page, limit);
    if (!movies) {
      throw new NotFoundException(`No existe ninguna película en ${name}.`);
    }
    return movies;
  }

  @Get('popular/language')
  @ApiResponse({ status: 200, description: 'The list of popular movies.', type: [CreateMovieDto] })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: true, type: String })
  async findPopularMoviesByLanguage(@Query('filter') filter: string, @Query('page') page: number, @Query('limit') limit: number) {
    return await this.moviesService.findPopularByLanguage(page, limit, filter);
  }

  @Get('new/language')
  @ApiResponse({ status: 200, description: 'The list of new movies.', type: [CreateMovieDto] })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: true, type: String })
  async findNewMoviesByLanguage(@Query('filter') filter: string, @Query('page') page: number, @Query('limit') limit: number) {
    return await this.moviesService.findNewByLanguage(page, limit, filter);
  }

  @Get('genre')
  @ApiResponse({ status: 200, description: 'The list of movies by genre.', type: [CreateMovieDto] })
  @ApiNotFoundResponse({ description: 'The movies that you are looking for do not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMoviesByGenre(@Query('name') name: string, @Query('page') page: number, @Query('limit') limit: number) {
    const movies = await this.moviesService.findMoviesByGenre(name, page, limit);
    if (!movies) {
      throw new NotFoundException(`No existe ninguna película en ${name}.`);
    }
    return movies;
  }

  @Get('popular/genre')
  @ApiResponse({ status: 200, description: 'The list of popular movies.', type: [CreateMovieDto] })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: true, type: String })
  async findPopularMoviesByGenre(@Query('filter') filter: string, @Query('page') page: number, @Query('limit') limit: number) {
    return await this.moviesService.findPopularByGenre(page, limit, filter);
  }

  @Get('new/genre')
  @ApiResponse({ status: 200, description: 'The list of new movies.', type: [CreateMovieDto] })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: true, type: String })
  async findNewMovies(@Query('filter') filter: string, @Query('page') page: number, @Query('limit') limit: number) {
    return await this.moviesService.findNewByGenre(page, limit, filter);
  }

  @Get('collection')
  @ApiResponse({ status: 200, description: 'The list of movies by collection.', type: [CreateMovieDto] })
  @ApiNotFoundResponse({ description: 'The movies that you are looking for do not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMoviesByCollection(@Query('name') name: string, @Query('page') page: number, @Query('limit') limit: number) {
    const movies = await this.moviesService.findMoviesByCollection(name, page, limit);
    if (!movies) {
      throw new NotFoundException(`No existe ninguna película en ${name}.`);
    }
    return movies;
  }

  @Get('popular/collection')
  @ApiResponse({ status: 200, description: 'The list of popular movies.', type: [CreateMovieDto] })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: true, type: String })
  async findPopularMoviesByCollection(@Query('filter') filter: string, @Query('page') page: number, @Query('limit') limit: number) {
    return await this.moviesService.findPopularByCollection(page, limit, filter);
  }

  @Get('new/collection')
  @ApiResponse({ status: 200, description: 'The list of new movies.', type: [CreateMovieDto] })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: true, type: String })
  async findNewMoviesByCollection(@Query('filter') filter: string, @Query('page') page: number, @Query('limit') limit: number) {
    return await this.moviesService.findNewByCollection(page, limit, filter);
  }


  @Get('search')
  @ApiResponse({ status: 200, description: 'The list of movies by search.', type: [CreateMovieDto] })
  @ApiNotFoundResponse({ description: 'The movies that you are looking for do not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMoviesBySearch(@Query('name') name: string, @Query('page') page: number, @Query('limit') limit: number) {
    const movies = await this.moviesService.findMoviesBySearch(name, page, limit);
    if (!movies) {
      throw new NotFoundException(`No existe ninguna película en ${name}.`);
    }
    return movies;
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'A movie that you want to find', type: CreateMovieDto })
  @ApiNotFoundResponse({ description: 'The movie that you are looking for does not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  async findOne(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(id);
    if (!movie) {
      throw new NotFoundException(`La película con el id: ${id} no existe.`);
    }
    return movie;
  }



  @Patch(':id/update')
  @ApiResponse({ status: 200, description: 'Updated movie.', type: CreateMovieDto })
  @ApiNotFoundResponse({ description: 'The movie that you are trying to update does not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    const movie = await this.moviesService.update(id, updateMovieDto);
    if (!movie) {
      throw new NotFoundException('The movie that you are trying to update does not exist.');
    }
    return movie;
  }

  @Patch(':id/genre')
  @ApiResponse({ status: 200, description: 'Updated movie.', type: CreateMovieDto })
  @ApiNotFoundResponse({ description: 'The movie that you are trying to update does not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  async addGenre(@Param('id') id: string, @Query('name') name: string) {
    const movie = await this.moviesService.addGenre(id, name);
    if (!movie) {
      throw new NotFoundException('The movie that you are trying to update does not exist.');
    }
    return movie;
  }

  @Patch(':id/genre/delete')
  @ApiResponse({ status: 200, description: 'Updated movie.', type: CreateMovieDto })
  @ApiNotFoundResponse({ description: 'The movie that you are trying to update does not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  async removeGenre(@Param('id') id: string, @Query('name') name: string) {
    const movie = await this.moviesService.removeGenre(id, name);
    if (!movie) {
      throw new NotFoundException('The movie that you are trying to update does not exist.');
    }
    return movie;
  }

  @Patch(':id/language')
  @ApiResponse({ status: 200, description: 'Updated movie.', type: CreateMovieDto })
  @ApiNotFoundResponse({ description: 'The movie that you are trying to update does not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  async addLanguage(@Param('id') id: string, @Query('name') name: string) {
    const movie = await this.moviesService.addLanguage(id, name);
    if (!movie) {
      throw new NotFoundException('The movie that you are trying to update does not exist.');
    }
    return movie;
  }

  @Patch(':id/language/delete')
  @ApiResponse({ status: 200, description: 'Updated movie.', type: CreateMovieDto })
  @ApiNotFoundResponse({ description: 'The movie that you are trying to update does not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  async removeLanguage(@Param('id') id: string, @Query('name') name: string) {
    const movie = await this.moviesService.removeLanguage(id, name);
    if (!movie) {
      throw new NotFoundException('The movie that you are trying to update does not exist.');
    }
    return movie;
  }

  @Patch(':id/vote')
  @ApiResponse({ status: 200, description: 'Updated movie.', type: CreateMovieDto })
  @ApiNotFoundResponse({ description: 'The movie that you are trying to update does not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  async updateVotes(@Param('id') id: string, @Query('vote') vote: number) {
    const movie = await this.moviesService.updateVotes(id, vote);
    if (!movie) {
      throw new NotFoundException('The movie that you are trying to update does not exist.');
    }
    return movie;
  }


  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Deleted movie.', type: CreateMovieDto })
  @ApiNotFoundResponse({ description: 'The movie that you are trying to delete does not exist.', type: ErrorDto })
  @ApiBadRequestResponse({ description: 'Bad request.', type: ErrorDto })
  async remove(@Param('id') id: string) {
    const movie = await this.moviesService.remove(id);
    if (!movie) {
      throw new NotFoundException('The movie that you are trying to delete does not exist.');
    }
    return movie;
  } */


}
