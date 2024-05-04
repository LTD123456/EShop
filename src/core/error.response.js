"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const ReasonPhrase = {
  FORBIDDEN: "Bad reuqest error",
  CONFLICT: "Conflict error",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrase.CONFLICT, status = StatusCode.CONFLICT) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonPhrase.FORBIDDEN, status = StatusCode.FORBIDDEN) {
    super(message, status);
  }
}

module.exports = {
  BadRequestError,
  ConflictRequestError,
};
