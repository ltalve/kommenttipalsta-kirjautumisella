import express from "express";
import path from "path";
import apiUutisetRouter from "./routes/apiUutiset";
import apiLoginRouter from "./routes/apiLogin";
import apiAuthRouter from "./routes/apiAuth";
import cors from "cors";
import { JsonWebTokenError } from "jsonwebtoken";

const app: express.Application = express();

const portti: number = Number(process.env.PORT) || 3106;

app.use(express.static(path.resolve(__dirname, "public")));

app.use(cors({ origin: "http://localhost:3000" }));

const checkToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let token: string = req.headers.authorization!.split(" ")[1];
    next();
  } catch (e: any) {
    res.status(401).json({});
  }
};

app.use("/api/uutiset", apiUutisetRouter);
app.use("/api/login", apiLoginRouter);
app.use("/api/auth", apiAuthRouter);

app.listen(portti, () => {
  console.log(`Palvelin käynnissä portissa: ${portti}`);
});
