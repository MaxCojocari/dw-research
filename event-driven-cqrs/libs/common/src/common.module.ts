import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { configurationSchema } from './config/configuration.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
      ],
      load: [configuration],
      validationSchema: configurationSchema,
      isGlobal: true,
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
