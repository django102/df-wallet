import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import {env} from "../env";

import { Application, json, urlencoded, Request, Response } from 'express';

const {app: appInfo} = env;

const corsOptions = {
    origin(origin, callback) {
        callback(null, true);
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 50 // limit each IP to 50 requests per windowMs
});


const expressConfig = (app: Application): void => {
    app.use(cors(corsOptions));
    app.use(limiter);
    app.use(compression());
    app.use(urlencoded({extended: true}));
    app.use(json());
    
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"]
        }
    }));

    app.get("/", (req:Request, res:Response) => res.send(`${appInfo.displayName} - v${appInfo.version}`));
}

export default expressConfig;