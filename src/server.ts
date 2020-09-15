"use strict";

const express = require("express");
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const port = 8081;
server.listen(port, () =>
  console.log(`API started. Listening on port ${port}`)
);

module.exports = server;
