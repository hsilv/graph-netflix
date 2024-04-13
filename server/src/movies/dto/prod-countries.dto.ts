import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class ProdCountriesDto {
    @ApiProperty()
    @IsString()
    iso_3166_1: string;

    @ApiProperty()
    @IsString()
    name: string;
}