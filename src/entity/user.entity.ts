import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class User {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  @Expose()
  role: UserRole;


  @Expose()
  create_at: Date;

  @Expose()
  foto_profile : string | null;
}
