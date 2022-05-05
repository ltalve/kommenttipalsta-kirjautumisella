import React from "react";
import { useState, useEffect } from "react";
import { fetchAsetukset } from "../types";
import { Kommentti } from "../types";
import { ApiData } from "../types";
import { Kayttaja } from "../types";
import format from "date-fns/format";

import {
  Typography,
  Container,
  Box,
  ListItem,
  List,
  TextField,
  Button,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";

interface Props {
  uutinenID: number;
  kayttaja: Kayttaja;
}

const Kommentit: React.FC<Props> = (props: Props): React.ReactElement => {
  const [kommenttiteksti, setKommenttiteksti] = useState<string>("");

  const [apiData, setApiData] = useState<ApiData>({
    kommentit: [],
    virhe: "",
    haettu: false,
  });

  const apiKutsu = async (): Promise<void> => {
    try {
      const yhteys = await fetch(
        `http://localhost:3106/api/uutiset/${props.uutinenID}/kommentit`
      );
      if (yhteys.status === 200) {
        setApiData({
          ...apiData,
          kommentit: await yhteys.json(),
          haettu: true,
        });
      } else {
        let virheteksti: string = "";

        switch (yhteys.status) {
          case 404:
            virheteksti = `Tietoja ei löydy (virhekoodi ${yhteys.status})`;
            break;
          default:
            virheteksti = `Palvelimella tapahtui odottamaton virhe. (virhekoodi ${yhteys.status})`;
            break;
        }

        setApiData({
          ...apiData,
          virhe: virheteksti,
          haettu: true,
        });
      }
    } catch (e: any) {
      setApiData({
        ...apiData,
        virhe: "Palvelimeen ei saada yhteyttä.",
        haettu: true,
      });
    }
  };

  useEffect(() => {
    apiKutsu();
  }, []);

  if (!apiData.haettu) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (Boolean(apiData.virhe)) {
    return <Alert severity="error">{apiData.virhe}</Alert>;
  }

  const lisaaKommentti = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const fetchParams: fetchAsetukset = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kayttaja: props.kayttaja,
          teksti: kommenttiteksti,
          uutinenID: props.uutinenID,
        }),
      };
      console.log(JSON.stringify(fetchParams));
      const yhteys = await fetch(
        `http://localhost:3106/api/uutiset/${props.uutinenID}/kommentit`,
        fetchParams
      );
      if (yhteys.status === 200) {
        apiKutsu();
        setKommenttiteksti("");
      } else {
        let virheteksti: string = "";

        switch (yhteys.status) {
          case 404:
            virheteksti = `Tietoja ei löydy (virhekoodi ${yhteys.status})`;
            break;
          default:
            virheteksti = `Palvelimella tapahtui odottamaton virhe. (virhekoodi ${yhteys.status})`;
            break;
        }

        console.log(virheteksti);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const formatoiAika = (dateString: string): string => {
    try {
      return format(new Date(dateString), "d.M.y HH:mm");
    } catch {
      return "";
    }
  };

  return (
    <Container sx={{ paddingTop: "30px" }}>
      <Typography
        variant="h5"
        sx={{ marginLeft: "15px", marginBottom: "10px" }}
      >
        Kommentit
      </Typography>
      <List>
        {apiData.kommentit?.map((kommentti: Kommentti) => (
          <ListItem
            key={kommentti.id}
            alignItems="flex-start"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Typography sx={{ marginBottom: "10px" }}>
              {kommentti.kayttaja.tunnus}{" "}
              {formatoiAika(kommentti.aika ? kommentti.aika : "")}
              <br />
            </Typography>
            <Typography sx={{ marginBottom: "15px" }}>
              {kommentti.teksti}
            </Typography>
          </ListItem>
        ))}
      </List>

      <Box component="form" onSubmit={lisaaKommentti}>
        <Typography
          variant="h6"
          sx={{ marginTop: "10px", marginBottom: "20px" }}
        >
          Uusi kommentti
        </Typography>
        <TextField
          multiline
          fullWidth
          name="kommentti"
          label="Lisää kommentti"
          variant="outlined"
          sx={{
            marginTop: "10px",
          }}
          onChange={(e) => {
            e.preventDefault();
            setKommenttiteksti(e.target.value);
          }}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            marginTop: "30px",
          }}
        >
          Lähetä kommentti
        </Button>
      </Box>
    </Container>
  );
};

export default Kommentit;
