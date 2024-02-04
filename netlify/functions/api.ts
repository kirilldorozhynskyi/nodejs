/*
 * File: /netlify/functions/api.ts
 * Project: nodejs
 * Version: <<projectversion>>
 * Created Date: Sunday, February 4th 2024, 17:24:04
 * Author: Kirill Dorozhynskyi - kirilldy@justdev.org
 * -----
 * Last Modified: Sunday, February 4th 2024 18:15:02
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

import express, { Router } from "express";
import serverless from "serverless-http";
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "..", "dist")));

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

app.use("/api/", router);

export const handler = serverless(app);
