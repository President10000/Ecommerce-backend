import express, { Request, Response, NextFunction, Errback } from "express";
// not Found

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler

const errorHandler = (
  err: { message: any; stack: any },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.statusCode = res.statusCode === 200 ? 404 : res.statusCode;
  res.status(res.statusCode);
  res.json({
    status: res.statusCode,
    message: err?.message,
    stack: err?.stack,
  });
};

export { errorHandler, notFound };
