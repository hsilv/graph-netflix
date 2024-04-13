import { ObjectId } from "mongodb";

export class CastItemDto {
    cast_id: number;
    character: string;
    credit_id: string;
    gender: number;
    id: number;
    name: string;
    order: number;
    profile_path: string;
}
export class CreateCastDto {

    cast: CastItemDto[];
    id: string;
    _id: ObjectId;
    poster_path: string;

}
