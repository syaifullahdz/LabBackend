import { BadRequestException, Get, HttpException, Injectable, InternalServerErrorException, NotFoundException, Param, Res, } from '@nestjs/common';
import { CreateMahasiswaDTO } from './dto/create-mahasiswa.dto';
import prisma from './prisma';
import { RegisterUserDTO } from './dto/register-user.dto';
import { hashSync, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import { UpdateMahasiswaDTO } from './dto/update-mahasiswa.dto';
import { Response } from 'express';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  async login(data: RegisterUserDTO) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: data.username,
        },
      });
      if (user == null)
        throw new NotFoundException('Username yang anda masukkan salah');

      if (!compareSync(data.password, user.password))
        throw new BadRequestException('Password yang anda masukkan Salah');

      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      const token = await this.jwtService.signAsync(payload);

      return {
        token: token,
        user,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Terdapat Masalah dari Server Harap Coba Lagi dalam Beberapa Menit',
      );
    }
  }

  async register(data: RegisterUserDTO) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: data.username,
        },
      });
      if (user != null)
        throw new BadRequestException('Registration Anda telah Berhasil');

      const hash = hashSync(data.password, 10);
      const newUser = await prisma.user.create({
        data: {
          username: data.username,
          password: hash,
          role: 'USER',
        },
      });
      return newUser;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Terdapat Masalah dari Server Harap Coba Lagi dalam Beberapa Menit',
      );
    }
  }

  async auth(user_id: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });
      if (user == null) throw new NotFoundException('User Tidak Ditemukan');
      return user;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Terdapat Masalah Dari Server Harap Coba Lagi dalam beberapa menit',
      );
    }
  }

  async deleteUser(username: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (user == null) {
        throw new NotFoundException('Username tidak ditemukan');
      }

      await prisma.user.delete({
        where: {
          username,
        },
      });

      return { message: 'Username anda telah berhasil dihapus' };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Ada Masalah Pada Server');
    }
  }

  async getUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  }

  async getMahasiswa() {
    return await prisma.mahasiswa.findMany();
  }

  async getMahasiswaByNIM(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim,
      },
    });

    if (mahasiswa == null) throw new NotFoundException('Tidak Menemukan NIM');
    return mahasiswa;
  }

  async addMahasiswa(data: CreateMahasiswaDTO) {
    await prisma.mahasiswa.create({
      data,
    });

    return await prisma.mahasiswa.findMany();
  }

  async deleteMahasiswa(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim,
      },
    });

    if (mahasiswa == null) {
      throw new NotFoundException('Tidak Menemukan NIM');
    }

    await prisma.mahasiswa.delete({
      where: {
        nim,
      },
    });

    return await prisma.mahasiswa.findMany();
  }

  async updateMahasiswa(nim: string, nama: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim,
      },
    });

    if (mahasiswa == null) {
      throw new NotFoundException('Tidak Menemukan NIM');
    }

    await prisma.mahasiswa.update({
      where: {
        nim,
      },
      data: {
        nama,
      },
    });

    return await prisma.mahasiswa.findMany();
  }
}
