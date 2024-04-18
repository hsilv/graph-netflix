import {
    IsString, IsInt, IsOptional, IsNumber, IsBoolean,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    isBoolean,
    isBooleanString, Validate, ValidateNested, IsIn
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { GenreDto } from './genre-dto';
import { ProdCompaniesDto } from './prod-companies.dto';
import { ProdCountriesDto } from './prod-countries.dto';
import { SpokenLanguagesDto } from './spoken-languages.dto';


@ValidatorConstraint({ async: true })
export class IsEitherBooleanOrBooleanString implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        return isBoolean(value) || isBooleanString(value);
    }

    defaultMessage(args: ValidationArguments) {
        return 'The text ($value) must be a boolean or a boolean string';
    }
}

export class ProjectionDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    readonly popularity: number;

    @ApiPropertyOptional({ type: [GenreDto] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => GenreDto)
    readonly genres: GenreDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly poster_path: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    readonly runtime: number;


    @ApiPropertyOptional({ type: [SpokenLanguagesDto] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SpokenLanguagesDto)
    readonly spoken_languages: SpokenLanguagesDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly tagline: string;


    @ApiProperty()
    @IsString()
    readonly title: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    readonly vote_average: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly id: string;

    @IsInt()
    @ApiResponseProperty()
    readonly pageLimit: number;

}

export class CreateMovieDto {
    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Validate(IsEitherBooleanOrBooleanString)
    readonly adult: boolean | string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    readonly budget: number;

    @ApiPropertyOptional({ type: [GenreDto] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => GenreDto)
    readonly genres: GenreDto[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly homepage: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly id: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly imdb_id: string;

    @ApiProperty()
    @IsString()
    readonly original_language: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly original_title: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly overview: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    readonly popularity: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly poster_path: string;

    @ApiPropertyOptional({ type: [ProdCompaniesDto] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProdCompaniesDto)
    readonly production_companies: ProdCompaniesDto[];


    @ApiPropertyOptional({ type: [ProdCountriesDto] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProdCountriesDto)
    readonly production_countries: ProdCountriesDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly release_date: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    readonly revenue: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    readonly runtime: number;

    @ApiPropertyOptional({ type: [SpokenLanguagesDto] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SpokenLanguagesDto)
    readonly spoken_languages: SpokenLanguagesDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly status: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly tagline: string;

    @ApiProperty()
    @IsString()
    readonly title: string;

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Validate(IsEitherBooleanOrBooleanString)
    readonly video: boolean | string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    readonly vote_average: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    readonly vote_count: number;

    @IsInt()
    @IsOptional()
    @ApiResponseProperty()
    readonly pageLimit: number;
}
