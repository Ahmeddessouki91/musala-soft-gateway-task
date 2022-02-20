const express = require("express");
const gateways = require("../routes/gateways");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/gateways", gateways);
  app.use(error);
};
