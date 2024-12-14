import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
} from "@nestjs/common";
import { Public } from "decorators/index";
import { ApplicationService } from "./client/application/application.service";
import { ScoreService } from "./client/score/score.service";
import { ScoreRepository } from "database/repositorys/Score";
import { ApplicationRepository } from "database/repositorys/Application";

@Controller("/")
export class AppController {
  @Inject() private scoreRepository: ScoreRepository;
  @Inject() private applicationRepository: ApplicationRepository;

  @Public()
  @Get("/ping")
  main(): string {
    return "xayma";
  }

  @Public()
  @Post("/score")
  async score(@Body() body: any) {
    const application = await this.applicationRepository._findOne({
      id: body.application,
    });

    if (!application) throw new NotFoundException("application_not_found");

    await this.scoreRepository._add(body, application);
    return {};
  }
}
