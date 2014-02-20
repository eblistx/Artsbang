var util = require('util');

module.exports = NotFoundError;

function NotFoundError(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = 404;
}

util.inherits(NotFoundError, Error);