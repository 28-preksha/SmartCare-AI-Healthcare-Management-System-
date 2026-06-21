const errorHandler = (err, req, res, next) => {
  // Agar status code pehle se set nahi hai toh 500 (Internal Server Error) do
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    // Development me debugging ke liye stack trace dikhayega, production me nahi
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };