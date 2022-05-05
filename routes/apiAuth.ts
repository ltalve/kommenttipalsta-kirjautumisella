import express from "express";

const apiAuthRouter: express.Router = express.Router();

apiAuthRouter.use(express.json());

apiAuthRouter.post(
  "/login",
  async (req: express.Request, res: express.Response): Promise<void> => {
    res.json("testi");
  }
);

export default apiAuthRouter;
