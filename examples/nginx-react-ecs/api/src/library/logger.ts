import Default from "pino";

const $ = Default.destination({ sync: false });

const Logger = Default($);

export { Logger };

export default Logger;