/*
 * File: /functions/api.js
 * Project: nodejs
 * Version: <<projectversion>>
 * Created Date: Sunday, February 4th 2024, 17:24:04
 * Author: Kirill Dorozhynskyi - kirilldy@justdev.org
 * -----
 * Last Modified: Sunday, February 4th 2024 17:24:13
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

const express = require("express");
const serverless = require("serverless-http");

const app = express();

app.get("/api/hello", (req, res) => {
  res.json({ message: "Привет, мир!" });
});

module.exports.handler = serverless(app);
