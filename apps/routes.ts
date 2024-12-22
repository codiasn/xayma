import { Routes } from "@nestjs/core";
import { ClientModule } from "./client/client.module";
import { ApplicationModule } from "./client/application/application.module";
import { ScoreModule } from "./client/score/score.module";
import { SessionModule } from "./session/session.module";
import { UserModule } from "./client/user/user.module";

const routes: Routes = [
  { path: "/session", module: SessionModule },
  {
    path: "/_/",
    module: ClientModule,

    children: [
      {
        path: "/user",
        module: UserModule,
      },
      {
        path: "/application",
        module: ApplicationModule,
      },
      {
        path: "/score",
        module: ScoreModule,
      },
    ],
  },
];

export default routes;
