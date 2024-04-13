import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { LanguagesModule } from './languages/languages.module';
import { CollectionsModule } from './collections/collections.module';
import { FilesModule } from './files/files.module';
import { CastModule } from './cast/cast.module';
import { CrewModule } from './crew/crew.module';
import * as dotenv from 'dotenv'

dotenv.config()

@Module({
  imports: [
    MoviesModule,
    MongooseModule.forRoot(process.env.DATABASE_URI),
    GenresModule,
    LanguagesModule,
    CollectionsModule,
    FilesModule,
    CastModule,
    CrewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
