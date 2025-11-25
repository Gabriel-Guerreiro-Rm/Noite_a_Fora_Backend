import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventService {
  constructor(private readonly httpService: HttpService) {}

  private readonly SISTEMA1_URL = 'http://localhost:3001';
  private readonly SISTEMA1_API_KEY =
    'ApiKey NOSSA_CHAVE_SECRETA_DO_SISTEMA_2';

  async findAllEvents() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.SISTEMA1_URL}/event`),
    );
    return response.data;
  }

  async purchaseTicket(ticketLotId: string) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.SISTEMA1_URL}/event/internal/purchase`,
        { ticketLotId },
        { headers: { Authorization: this.SISTEMA1_API_KEY } },
      ),
    );
    return response.data;
  }
}