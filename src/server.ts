"use strict";

import express from "express";
import connect from './mongoDBconnection';

const server = express();

const db = 'mongodb://localhost:27017/';
connect(db);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const port = 8081;
server.listen(port, () =>
  console.log(`API started. Listening on port ${port}`)
);

module.exports = server;
