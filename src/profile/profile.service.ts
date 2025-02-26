import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { extname, resolve, join } from 'path';
import prisma from 'src/prisma';

@Injectable()
export class ProfileService {
  async uploadFile(file: Express.Multer.File, user_id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (user == null) throw new NotFoundException('Tidak menemukan User');

    if (user.foto_profile != null) {
      const filePath = resolve(__dirname, '../../uploads', user.foto_profile);

      if (existsSync(filePath)) {
        rmSync(filePath);
      }
    }

    const uploadPath = resolve(__dirname, '../../uploads');
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }

    const fileExt = extname(file.originalname);
    const baseFilename = user.username;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;
    const filePath = `${uploadPath}/${filename}`;

    try {
      writeFileSync(filePath, file.buffer);
    } catch (error) {
      throw new InternalServerErrorException('Gagal menyimpan file');
    }

    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        foto_profile: filename,
      },
    });

    return { filename, path: filePath };
  }

  async sendMyFotoProfile(user_id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (user == null) throw new NotFoundException('Tidak menemukan User');

    return user.foto_profile;
  }

  async cariMahasiswa(filters: { nama?: string; nim?: string }) {
    const where: any = {};

    if (filters.nama) {
      where.nama = { contains: filters.nama };
    }

    if (filters.nim) {
      where.nim = { contains: filters.nim };
    }

    return await prisma.mahasiswa.findMany({ where });
  }

  async uploadMahasiswaFoto(file: Express.Multer.File, nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Mahasiswa Tidak Ditemukan');

    if (mahasiswa.foto_profile) {
      const filePath = resolve(
        __dirname,
        '../../uploads',
        mahasiswa.foto_profile,
      );
      if (existsSync(filePath)) {
        rmSync(filePath);
      }
    }

    const uploadPath = resolve(__dirname, '../../uploads');
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }

    const fileExt = extname(file.originalname);
    const baseFilename = mahasiswa.nim;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;
    const filePath = `${uploadPath}/${filename}`;

    try {
      writeFileSync(filePath, file.buffer);
    } catch (error) {
      throw new InternalServerErrorException('Gagal menyimpan file');
    }

    await prisma.mahasiswa.update({
      where: { nim },
      data: { foto_profile: filename },
    });

    return filename;
  }

  async getMahasiwaFoto(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Mahasiswa Tidak Ditemukan');
    return mahasiswa.foto_profile;
  }
}
