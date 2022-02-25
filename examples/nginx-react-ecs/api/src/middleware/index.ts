type Server = typeof import("..").Application;

const Middleware = async (server: Server) => {
    console.debug("[Middleware] [Debug] Initializing Middleware ...");

    const Promises = Promise.allSettled((
        [
            import("./compression").then((Module) => Module.Compress(server)),
            import("./logging").then((Module) => Module.Logging(server)),
            import("./headers").then((Module) => Module.Headers(server)),
            import("./ipv4").then((Module) => Module.IP()),
            import("./body").then((Module) => Module.Body(server)),
            import("./cors").then((Module) => Module.CORS(server)),
            import("./socket").then((Module) => Module.WS(server))
        ]
    ));

    Promises.finally(() => console.debug("[Middleware] [Debug] API Middleware Successfully Loaded"));

    return Promises;
};

export { Middleware };

export default Middleware;