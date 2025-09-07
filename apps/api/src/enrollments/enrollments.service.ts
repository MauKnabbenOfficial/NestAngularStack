import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment) private repo: Repository<Enrollment>,
  ) {}

  create(createEnrollmentDto: CreateEnrollmentDto) {
    // O TypeORM é inteligente o suficiente para entender que está criando uma relação apenas com os IDs.
    const enrollment = this.repo.create({
      user: { id: createEnrollmentDto.userId },
      course: { id: createEnrollmentDto.courseId },
    });

    return this.repo.save(enrollment);
  }

  findAll(): Promise<Enrollment[]> {
    // Retorna as matrículas com os dados de usuário e curso aninhados
    return this.repo.find({ relations: ['user', 'course'] });
  }

  async findOne(id: number) {
    const enrollment = await this.repo.findOne({
      where: { id },
      relations: ['user', 'course'],
    });
    if (!enrollment) {
      throw new NotFoundException(`Matrícula não encontrada.`);
    }
    return enrollment;
  }

  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.repo.preload({
      id: id,
      user: { id: updateEnrollmentDto.userId },
      course: { id: updateEnrollmentDto.courseId },
    });
    if (!enrollment) {
      throw new NotFoundException(`Matrícula não encontrada.`);
    }
    return this.repo.save(enrollment);
  }

  async remove(id: number) {
    const enrollment = await this.findOne(id);
    await this.repo.remove(enrollment);
  }
}
