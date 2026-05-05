import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: 'SuperSecret123!' })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;
}