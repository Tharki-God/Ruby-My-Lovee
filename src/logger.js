const { createLogger, format, transports } = require("winston");
const path = require("path");
const logFormat = format.printf((info) => {
    const { timestamp, level, label, message, ...rest } = info;
    let log = `${timestamp} - ${level} [${label}]: ${message}`;
    if (!( Object.keys(rest).length === 0 && rest.constructor === Object )) {
        log = `${log}\n${JSON.stringify(rest, null, 2)}`.replace(/\\n/g, "\n");
    }
    return log;
});

module.exports = createLogger({
    level: "silly",
    format: format.combine(
        format.errors({ stack: true }),
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.timestamp({ format: "DD-MMM-YYYY | hh:mm:ss A" })
    ),
    transports: [ 
        new transports.Console({ 
            format: format.combine(
                format.colorize(),
                logFormat
            )
        }),
    ]
});