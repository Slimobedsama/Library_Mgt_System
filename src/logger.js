import { createLogger, format, transports } from "winston";
import winstonTimestampColorize from "winston-timestamp-colorize";
const { combine, timestamp, json, colorize } = format;
const timestampColorize = winstonTimestampColorize;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize({all: true}),
  timestampColorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp}: ${level}: ${message}`;
  })
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(timestamp({format: 'YY-MM-DD HH:MM:SS'}), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    // new transports.File({ filename: "app.log" }),
  ],
});

export default logger;