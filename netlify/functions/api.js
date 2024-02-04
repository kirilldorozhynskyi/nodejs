/*
 * File: /netlify/functions/api.js
 * Project: netlify-puppeteer-demo
 * Version: 1.0.0
 * Created Date: Sunday, February 4th 2024, 19:05:54
 * Author: Kirill Dorozhynskyi - kirilldy@justdev.org
 * -----
 * Last Modified: Sunday, February 4th 2024 21:00:06
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import express from "express";
import serverless from "serverless-http";
import SftpClient from "ssh2-sftp-client";
// import path from "path"; // Import the 'path' module

const app = express();

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

app.get("/api/hello", async (req, res) => {
  var url = "https://crm.justdev.link";

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

  // const pdf = await page.pdf({
  //   format: "A4",
  //   printBackground: true,
  //   displayHeaderFooter: false,
  //   margin: {
  //     top: "0",
  //     right: "0",
  //     bottom: "0",
  //     left: "0",
  //   },
  // });

  // await browser.close();

  // // res.set({
  // //   "Content-Type": "application/pdf",
  // //   "Content-Length": pdf.length,
  // // });

  // res.contentType("application/pdf");
  // res.send(pdf);

  // const pdfURL = path.join(__dirname, "/tmp/", "kvartet_.pdf");

  const pdf = await page.pdf({
    // path: pdfURL, // Save to /tmp directory
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

  // Use SFTP to upload the PDF
  const sftp = new SftpClient();

  const sftpConfig = {
    host: "justdev.link",
    port: 22,
    username: "netify.justdev.link",
    password: "Fi93~$7u=f",
  };

  try {
    await sftp.connect(sftpConfig);
    await sftp.put(Buffer.from(pdf), "output.pdf"); // Upload the PDF
    res.status(200).send("PDF uploaded successfully via SFTP");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading PDF via SFTP" + err);
  } finally {
    await sftp.end();
  }

  // res.set({
  //   "Content-Type": "application/pdf",
  //   "Content-Length": pdf.length,
  // });

  // // const filePath = path.join(__dirname, "tmp/output.pdf"); // Update the file path
  // res.sendFile(pdfURL);
});

export const handler = serverless(app);
