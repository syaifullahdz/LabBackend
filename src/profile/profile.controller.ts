import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UserDecorator } from 'src/user.decorator';
import { User } from 'src/entity/user.entity';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @UserDecorator() user: User,
  ) {
    if (file == null)
      throw new BadRequestException('File tidak boleh kosong!!');
    return this.profileService.uploadFile(file, user.id);
  }

  @Get('search')
  async getName(@Query('search') search: string) {
    return search;
  }

  @Get('/:id')
  async getProfile(@Param('id') id: number, @Res() res: Response) {
    const filename = await this.profileService.sendMyFotoProfile(id);
    const filePath = join(__dirname, '../../uploads', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File tidak ditemukan');
    }

    return res.sendFile(filePath);
  }

  @Get('mahasiswa/search')
  async cariMahasiswa(@Query() query: { nama?: string; nim?: string }) {
    return this.profileService.cariMahasiswa(query);
  }

  @Post('mahasiswa/:nim/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadMahasiswaFoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('nim') nim: string,
  ) {
    if (!file) throw new BadRequestException('File tidak boleh kosong');
    return this.profileService.uploadMahasiswaFoto(file, nim);
  }

  @Get('mahasiswa/:nim/foto')
  async getMahasiswa(@Param('nim') nim: string, @Res() res: Response) {
    const filename = await this.profileService.getMahasiwaFoto(nim);
    const filePath = join(__dirname, '../../uploads', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File tidak ditemukan');
    }

    return res.sendFile(filePath);
  }
}
