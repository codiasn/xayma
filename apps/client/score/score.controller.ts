import { Controller, Get, Inject, Body, Post } from "@nestjs/common";
import { ScoreService } from "./score.service";
import { Public } from "decorators/index";

@Controller()
export class ScoreController {
  constructor() {}

  @Inject() private readonly service: ScoreService;

  @Public()
  @Post()
  async get(@Body() body: any) {
    return await this.service.get(body);
  }
}
