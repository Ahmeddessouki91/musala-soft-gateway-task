const winston = require("winston");
require("express-async-errors");

module.exports = winston.createLogger({
                    level: process.env.LOG_LEVEL || "info",
                    format: winston.format.json(),
                    transports: [new winston.transports.Console()],
                    exceptionHandlers: [
                      new winston.transports.File({ filename: "exception.log" }),
                    ],
                    rejectionHandlers: [
                      new winston.transports.File({ filename: "rejections.log" }),
                    ],
                  });

