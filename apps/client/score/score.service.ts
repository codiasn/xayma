import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { ApplicationRepository } from "database/repositorys/Application";
import { ScoreRepository } from "database/repositorys/Score";
import { Request } from "express";

@Injectable()
export class ScoreService {
  @Inject(REQUEST) private readonly request: Request;
  @Inject() private repository: ScoreRepository;
  @Inject() private applicationRepository: ApplicationRepository;

  async list(params: any) {
    const scores = await this.repository._find(params);
    return scores;
  }
}
