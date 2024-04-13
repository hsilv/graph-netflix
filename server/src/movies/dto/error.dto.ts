
import { IsInt, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {

    @ApiProperty({ type: String, isArray: true })
    @IsArray()
    @IsString({ each: true })
    readonly message: string[];

    @ApiProperty()
    @IsString()
    readonly error: string;

    @ApiProperty()
    @IsInt()
    readonly status: number;
}