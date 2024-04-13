import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenreDto {

    @ApiProperty()
    @IsInt()
    readonly id: number;

    @ApiProperty()
    @IsString()
    readonly name: string;
}