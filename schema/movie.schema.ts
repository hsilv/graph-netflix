

export interface MovieError {
    message: string[];
    rerror: string;
    status: number;
}


export interface Genre {
    id?: number;
    name: string;
}

export interface BelongsToCollection {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
}

export class ProductionCompanies {
    id: number;
    name: string;
}

export class ProductionCountries {
    iso_3166_1: string;
    name: string;
}

export class SpokenLanguages {
    iso_639_1: string;
    name: string;
}


export class MovieProjection {
    popularity?: number;
    genres?: Genre[];
    poster_path?: string;
    runtime?: number;
    spoken_languages?: SpokenLanguages[];
    tagline?: string;
    title?: string;
    vote_average?: number;
    id: string;
    pageLimit: number;
}

export interface Movie {
    _id?: string;
    adult?: boolean;
    belongs_to_collection?: BelongsToCollection;
    budget?: number;
    genres?: Genre[];
    homepage?: string;
    id?: string;
    imdb_id?: string;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    production_companies?: ProductionCompanies[];
    production_countries?: ProductionCountries[];
    release_date?: string;
    revenue?: number;
    runtime?: number;
    spoken_languages?: SpokenLanguages[];
    status?: string;
    tagline?: string;
    title: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
    pageLimit: number;
}