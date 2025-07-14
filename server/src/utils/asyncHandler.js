// utils/asyncHandler.js
const asyncHandler = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (err) {
    console.log("error ", err);
    next(err);
  }
};

export default asyncHandler;
