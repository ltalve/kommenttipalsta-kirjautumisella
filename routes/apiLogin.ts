import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const prisma: PrismaClient = new PrismaClient();

const apiLoginRouter: express.Router = express.Router();

// Router ottaa bodyt vastaan ja muuttaa ne json:ksi
apiLoginRouter.use(express.json());

type KayttajaTiedotInput = {
  tunnus: string;
  salasana: string;
};

type KayttajaTiedotOutput = {
  tunnus: string;
  token: string;
  id: number;
};

apiLoginRouter.post(
  "/",
  async (req: express.Request, res: express.Response) => {
    try {
      const kayttajaInput: KayttajaTiedotInput = req.body;

      const kayttajaKannasta = await prisma.kayttaja.findUnique({
        where: { tunnus: kayttajaInput.tunnus },
        select: { tunnus: true, salaus: true, id: true },
      });

      const salattuSalasana = crypto
        .createHash("SHA256")
        .update(kayttajaInput.salasana)
        .digest("hex");

      let result: KayttajaTiedotOutput;

      // vertaa tietokannasta saatua salasanaa rajapinnasta tulleeseen
      if (kayttajaKannasta && kayttajaKannasta.salaus == salattuSalasana) {
        let token = jwt.sign(
          { kayttaja: kayttajaInput.tunnus, salasana: kayttajaInput.salasana },
          "kissa-asiantuntijatBBC:lle:IPCC:nilmastoraporttiatulkittu"
        );
        result = {
          ...kayttajaKannasta,
          token: token,
        };
        res.json({ kayttaja: result });
      } else {
        res.status(401).json({ virhe: "Käyttäjätunnus tai salasana väärin." });
      }
    } catch (e: any) {
      res.json({ virhe: "Tapahtui virhe." });
    }
  }
);

export default apiLoginRouter;
