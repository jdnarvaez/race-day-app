(function () {
  'use strict';
  const fs = require('fs');
  const path = require('path');
  const express = require('express');
  const router = require('express').Router();

  function serveFile(file, response) {
    try {
      if (fs.existsSync(file)) {
        const stream = fs.createReadStream(file);
        response.writeHead(200, 'OK');
        stream.pipe(response);
      } else {
        response.writeHead(404, 'Not Found');
        response.end();
      }
    } catch (error) {
      console.log(error);
      response.writeHead(404, 'Not Found');
      response.end();
    }
  }

  router.all(`/docs/data/races.json`, (request, response) => {
    const file = path.join(__dirname, '..', 'docs', `data`, `races.json`);
    response.setHeader('Content-Type', 'application/javascript');
    serveFile(file, response);
  });

  router.all(`/docs/data/tracks.json`, (request, response) => {
    const file = path.join(__dirname, '..', 'docs', `data`, `tracks.json`);
    response.setHeader('Content-Type', 'application/javascript');
    serveFile(file, response);
  });

  const server = express();

  server.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
  });

  server.use(express.json());
  server.use(router);

  module.exports = {
    start : function(port) {
      console.log(`Starting local services on ${port}...`);
      return server.listen(port);
    }
  }
}());
