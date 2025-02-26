import { ApiProperty } from '@nestjs/swagger';
import { Jenis_Kelamin } from '@prisma/client';
import { IsString, IsNotEmpty, Length, IsEnum, IsOptional } from 'class-validator';

export class UpdateMahasiswaDTO {
  @ApiProperty({
    description: 'Foto Profile',
    type: String,
    example: 'http://localhost:3000/uploads/105841105422.jpg',
  })
  @IsString()
  @IsOptional()
  foto_profile?: string;

  @ApiProperty({
    description: 'NIM',
    type: String,
    example: '105841105022',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 12)
  nim: string;

  @ApiProperty({
    description: 'Nama',
    type: String,
    example: 'Azzah Aulia Syarif',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nama: string;

  @ApiProperty({
    description: 'Kelas',
    type: String,
    example: '5B',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  kelas: string;

  @ApiProperty({
    description: 'Jurusan',
    type: String,
    example: 'Informatika',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  jurusan: string;

  @ApiProperty({
    description: 'Jenis Kelamin',
    enum: Jenis_Kelamin,
    example: 'P',
  })
  @IsEnum(Jenis_Kelamin)
  jenis_kelamin: Jenis_Kelamin;
}
