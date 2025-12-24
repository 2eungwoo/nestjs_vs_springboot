import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {firstValueFrom} from 'rxjs';
import {AxiosResponse} from 'axios';
import {CreateOrderDto} from '../dto/create-order.dto';

interface HashResponse {
  hash: string;
}

@Injectable()
export class HashService {
  constructor(private readonly httpService: HttpService) {
  }

  async generateHash(dto: CreateOrderDto): Promise<string> {
    const {data}: AxiosResponse<HashResponse> = await firstValueFrom(
        this.httpService.post<HashResponse>(
            'http://127.0.0.1:7000/hash',
            dto,
        ),
    );
    if (!data?.hash) {
      throw new Error('Failed to fetch hash from API');
    }
    return data.hash;
  }
}
