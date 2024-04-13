import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie, MovieProjection } from 'schema/movie.schema';
import { Types } from 'mongoose';

@Injectable()
export class MoviesService {
  quantity: number = 0;
  constructor(@InjectModel('Movie') private movieModel: Model<Movie>) {
    this.movieModel.find().countDocuments().exec().then((quantity) => {
      this.quantity = quantity;
    });
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(createMovieDto);
    this.quantity++;
    return createdMovie.save();
  }

  async addGenre(id: string, genre: string): Promise<Movie> {
    const conditions = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { id: id }] }
      : { id: id };
    return this.movieModel
      .findOneAndUpdate(
        conditions,
        { $addToSet: { genres: { name: genre } } },
        { new: true },
      )
      .exec();
  }

  async removeGenre(id: string, genre: string): Promise<Movie> {
    const conditions = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { id: id }] }
      : { id: id };
    return this.movieModel.findOneAndUpdate(conditions, { $pull: { genres: { name: genre } } }, { new: true }).exec();
  }

  async addLanguage(id: string, language: string): Promise<Movie> {
    const conditions = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { id: id }] }
      : { id: id };
    return this.movieModel.findOneAndUpdate(conditions, { $addToSet: { spoken_languages: { name: language } } }, { new: true }).exec();
  }

  async removeLanguage(id: string, language: string): Promise<Movie> {
    const conditions = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { id: id }] }
      : { id: id };
    return this.movieModel.findOneAndUpdate(conditions, { $pull: { spoken_languages: { name: language } } }, { new: true }).exec();
  }

  async findAll(page: number, limit: number): Promise<Movie[]> {
    let result;
    page = Number(page);
    limit = Number(limit);
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }

    return result;
  }

  async findAllProjections(page: number, limit: number): Promise<MovieProjection[]> {
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $project: { popularity: 1, genres: 1, poster_path: 1, runtime: 1, spoken_languages: 1, tagline: 1, title: 1, vote_average: 1, id: 1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { popularity: 1, genres: 1, poster_path: 1, runtime: 1, spoken_languages: 1, tagline: 1, title: 1, vote_average: 1, id: 1 } },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $limit: 10 },
        { $project: { popularity: 1, genres: 1, poster_path: 1, runtime: 1, spoken_languages: 1, tagline: 1, title: 1, vote_average: 1, id: 1 } },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    return result;
  }

  async findOne(id: string): Promise<Movie> {
    const conditions = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { id: id }] }
      : { id: id };
    return this.movieModel.findOne(conditions).exec();
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const conditions = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { id: id }] }
      : { id: id };
    return this.movieModel.findOneAndUpdate(conditions, updateMovieDto, { new: true }).exec();
  }

  async updateVotes(id: string, vote: number): Promise<Movie> {
    const conditions = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { id: id }] }
      : { id: id };
    const movie = await this.movieModel.findOne(conditions).exec();
    let vote_average = movie.vote_average * movie.vote_count;
    vote_average = vote_average + Math.round(vote);
    vote_average /= (movie.vote_count + 1);
    return this.movieModel.findOneAndUpdate(conditions, { $inc: { vote_count: 1 }, vote_average: vote_average }, { new: true }).exec();
  }

  async remove(id: string): Promise<Movie> {
    const conditions = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { id: id }] }
      : { id: id };
    this.quantity--;
    return this.movieModel.findOneAndDelete(conditions).exec();
  }

  async findMoviesByLanguage(language: string, page: number, limit: number): Promise<Movie[]> {
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $match: { 'spoken_languages.name': language } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $match: { 'spoken_languages.name': language } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $match: { 'spoken_languages.name': language } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    return result;
  }

  async findPopularByLanguage(page: number, limit: number, filter: string): Promise<Movie[]> {
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $match: { 'spoken_languages.name': filter } },
        { $sort: { vote_average: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $match: { 'spoken_languages.name': filter } },
        { $sort: { vote_average: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $match: { 'spoken_languages.name': filter } },
        { $sort: { vote_average: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    return result;
  }

  async findNewByLanguage(page: number, limit: number, filter: string): Promise<Movie[]> {
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $match: { 'spoken_languages.name': filter } },
        { $sort: { release_date: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $match: { 'spoken_languages.name': filter } },
        { $sort: { release_date: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $match: { 'spoken_languages.name': filter } },
        { $sort: { release_date: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    return result;
  }

  async findMoviesByGenre(genre: string, page: number, limit: number): Promise<Movie[]> {
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $match: { 'genres.name': genre } },
        { $limit: 50 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 50) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $match: { 'genres.name': genre } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $match: { 'genres.name': genre } },
        { $limit: 50 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 50) } }
      ]);
    }
    return result;
  }

  async findPopularByGenre(page: number, limit: number, filter: string): Promise<Movie[]> {
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $match: { 'genres.name': filter } },
        { $sort: { vote_average: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $match: { 'genres.name': filter } },
        { $sort: { vote_average: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $match: { 'genres.name': filter } },
        { $sort: { vote_average: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    return result;
  }

  async findNewByGenre(page: number, limit: number, filter: string): Promise<Movie[]> {
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $match: { 'genres.name': filter } },
        { $sort: { release_date: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $match: { 'genres.name': filter } },
        { $sort: { release_date: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $match: { 'genres.name': filter } },
        { $sort: { release_date: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    return result;
  }

  async findMoviesByCollection(collection: string, page: number, limit: number): Promise<Movie[]> {
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $match: { 'belongs_to_collection.name': collection } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $match: { 'belongs_to_collection.name': collection } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $match: { 'belongs_to_collection.name': collection } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    return result;
  }

  async findPopularByCollection(page: number, limit: number, filter: string): Promise<Movie[]> {
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $match: { 'belongs_to_collection.name': filter } },
        { $sort: { vote_average: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $match: { 'belongs_to_collection.name': filter } },
        { $sort: { vote_average: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $match: { 'belongs_to_collection.name': filter } },
        { $sort: { vote_average: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    return result;
  }

  async findNewByCollection(page: number, limit: number, filter: string): Promise<Movie[]> {
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $match: { 'belongs_to_collection.name': filter } },
        { $sort: { release_date: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $match: { 'belongs_to_collection.name': filter } },
        { $sort: { release_date: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $match: { 'belongs_to_collection.name': filter } },
        { $sort: { release_date: -1 } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    return result;
  }

  async findMoviesBySearch(search: string, page: number, limit: number): Promise<Movie[]> {
    return [];
    page = Number(page);
    limit = Number(limit);
    let result;
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.movieModel.aggregate([
        { $match: { $text: { $search: search } } },
        { $limit: 10 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    } else if ((page !== 0) && (limit !== 0)) {
      result = await this.movieModel.aggregate([
        { $match: { $text: { $search: search } } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.movieModel.aggregate([
        { $match: { $text: { $search: search } } },
        { $limit: 50 },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 50) } }
      ]);
    }
    return result;
  }

}