import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class SpokenLanguagesDto {
    @ApiProperty()
    @IsString()
    iso_639_1: string;

    @ApiProperty()
    @IsString()
    name: string;
}