import { Router } from ".";

import { Status } from "./context";

const Controller = Router();
Controller.get("/", async ( _, response) => {
    const $ = await Status();

    response.statusCode = 200;
    response.statusMessage = "Online";

    response.setHeader( "Content-Type", "Application/JSON");

    response.send($);
});

export { Controller as Health };

export default Controller;
