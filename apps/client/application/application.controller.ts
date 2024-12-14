import {
  Controller,
  Get,
  Inject,
  Body,
  Post,
  Param,
  Delete,
} from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { Public } from "decorators/index";

@Controller()
export class ApplicationController {
  constructor() {}

  @Inject() private readonly service: ApplicationService;

  @Public()
  @Post()
  async create(@Body() body: any) {
    return await this.service.create(body);
  }

  @Public()
  @Get("/:id")
  async get(@Param("id") id: string) {
    return (await this.service.list({ id }))[0];
  }

  @Public()
  @Post("/list")
  async list(@Body() body: any) {
    return await this.service.list(body);
  }

  @Public()
  @Delete("/:id")
  async remove(@Param("id") id: string) {
    return await this.service.remove(id);
  }
}
