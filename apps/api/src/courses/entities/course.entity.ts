import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn() id!: number;
  @Column() title!: string;
  @OneToMany(() => Enrollment, (e) => e.course) enrollments!: Enrollment[];
}
