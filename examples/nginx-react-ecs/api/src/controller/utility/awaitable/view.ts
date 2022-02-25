import { Router } from ".";

import { Wait } from "./context";

import * as Querystring from "querystring";

const Controller = Router();
Controller.get("/", async (request, response) => {
    // const $ = JSON.stringify(new Parameters(request.url.replace("?", "").replace("/", "")), null, 4);

    const $ = JSON.stringify(Querystring.parse(request.url.replace("?", "").replace("/", "")), null, 4);

    const Arguments = JSON.parse($);

    const Duration = (Arguments["Duration"] || Arguments["duration"] || 1000);

    if ( Duration >= 60000 ) {
        console.warn("[Utility] [Warning] Cannot Await Longer than 60 Seconds (60,000ms)");
        response.type("Application/JSON");
        response.status(417);
        response.setHeader("Expect", "Duration < 100000");

        response.send();
    } else {
        const $ = JSON.stringify({ Duration }, null, 4);

        await Wait(Duration);

        response.statusCode = 200;
        response.statusMessage = "Online";

        response.setHeader( "Content-Type", "Application/JSON");

        response.send($);
    }
});

export { Controller as Awaitable };

export default Controller;
