import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';

@Controller('organizer')
export class OrganizerController {
  constructor(private readonly organizerService: OrganizerService) {}

  @Post('register')
  create(@Body() createOrganizerDto: CreateOrganizerDto) {
    return this.organizerService.create(createOrganizerDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findOne(@Request() req) {
    const organizerId = req.user.sub;
    return this.organizerService.findOne(organizerId);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  update(@Request() req, @Body() updateOrganizerDto: UpdateOrganizerDto) {
    const organizerId = req.user.sub;
    return this.organizerService.update(organizerId, updateOrganizerDto);
  }

  @UseGuards(AuthGuard)
  @Delete('me')
  remove(@Request() req) {
    const organizerId = req.user.sub;
    return this.organizerService.remove(organizerId);
  }
}