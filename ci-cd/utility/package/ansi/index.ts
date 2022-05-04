import Type from "./color/colors";

import { Module } from "./module.js";

export * from "./module.js";
export * from "./implementation.js";
export * from "./modifier.js";
export * from "./sequence.js";
export * from "./symbol.js";
export * from "./type.js";

export * from "./color/index.js";

const Colors = new Module();

export default (color: Type, content: string) => Colors.string( color, content );
