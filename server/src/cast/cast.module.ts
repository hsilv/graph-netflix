import { Module } from '@nestjs/common';
import { CastService } from './cast.service';
import { CastController } from './cast.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cast, CastSchema } from '../../schema/cast.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cast.name, schema: CastSchema }])],
  controllers: [CastController],
  providers: [CastService],
})
export class CastModule { }
