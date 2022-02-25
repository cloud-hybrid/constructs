import express                     from "express";

import ws, { WithWebsocketMethod } from "express-ws";

const API = express;
const Application: express.Application & WithWebsocketMethod = ws(API()).app;
const Router = express.Router;

import compression from "compression";

const Socket = ws;

const Compression = compression;

import axios from "axios";

const Axios = axios;

import octokit from "octokit";

const Octokit = octokit;

import mongodb from "mongodb";

const Database = mongodb;

import mongoose from "mongoose";

/*** Mongo-DB ORM Tool
 * @type {import("mongoose")}
 * */

const ORM = mongoose;

const cryptography: any = {};
import bcrypt from "bcryptjs";

/*** Cryptography Module
 * @type {import("bcryptjs")}
 * */
cryptography.BCrypt = bcrypt;

/*** Cryptography Hashing Function
 * @type {import("bcryptjs").hash}
 * */
cryptography.Hash = bcrypt.hash;

/*** Cryptography Salt Generator
 * @type {import("bcryptjs").genSalt}
 * */

cryptography.generateSalt = bcrypt.genSalt;

/*** Cryptography Salt Getter
 * @type {import("bcryptjs").getSalt}
 * */

cryptography.getSalt = bcrypt.getSalt;

/*** Cryptography Comparator
 * @type {import("bcryptjs").compare}
 * */

cryptography.compare = bcrypt.compare;

/*** Cryptography Rounds Getter
 * @type {import("bcryptjs").getRounds}
 * */

cryptography.getRounds = bcrypt.getRounds;

/*** Cryptography Decoder (base-64)
 * @type {import("bcryptjs").decodeBase64}
 * */

cryptography.decode = bcrypt.decodeBase64;

/*** Cryptography Encoder (base-64)
 * @type {import("bcryptjs").encodeBase64}
 * */

cryptography.encode = bcrypt.encodeBase64;

/*** Cryptography Container Object
 *
 * @extends {import("bcryptjs")}
 * @method encode {import("bcryptjs").encodeBase64}
 */
const Cryptography = cryptography;

import cors from "cors";

const CORS = cors;

import body from "body-parser";

const Parser = body;

export {
    API,
    Application,
    Router,
    Compression,
    Socket,
    Axios,
    Octokit,
    Database,
    CORS,
    ORM,
    Cryptography,
    Parser
};

export default {
    API,
    Application,
    Router,
    Compression,
    Axios,
    Octokit,
    Database,
    CORS,
    Socket,
    ORM,
    Cryptography,
    Parser
};