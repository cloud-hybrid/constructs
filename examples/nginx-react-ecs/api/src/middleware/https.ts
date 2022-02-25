/***
 *  HTTPs Redirect
 */

import { Application } from "..";

type Server = typeof Application;
const HTTPs = (server: Server | any) => {
    console.debug("[HTTPs] [Debug] Instantiating HTTPs Check");
    const $ = (request: { headers: { host: string; }; url: string; }) => {
        return server?.redirect("https://" + request.headers.host + request.url);

        /// if (request.get("X-Forwarded-Proto")?.indexOf("https") === -1) {
        ///     return request.redirect("https://" + request.headers.host + request.url);
        /// }

        // callback();
    };

    console.debug("[HTTPs] [Debug] Setting HTTPs Override");

    server.use($);

    console.debug("[HTTPs] [Debug] Enabled HTTPs Redirects");
};

export default HTTPs;

export { HTTPs };