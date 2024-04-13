import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from 'schema/movie.schema';

@Injectable()
export class GenresService {

  constructor(@InjectModel('Movie') private movieModel: Model<Movie>) { }

  findAll() {
    return this.movieModel.find().distinct('genres.name').exec();
  }

}
