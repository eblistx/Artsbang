var util = require('util');

module.exports = ConflictError;

function ConflictError(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = 409;
}

util.inherits(ConflictError, Error);