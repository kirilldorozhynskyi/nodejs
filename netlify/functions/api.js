/*
 * File: /netlify/functions/api.js
 * Project: netlify-puppeteer-demo
 * Version: 1.0.0
 * Created Date: Sunday, February 4th 2024, 19:05:54
 * Author: Kirill Dorozhynskyi - kirilldy@justdev.org
 * -----
 * Last Modified: Sunday, February 4th 2024 20:03:32
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import express from "express";
import serverless from "serverless-http";
import path from "path";

const app = express();

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

app.get("/api/hello", async (req, res) => {
  var url = "https://florian.justdev.link";

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath(
        "/var/task/node_modules/@sparticuz/chromium/bin"
      )),
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  await page.setViewport({ width: 1239, height: 1753 });

  const pdf = await page.pdf({
    path: "/tmp/output.pdf", // Save to /tmp directory
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

  res.set({
    "Content-Type": "application/pdf",
    "Content-Length": pdf.length,
  });

  const filePath = path.join(__dirname, "/tmp/output.pdf");
  res.sendFile(filePath);

  // No need to send "Hello World!" after sending the file
  // res.send("Hello World!");
});

export const handler = serverless(app);