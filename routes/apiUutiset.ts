import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma: PrismaClient = new PrismaClient();

const apiUutisetRouter: express.Router = express.Router();

// Router ottaa bodyt vastaan ja muuttaa ne json:ksi
apiUutisetRouter.use(express.json());

apiUutisetRouter.get(
  "/",
  async (_req: express.Request, res: express.Response) => {
    try {
      res.json(await prisma.uutinen.findMany());
    } catch (e: any) {
      res.status(500).json({ virhe: "Tapahtui virhe." });
    }
  }
);

apiUutisetRouter.get(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      res.json(
        await prisma.uutinen.findUnique({
          where: { id: Number(req.params.id) },
        })
      );
    } catch (e: any) {
      res.status(500).json({ virhe: "Tapahtui virhe." });
    }
  }
);

apiUutisetRouter.get(
  "/:id/kommentit",
  async (req: express.Request, res: express.Response) => {
    try {
      const uutisenKommentit = await prisma.kommentti.findMany({
        where: { uutinenID: Number(req.params.id) },
        include: {
          kayttaja: true,
        },
      });
      res.json(uutisenKommentit);
    } catch (e: any) {
      res.status(500).json({ virhe: "Tapahtui virhe." });
    }
  }
);

apiUutisetRouter.post(
  "/:id/kommentit",
  async (req: express.Request, res: express.Response) => {
    try {
      const uutisenKommentti = await prisma.kommentti.create({
        data: {
          uutinenID: req.body.uutinenID,
          kayttajaID: req.body.kayttaja.id,
          teksti: req.body.teksti,
        },
      });
      res.json(uutisenKommentti);
    } catch (e: any) {
      res.status(500).json({ virhe: "Tapahtui virhe." });
    }
  }
);

export default apiUutisetRouter;
