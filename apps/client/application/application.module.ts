import { Module } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { ApplicationController } from "./application.controller";
import providers from "database/repositorys/providers";

@Module({
  imports: [],
  controllers: [ApplicationController],
  providers: [...providers, ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
