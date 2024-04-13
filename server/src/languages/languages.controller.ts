import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('languages')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) { }


  @Get()
  findAll() {
    return this.languagesService.findAll();
  }

  @Patch('/id/:idOrName')
  updateLanguage(@Param('idOrName') idOrName: string, @Query('newName') newName: string) {
    return this.languagesService.renameLanguage(idOrName, newName);
  }

  @Delete('/id/:idOrName')
  removeLanguage(@Param('idOrName') idOrName: string) {
    return this.languagesService.removeLanguage(idOrName);
  }

}
