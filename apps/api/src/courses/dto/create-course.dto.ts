import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;
}
