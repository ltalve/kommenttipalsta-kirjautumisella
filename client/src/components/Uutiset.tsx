import React from "react";
import { useState, useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Uutinen, ApiData, Kayttaja } from "../types";
import Kommentit from "./Kommentit";
import { Dispatch, SetStateAction } from "react";

import {
  Typography,
  Container,
  ListItem,
  List,
  Button,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";

interface Props {
  kayttaja: Kayttaja | null;
  setKayttaja: Dispatch<SetStateAction<Kayttaja | null>>;
}

const Uutiset: React.FC<Props> = (props: Props): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  const [apiData, setApiData] = useState<ApiData>({
    uutiset: [],
    virhe: "",
    haettu: false,
  });

  const apiKutsu = async (): Promise<void> => {
    try {
      const yhteys = await fetch("http://localhost:3106/api/uutiset");
      if (yhteys.status === 200) {
        setApiData({
          ...apiData,
          uutiset: await yhteys.json(),
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

  return (
    <Container sx={{ width: "50%", paddingTop: "30px" }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", marginLeft: "15px" }}
      >
        Tuoreimmat uutiset
      </Typography>
      <List>
        {apiData.uutiset?.map((uutinen: Uutinen) => (
          <ListItem
            key={uutinen.id}
            alignItems="flex-start"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h5" sx={{ marginBottom: "20px" }}>
              {uutinen.otsikko}
            </Typography>
            <Typography>{uutinen.sisalto}</Typography>

            {props.kayttaja && (
              <Kommentit
                uutinenID={apiData.uutiset ? apiData.uutiset[0].id : 1}
                kayttaja={props.kayttaja}
              />
            )}
          </ListItem>
        ))}
      </List>
      {!props.kayttaja ? (
        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: "20px" }}
          onClick={() => navigate("/login")}
        >
          Kirjaudu sisään kommendoidaksesi uutisia
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="error"
          sx={{ marginTop: "30px" }}
          onClick={() => {
            props.setKayttaja(null);
            window.localStorage.setItem("kayttaja", "");
            navigate("/");
            alert("Olet kirjautunut ulos.");
          }}
        >
          Kirjaudu ulos
        </Button>
      )}
    </Container>
  );
};

export default Uutiset;
