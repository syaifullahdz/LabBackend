import { ApiAcceptedResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, Length, IsNotEmpty } from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty({
    description: 'UserName',
    type: String,
    example: 'AzzahAuliaSyarif',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S*$/i, { message: 'Username tidak boleh ada spasi' })
  @Length(1, 30)
  username: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S*$/i, { message: 'Katasandi tidak boleh ada spasi' })
  @Length(1, 30)
  password: string;
}
