import { Module } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import providers from "database/repositorys/providers";
import { ApplicationModule } from "./application/application.module";
import { APP_GUARD } from "@nestjs/core";
import { ClientGuard, ProfileGuard } from "./client.guard";
import { ScoreModule } from "./score/score.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [ApplicationModule, ScoreModule, UserModule],
  controllers: [ClientController],

  providers: [
    ...providers,

    ClientService,
    UserModule,

    { provide: APP_GUARD, useClass: ClientGuard },
    { provide: APP_GUARD, useClass: ProfileGuard },
  ],

  exports: [ClientService],
})
export class ClientModule {}
