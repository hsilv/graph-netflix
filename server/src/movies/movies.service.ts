import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie, MovieProjection } from 'schema/movie.schema';
import { Types } from 'mongoose';
import { Neo4JService } from 'src/neo4-j/neo4-j.service';

@Injectable()
export class MoviesService {
  constructor(private readonly neo4jService: Neo4JService) { }

  async getMovies() {
    return await this.neo4jService.runQuery('MATCH (m:Movie) RETURN m LIMIT 25');
  }

  async getMoviesByGenre(genre: string) {
    return await this.neo4jService.runQuery(
      `MATCH (m:Movie) WHERE $genre IN m.genres RETURN m LIMIT 25`,
      { genre },
    );
  }

  async getMoviesByLanguage(language: string) {
    return await this.neo4jService.runQuery(
      `MATCH (m:Movie)-[:ES_HABLADO_EN]->(l:Language) WHERE l.name = $language OR l.iso_639_1 = $language RETURN m LIMIT 25`,
      { language },
    );
  }

  async getMoviesByCollection(collection: string) {
    return await this.neo4jService.runQuery(
      `MATCH (m:Movie)-[:BELONGS_TO_COLLECTION]->(c:Collection) WHERE c.name = $collection OR c.id = $collection RETURN m LIMIT 25`,
      { collection },
    );
  }

  async getGenres() {
    return await this.neo4jService.runQuery(
      `MATCH (m:Movie) UNWIND m.genres AS genre RETURN DISTINCT genre`,
    );
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    const { id, title, adult, runtime, vote_average, vote_count, popularity, release_date, overview, genres, original_language, spoken_languages, production_countries, production_companies, budget, revenue } = createMovieDto;

    const releaseDate = new Date(release_date);

    await this.neo4jService.runQuery(
      `
      MERGE (m:Movie {id: $id})
      ON CREATE SET m.title = $title, m.adult = $adult, m.runtime = $runtime, m.vote_avg = $vote_avg, m.vote_count = $vote_count, m.popularity = $popularity, m.release_date = datetime($release_date), m.overview = $overview, m.genres = $genres
      RETURN m
      `,
      {
        id,
        title,
        adult,
        runtime,
        vote_avg: vote_average,
        vote_count,
        popularity,
        release_date: releaseDate.toISOString(),
        overview,
        genres: genres.map(genre => genre.name),
      },
    );

    await this.neo4jService.runQuery(
      `
      MERGE (l:Language {iso_639_1: $iso_639_1})
      RETURN l
      `,
      { iso_639_1: original_language },
    );

    await this.neo4jService.runQuery(
      `
      MATCH (m:Movie {id: $id}), (l:Language {iso_639_1: $iso_639_1})
      MERGE (m)-[r:ES_HABLADO_EN {principal: true, doblado: false, variantes: []}]->(l)
      `,
      { id, iso_639_1: original_language },
    );

    for (const lang of spoken_languages) {
      await this.neo4jService.runQuery(
        `
        MERGE (l:Language {iso_639_1: $iso_639_1, name: $name})
        RETURN l
        `,
        { iso_639_1: lang.iso_639_1, name: lang.name },
      );

      const props = { principal: false, doblado: true, variantes: [] };
      if (lang.iso_639_1 === original_language) {
        props.principal = true;
        props.doblado = false;
      }

      await this.neo4jService.runQuery(
        `
        MATCH (m:Movie {id: $id}), (l:Language {iso_639_1: $iso_639_1})
        MERGE (m)-[r:ES_HABLADO_EN {principal: $principal, doblado: $doblado, variantes: $variantes}]->(l)
        `,
        {
          id,
          iso_639_1: lang.iso_639_1,
          principal: props.principal,
          doblado: props.doblado,
          variantes: props.variantes
        },
      );
    }

    for (const country of production_countries) {
      await this.neo4jService.runQuery(
        `
        MERGE (c:Country {iso_3166_1: $iso_3166_1, name: $name})
        RETURN c
        `,
        { iso_3166_1: country.iso_3166_1, name: country.name },
      );

      const company_names = production_companies.map(company => company.name);

      await this.neo4jService.runQuery(
        `
        MATCH (m:Movie {id: $id}), (c:Country {iso_3166_1: $iso_3166_1})
        MERGE (m)-[r:SE_PRODUJO_EN {productoras: $productoras, budget: $budget, revenue: $revenue}]->(c)
        `,
        { id, iso_3166_1: country.iso_3166_1, productoras: company_names, budget, revenue },
      );
    }

    const result = await this.neo4jService.runQuery(
      `
      MATCH (m:Movie {id: $id})
      RETURN m
      `,
      { id },
    );
    console.log(result.map((record) => record.get('m').properties))
    return result.map((record) => record.get('m').properties);
  }

  async changeDate() {
    await this.neo4jService.runQuery(
      `
        MATCH (m:Movie)
        WHERE m.release_date IS NOT NULL AND NOT m.release_date = 'NaN'
        WITH m, apoc.date.parse(m.release_date, 'ms', 'yyyy-MM-dd') AS parsedDate
        WHERE parsedDate IS NOT NULL
        SET m.release_date = datetime({epochMillis: parsedDate})
        `,
    );
  }

  async getMovie(id: string) {
    const result = await this.neo4jService.runQuery(
      `
      MATCH (m:Movie {id: $id})
      RETURN m
      `,
      { id },
    );
    return result.map((record) => record.get('m').properties);
  }

  async updateMovie(id: string, updateMovieDto: UpdateMovieDto) {
    const { title, adult, runtime, vote_average, vote_count, popularity, release_date, overview, genres, original_language, spoken_languages, production_countries, production_companies, budget, revenue } = updateMovieDto;

    const releaseDate = release_date ? new Date(release_date).toISOString() : null;

    const propertiesToUpdate = {
      title,
      adult,
      runtime,
      vote_avg: vote_average,
      vote_count,
      popularity,
      release_date: releaseDate,
      overview,
      genres: genres ? genres.map(genre => genre.name) : null,
    };

    const setQuery = Object.entries(propertiesToUpdate)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `m.${key} = $${key}`)
      .join(', ');

    const result = await this.neo4jService.runQuery(
      `
        MATCH (m:Movie {id: $id})
        SET ${setQuery}
        RETURN m
        `,
      {
        id,
        ...propertiesToUpdate,
      },
    );
    return result[0].get('m').properties;
  }

  async updateMultipleMovies(ids: string[], updateMovieDto: UpdateMovieDto) {
    const { title, adult, runtime, vote_average, vote_count, popularity, release_date, overview, genres, original_language, spoken_languages, production_countries, production_companies, budget, revenue } = updateMovieDto;

    const releaseDate = release_date ? new Date(release_date).toISOString() : null;

    const propertiesToUpdate = {
      title,
      adult,
      runtime,
      vote_avg: vote_average,
      vote_count,
      popularity,
      release_date: releaseDate,
      overview,
      genres: genres ? genres.map(genre => genre.name) : null,
    };

    const setQuery = Object.entries(propertiesToUpdate)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `m.${key} = $${key}`)
      .join(', ');

    const result = await this.neo4jService.runQuery(
      `
        UNWIND $ids AS id
        MATCH (m:Movie {id: id})
        SET ${setQuery}
        RETURN m
        `,
      {
        ids,
        ...propertiesToUpdate,
      },
    );
    console.log(result)
    return result.map(record => { console.log(record.get('m')); return record.get('m').properties });
  }

  async addPropertyToMovie(id: string, property: string, value: any) {
    const result = await this.neo4jService.runQuery(
      `
      MATCH (m:Movie {id: $id})
      SET m.${property} = $value
      RETURN m
      `,
      { id, value },
    );
    return result[0].get('m').properties;
  }

  async addPropertyToMultipleMovies(ids: string[], property: string, value: any) {
    const result = await this.neo4jService.runQuery(
      `
      UNWIND $ids AS id
      MATCH (m:Movie {id: id})
      SET m.${property} = $value
      RETURN m
      `,
      { ids, value },
    );
    return result.map(record => record.get('m').properties);
  }

  async removePropertyFromMovie(id: string, property: string) {
    const result = await this.neo4jService.runQuery(
      `
      MATCH (m:Movie {id: $id})
      REMOVE m.${property}
      RETURN m
      `,
      { id },
    );
    return result[0].get('m').properties;
  }

  async removePropertyFromMultipleMovies(ids: string[], property: string) {
    const result = await this.neo4jService.runQuery(
      `
      UNWIND $ids AS id
      MATCH (m:Movie {id: id})
      REMOVE m.${property}
      RETURN m
      `,
      { ids },
    );
    return result.map(record => record.get('m').properties);
  }

  async addLanguageToMovie(id: string, language: string) {
    await this.neo4jService.runQuery(
      `
      MERGE (l:Language {name: $language})
      RETURN l
      `,
      { language },
    );

    const result = await this.neo4jService.runQuery(
      `
      MATCH (m:Movie {id: $id}), (l:Language {name: $language})
      MERGE (m)-[r:ES_HABLADO_EN {principal: false, doblado: true, variantes: []}]->(l)
      RETURN m
      `,
      { id, language },
    );
    return result[0].get('m').properties;
  }

  async addPropertyToLanguageRelationship(id: string, language: string, property: string, value: any) {
    const result = await this.neo4jService.runQuery(
      `
      MATCH (m:Movie {id: $id})-[r:ES_HABLADO_EN]->(l:Language {name: $language})
      SET r.${property} = $value
      RETURN m
      `,
      { id, language, value },
    );
    return result[0].get('m').properties;
  }

  async addPropertyToAllLanguagesRelationships(language: string, property: string, value: any) {
    const result = await this.neo4jService.runQuery(
      `
      MATCH (m:Movie)-[r:ES_HABLADO_EN]->(l:Language {name: $language})
      SET r.${property} = $value
      RETURN m
      `,
      { language, value },
    );
    return result.map(record => record.get('m').properties);
  }

  async addLanguageToMultipleMovies(ids: string[], language: string) {
    await this.neo4jService.runQuery(
      `
      MERGE (l:Language {name: $language})
      RETURN l
      `,
      { language },
    );

    const result = await this.neo4jService.runQuery(
      `
      UNWIND $ids AS id
      MATCH (m:Movie {id: id}), (l:Language {name: $language})
      MERGE (m)-[r:ES_HABLADO_EN {principal: false, doblado: true, variantes: []}]->(l)
      RETURN m
      `,
      { ids, language },
    );
    return result.map(record => record.get('m').properties);
  }

  async removeLanguageFromMovie(id: string, language: string) {
    const result = await this.neo4jService.runQuery(
      `
      MATCH (m:Movie {id: $id})-[r:ES_HABLADO_EN]->(l:Language {name: $language})
      DELETE r
      RETURN m
      `,
      { id, language },
    );
    return result[0].get('m').properties;
  }

  async removeLanguageFromMultipleMovies(ids: string[], language: string) {
    const result = await this.neo4jService.runQuery(
      `
      UNWIND $ids AS id
      MATCH (m:Movie {id: id})-[r:ES_HABLADO_EN]->(l:Language {name: $language})
      DELETE r
      RETURN m
      `,
      { ids, language },
    );
    return result.map(record => record.get('m').properties);
  }

  async deleteMovie(id: string) {
    const result = await this.neo4jService.runQuery(
      `
      MATCH (m:Movie {id: $id})
      DETACH DELETE m
      RETURN m
      `,
      { id },);
    return { ok: true };
  }

  async deleteMultipleMovies(ids: string[]) {
    const result = await this.neo4jService.runQuery(
      `
      UNWIND $ids AS id
      MATCH (m:Movie {id: id})
      DETACH DELETE m
      RETURN m
      `,
      { ids },
    );
    return { ok: true };
  }

  /* quantity: number = 0;
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
  } */

}