import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { Public } from "decorators/index";
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
  @Post("/score/:application")
  async score(@Body() body: any, @Param("application") applicationId: string) {
    const application = await this.applicationRepository._findOne({
      id: applicationId,
    });

    if (!application) throw new NotFoundException("application_not_found");

    const score = await this.scoreRepository._add(body, application);

    delete score.application?.client;

    return score;
  }

  @Public()
  @Get("/application/:id")
  async application(@Param("id") id: string) {
    const application = await this.applicationRepository._findOne({ id });
    if (!application) throw new NotFoundException("application_not_found");

    return application;
  }
}
