var util = require('util');

module.exports = BadRequestError;

function BadRequestError(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = 400;
}

util.inherits(BadRequestError, Error);