import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private svc: EventsService) {}
  @Post() create(@Body() dto: any) {
    return this.svc.create(dto);
  }
  @Get() list(@Query('userId') userId: string) {
    return this.svc.listByUser(Number(userId));
  }
}
