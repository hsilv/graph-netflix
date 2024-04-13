import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Schema({ collection: 'cast_crew' })
export class CastItem {
    @Prop()
    cast_id: number;

    @Prop()
    character: string;

    @Prop()
    credit_id: string;

    @Prop()
    gender: number;

    @Prop()
    id: number;

    @Prop()
    name: string;

    @Prop()
    order: number;

    @Prop()
    profile_path: string;
}

@Schema({ collection: 'cast_crew' })
export class Cast {
    @Prop()
    cast: CastItem[];

    @Prop()
    id: string;

    @Prop()
    _id: ObjectId;

    @Prop()
    poster_path: string;
}

export const CastSchema = SchemaFactory.createForClass(Cast);
export const CastItemSchema = SchemaFactory.createForClass(CastItem);