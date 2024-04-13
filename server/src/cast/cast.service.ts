import { Injectable } from '@nestjs/common';
import { CreateCastDto } from './dto/create-cast.dto';
import { UpdateCastDto } from './dto/update-cast.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cast } from 'schema/cast.schema';

@Injectable()
export class CastService {
  quantity = 0;

  constructor(@InjectModel('Cast') private castModel: Model<Cast>) {
    this.castModel.find().countDocuments().exec().then((quantity) => {
      this.quantity = quantity;
    });
  }

  create(createCastDto: CreateCastDto) {
    return 'This action adds a new cast';
  }

  async findAll(page: number, limit: number): Promise<Cast[]> {
    let result;
    page = Number(page);
    limit = Number(limit);
    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      result = await this.castModel.aggregate([
        { $limit: 10 },
        {
          $lookup: {
            from: "movies",
            localField: "id",
            foreignField: "id",
            as: "movie"
          }
        },
        { $project: { cast: 1, id: 1, _id: 1, poster_path: 1, movie: 1 } },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }
    else if ((page !== 0) && (limit !== 0)) {
      result = await this.castModel.aggregate([
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: "movies",
            localField: "id",
            foreignField: "id",
            as: "movie"
          }
        },
        { $project: { cast: 1, id: 1, _id: 1, poster_path: 1, movie: 1 } },
        { $addFields: { pageLimit: Math.ceil(this.quantity / limit) } }
      ]);
    } else {
      result = await this.castModel.aggregate([
        { $limit: 10 },
        {
          $lookup: {
            from: "movies",
            localField: "id",
            foreignField: "id",
            as: "movie"
          }
        },
        { $project: { cast: 1, id: 1, _id: 1, poster_path: 1, movie: 1 } },
        { $addFields: { pageLimit: Math.ceil(this.quantity / 10) } }
      ]);
    }

    return result;
  }

  async findMovieCrew(id: string): Promise<Cast[]> {
    const result = await this.castModel.aggregate([
      {
        $match: { id: id }
      },
      {
        $lookup: {
          from: "movies",
          localField: "id",
          foreignField: "id",
          as: "movie"
        }
      },
      {
        $project: { cast: 1, id: 1, _id: 1, poster_path: 1, movie: 1 }
      }
    ]);

    return result;
  }


  findOne(id: number) {
    return `This action returns a #${id} cast`;
  }

  update(id: number, updateCastDto: UpdateCastDto) {
    return `This action updates a #${id} cast`;
  }

  remove(id: number) {
    return `This action removes a #${id} cast`;
  }
}
