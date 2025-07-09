import AppError from "./AppError.js";

const appAssert = (condition, httpStatusCode, message, appErrorCode) => {
  if (!condition) {
    throw new AppError(httpStatusCode, message, appErrorCode);
  }
};

export default appAssert;
