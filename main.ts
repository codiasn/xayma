import { NestFactory } from "@nestjs/core";
import { AppModule } from "./apps/module";
import { json } from "express";
import { Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import utils from "utils/forge";
import { sign } from "utils/jwt";

async function bootstrap() {
  utils.generate();

  const app = await NestFactory.create(AppModule, { cors: { origin: "*" } });

  app.setGlobalPrefix(process.env.ROUTE_PREFIX);
  app.use(json({ limit: "50mb" }));

  const config = new DocumentBuilder()
    .setTitle("Cats example")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addTag("cats")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, documentFactory);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `v-${process.env.npm_package_version} listen at http://localhost:${port}`,
  );
}
bootstrap();
