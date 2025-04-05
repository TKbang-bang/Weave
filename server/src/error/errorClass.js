class ServerError extends Error {
  constructor(message, about, status) {
    super(message);
    this.about = about;
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ServerError;
