module.exports = {
  successResponse: (res, code, message, data) => {
    res.status(code).json({
      status: "SUCCESS",
      code: code,
      message: message,
      data: data,
    });
  },
  errorMsgResponse: (res, code, message) => {
    res.status(code).json({
      status: "ERROR",
      code: code,
      message: message,
    });
  },
  
};
