import express from "express";
import expressConfig from "./config/express";
import {env} from "./env";

const {app: appInfo} = env;

const app: express.Application = express();

expressConfig(app);

app.listen(appInfo.port, () => {
    console.log(`${appInfo.displayName}, v${appInfo.version} is started on port ${appInfo.port}`);
});