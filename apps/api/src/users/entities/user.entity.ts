import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ select: false }) //para que, por padrão, o campo de senha nunca seja retornado em consultas find
  password!: string;

  @OneToMany(() => Enrollment, (e) => e.user) enrollments!: Enrollment[];
}
