import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn() id!: number;
  @ManyToOne(() => User, (u) => u.enrollments) user!: User;
  @ManyToOne(() => Course, (c) => c.enrollments) course!: Course;
}
