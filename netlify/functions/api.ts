/*
 * File: /netlify/functions/api.ts
 * Project: nodejs
 * Version: <<projectversion>>
 * Created Date: Sunday, February 4th 2024, 17:24:04
 * Author: Kirill Dorozhynskyi - kirilldy@justdev.org
 * -----
 * Last Modified: Sunday, February 4th 2024 18:32:19
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

import express, { Router } from "express";
import serverless from "serverless-http";
const path = require("path");
const app = express();
const puppeteer = require("puppeteer");

app.use(express.static(path.join(__dirname, "..", "dist")));

app.get("/api/hello", async (req, res) => {
  var url = "https://florian.justdev.link";

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN || "/usr/bin/chromium-browser",
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  await page.setViewport({ width: 1239, height: 1753 });

  res.send("Hello World!");
});

export const handler = serverless(app);
