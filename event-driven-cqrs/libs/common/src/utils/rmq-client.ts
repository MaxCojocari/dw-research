import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

interface ClientOptions {
  name: string;
  queueConfigPath: string;
}

export function createRabbitClient(options: ClientOptions) {
  return {
    provide: options.name,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get('rabbit.url')],
          queue: configService.get(options.queueConfigPath),
          queueOptions: {
            durable: true,
          },
        },
      });
    },
  };
}
