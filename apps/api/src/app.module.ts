import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: process.env.PG_URL,
    //   entities: [User, Course, Enrollment],
    //   synchronize: false, // use migrations em prod
    //   autoLoadEntities: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST_DOCKER,
      port: parseInt(process.env.PGPORT!, 10) || 5432,
      database: process.env.PGDATABASE,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      synchronize: true, // use migrations em prod
      // synchronize: false, para prod -> use migrations em prod
      autoLoadEntities: true,
      // ssl: true,
      // extra: { ssl: { rejectUnauthorized: false } }, // se precisar ignorar CA em dev - Certificate Authority (autoridade que assina o certificado TLS do servidor).
    }),
    MongooseModule.forRoot(process.env.MONGO_URL_DOCKER!),
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    EventsModule,
    AuthModule,
  ],
})
export class AppModule {}
