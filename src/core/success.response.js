"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonPhrase = {
  OK: "Success",
  CREATED: "Created success",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonPhrase.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonPhrase.CREATED,
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
  }
}

module.exports = {OK, CREATED, SuccessResponse}