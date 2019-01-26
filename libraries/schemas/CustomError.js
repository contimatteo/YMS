module.exports = class CustomError extends Error{
  constructor(statusCode, reason, message) {
    super();
    this.statusCode = statusCode;
    this.reasonPhrase = reason;
    this.message = message;
  }
};