import React from "react";
import { Typography, Box, Button, TextField } from "@mui/material";
import { Kayttaja } from "../types";
import { fetchAsetukset } from "../types";
import { useState } from "react";
import { useRef } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

export interface Props {
  setKayttaja: Dispatch<SetStateAction<Kayttaja | null>>;
}

const Login: React.FC<Props> = (props: Props): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  const lomakeRef = useRef<HTMLFormElement>();

  const [tunnus, setTunnus] = useState("");
  const [salasana, setSalasana] = useState("");

  const kirjaudu = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const fetchParams: fetchAsetukset = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tunnus: tunnus,
          salasana: salasana,
        }),
      };
      const yhteys = await fetch(
        "http://localhost:3106/api/login",
        fetchParams
      );
      if (yhteys.status === 200) {
        let { kayttaja } = await yhteys.json();

        props.setKayttaja(kayttaja);

        localStorage.setItem("kayttaja", JSON.stringify(kayttaja));

        navigate("/");
      } else {
        let virheteksti: string = "";

        switch (yhteys.status) {
          case 401:
            virheteksti = `Käyttäjätunnus tai salasana virheellinen (virhekoodi ${yhteys.status})`;
            alert("Käyttäjätunnus tai salasana virheellinen.");
            break;
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
      console.log("Virhe palvelimella: " + e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={kirjaudu}
      ref={lomakeRef}
      sx={{
        width: "30%",
        margin: "auto",
      }}
    >
      <Typography variant="h4" sx={{ marginTop: "30px", marginBottom: "20px" }}>
        Kirjautuminen
      </Typography>
      <TextField
        name="tunnus"
        label="Käyttäjätunnus"
        variant="outlined"
        sx={{
          width: "100%",
          marginTop: "10px",
        }}
        onChange={(e) => {
          e.preventDefault();
          setTunnus(e.target.value);
        }}
      />
      <br />
      <TextField
        name="salaus"
        label="Salasana"
        variant="outlined"
        sx={{
          width: "100%",
          marginTop: "10px",
        }}
        onChange={(e) => {
          e.preventDefault();
          setSalasana(e.target.value);
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
        Kirjaudu
      </Button>
      <Button
        variant="contained"
        color="error"
        fullWidth
        sx={{
          marginTop: "10px",
        }}
        onClick={() => {
          navigate("/uutiset");
        }}
      >
        Peruuta
      </Button>
    </Box>
  );
};

export default Login;
