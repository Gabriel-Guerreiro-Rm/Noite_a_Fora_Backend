import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketLotDto } from './create-ticket-lot.dto';

export class UpdateTicketLotDto extends PartialType(CreateTicketLotDto) {}