import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, UploadedFile, Query, Res, BadRequestException, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateMahasiswaDTO } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDTO } from './dto/update-mahasiswa.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { Response } from 'express';
import { plainToInstance} from 'class-transformer';
import { User } from './entity/user.entity';
import { UserDecorator } from './user.decorator';
import { AuthGuard } from './auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('Mahasiswa')
  @ApiBody({ type: CreateMahasiswaDTO })
  createMahasiswa(@Body() data: CreateMahasiswaDTO) {
    return this.appService.addMahasiswa(data);
  }

  @Delete('Mahasiswa/:nim')
  deleteMahasiswa(@Param('nim') nim: string) {
    return this.appService.deleteMahasiswa(nim);
  }


  @Put('Mahasiswa/:nim')
  @ApiBody({ type: UpdateMahasiswaDTO })
  editMahasiswa(
    @Param('nim') nim: string,
    @Body() { nama }: UpdateMahasiswaDTO,
  ) {
    return this.appService.updateMahasiswa(nim, nama);
  }

  @Get('Mahasiswa')
  getMahasiswa() {
    return this.appService.getMahasiswa();
  }

  @Post('register')
  @ApiBody({ type: RegisterUserDTO })
  register(@Body() data: RegisterUserDTO) {
    return this.appService.register(data);
  }

  @Post('login')
  @ApiBody({ type: RegisterUserDTO })
  async login(
    @Body() data: RegisterUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.appService.login(data);
    res.cookie('token', result.token);

    result.user = plainToInstance(User, result.user);

    return result;
  }

  @Get('auth')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  auth(@UserDecorator() user: User) {
    return user;
  }

  @Get('Mahasiswa/:nim')
  getMahasiswaByNim(@Param('nim') nim: string) {
    return this.appService.getMahasiswaByNIM(nim);
  }

  @Delete('user/:username')
  deleteUser(@Param('username') username: string) {
    return this.appService.deleteUser(username);
  }
  @Get('users')
  getUsers() {
    return this.appService.getUsers();
  }
}
