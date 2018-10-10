// function ApiError(message) {
//   Error.captureStackTrace(this);
//   this.message = "error: " + message + "";
//   this.name = "ApiError";
// }
// //APIError.prototype = Object.create(Error.prototype);
// //module.export = APIError;
// module.export = ApiError;

// function ApiError(message) {
//   this.message = message;
//   this.name = "ApiError";
//   Error.captureStackTrace(this, ApiError);
// }
// ApiError.prototype = Object.create(Error.prototype);
// ApiError.prototype.constructor = ApiError;


module.exports = class CustomError extends Error{
  constructor(statusCode, reason, message) {
    super();
    this.statusCode = statusCode;
    this.reasonPhrase = reason;
    this.message = message;
  }
};