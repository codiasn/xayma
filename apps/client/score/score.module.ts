import { Module } from "@nestjs/common";
import { ScoreService } from "./score.service";
import { ScoreController } from "./score.controller";
import providers from "database/repositorys/providers";

@Module({
  controllers: [ScoreController],
  providers: [...providers, ScoreService],
  exports: [ScoreService],
})
export class ScoreModule {}
