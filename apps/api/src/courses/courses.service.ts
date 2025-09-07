import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private repo: Repository<Course>) {}

  create(createCourseDto: CreateCourseDto) {
    const user = this.repo.create(createCourseDto);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const course = await this.repo.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(`Curso não encontrado.`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.repo.preload({
      id: id,
      ...updateCourseDto,
    });
    if (!course) {
      throw new NotFoundException(`Curso não encontrado.`);
    }
    return this.repo.save(course);
  }

  async remove(id: number) {
    const curso = await this.findOne(id);
    await this.repo.remove(curso);
  }
}
