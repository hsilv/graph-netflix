import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

export class Genre {
    @Prop()
    id: number;

    @Prop()
    name: string;
}

export class BelongsToCollection {
    @Prop()
    id: number;

    @Prop()
    name: string;

    @Prop()
    poster_path: string;

    @Prop()
    backdrop_path: string;
}

export class ProductionCompanies {
    @Prop()
    id: number;

    @Prop()
    name: string;
}

export class ProductionCountries {
    @Prop()
    iso_3166_1: string;

    @Prop()
    name: string;
}

@Schema({ collection: 'movies' })
export class SpokenLanguages {
    @Prop()
    iso_639_1: string;

    @Prop()
    name: string;
}

export class CreatedMovieResponse {
    acknowledged: boolean;
    insertedId: ObjectId;
}

export class MovieProjection {
    readonly popularity: number;
    readonly genres: Genre[];
    readonly poster_path: string;
    readonly runtime: number;
    readonly spoken_languages: SpokenLanguages[];
    readonly tagline: string;
    readonly title: string;
    readonly vote_average: number;
    readonly id: string;
}

@Schema({ collection: 'movies' })
export class Movie {
    @Prop()
    adult: boolean;

    @Prop()
    belongs_to_collection: BelongsToCollection;

    @Prop()
    budget: number;

    @Prop()
    genres: Genre[];

    @Prop()
    homepage: string;

    @Prop()
    id: string;

    @Prop()
    imdb_id: string;

    @Prop()
    original_language: string;

    @Prop()
    original_title: string;

    @Prop()
    overview: string;

    @Prop()
    popularity: number;

    @Prop()
    poster_path: string;

    @Prop()
    production_companies: ProductionCompanies[];

    @Prop()
    production_countries: ProductionCountries[];

    @Prop()
    release_date: string;

    @Prop()
    revenue: number;

    @Prop()
    runtime: number;

    @Prop()
    spoken_languages: SpokenLanguages[];

    @Prop()
    status: string;

    @Prop()
    tagline: string;

    @Prop()
    title: string;

    @Prop()
    video: boolean;

    @Prop()
    vote_average: number;

    @Prop()
    vote_count: number;

    @Prop()
    pageLimit: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
export const LanguageSchema = SchemaFactory.createForClass(SpokenLanguages);