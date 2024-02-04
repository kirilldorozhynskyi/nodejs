/*
 * File: /netlify/functions/api.ts
 * Project: nodejs
 * Version: <<projectversion>>
 * Created Date: Sunday, February 4th 2024, 17:24:04
 * Author: Kirill Dorozhynskyi - kirilldy@justdev.org
 * -----
 * Last Modified: Sunday, February 4th 2024 18:10:06
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

import express, { Router } from "express";
import serverless from "serverless-http";

const puppeteer = require("puppeteer");
const path = require("path");
const api = express();

const router = Router();
router.get("/hello", async (req, res) => {
  var url = "https://florian.justdev.link";

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  await page.setViewport({ width: 1239, height: 1753 });

  const pdf = await page.pdf({
    path: "output.pdf",
    format: "A4",
    printBackground: true,
    displayHeaderFooter: false,

    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
  });

  await browser.close();
  //   res.set({
  //     "Content-Type": "application/pdf",
  //     "Content-Length": pdf.length,
  //   });
  //   const filePath = path.join(__dirname, "output.pdf");
  //   res.sendFile(filePath);
});

api.use("/api/", router);

export const handler = serverless(api);
