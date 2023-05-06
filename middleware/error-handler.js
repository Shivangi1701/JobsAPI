// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };
  /*
  if (err instanceof CustomAPIError) {
    // it checks if error is on of the extended customAPIError - (BadRequest, NotFound, Unauthenticated etc..)
    return res.status(err.statusCode).json({ msg: err.message });
  }
  */
  // validation error - not provided email pswd etc.
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors) // assigns comma-seperated string of error messages to CustomError object "msg" property
      .map((item) => item.message) // map overs the message property of each error object & returns it as a array of strings
      .join(","); // joins the array strings into a single string
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    // here we are handling duplicate email error
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  // cast error - id problem
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
