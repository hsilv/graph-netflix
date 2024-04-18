import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from '../../schema/movie.schema';
import { Neo4JService } from 'src/neo4-j/neo4-j.service';
import { Neo4JModule } from 'src/neo4-j/neo4-j.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]), Neo4JModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule { }
