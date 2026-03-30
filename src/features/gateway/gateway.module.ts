import { Module } from '@nestjs/common';
import AuthServiceClient from './clients/AuthServiceClient';
import FinancesServcieClient from './clients/FinancesServiceClient';
import GatewayController from './gateway.controller';

@Module({
  controllers: [GatewayController],
  providers: [
    {
      provide: "AUTH_SERVICE_CLIENT",
      useClass: AuthServiceClient
    },
    {
      provide: "FINANCES_SERVICE_CLIENT",
      useClass: FinancesServcieClient
    }
]
})

export class GatewayModule {}