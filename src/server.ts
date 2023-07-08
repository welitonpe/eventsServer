import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";
import cors from "cors";

import "express-async-errors";

const PORT = process.env.SERVER_PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof Error) {
      response.status(404).json({
        error: error.message,
      });
    }
    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);
app.listen(PORT, () => console.log(`Server is Running on port ${PORT}`));
