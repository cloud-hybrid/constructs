import { Router } from "..";

import { Awaitable } from "./awaitable";
import { Health } from "./health";

const Controller = Router();

const Online = () => JSON.stringify({ Status: "Online" }, null, 4);
Controller.get("/", async (_, response) => {
    response.shouldKeepAlive = true;
    response.statusMessage = "Online";
    response.statusCode = 200;

    response.setHeader("Keep-Alive", 5);
    response.setHeader("Content-Type", "Application/JSON");

    response.write(Online());

    response.send();
});

Controller.use("/awaitable", Awaitable);
Controller.use("/health", Health);

export { Router };
export { Controller as Utilities };
export default Controller;