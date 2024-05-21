"use strict";
const {StatusCode, ReasonPhrases} = require("../utils/httpStatusCode");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, status = StatusCode.CONFLICT) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCode.FORBIDDEN) {
    super(message, status);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCode.UNAUTHORIZED) {
    super(message, status);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NotFoundError, status = StatusCode.NOT_FOUND) {
    super(message, status);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrases. FORBIDDEN, status = StatusCode.FORBIDDEN) {
    super(message, status);
  }
}

module.exports = {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  NotFoundError, 
  ForbiddenError
};
