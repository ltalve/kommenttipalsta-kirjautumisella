import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Uutiset from "./components/Uutiset";
import { useState, useEffect } from "react";
import { Kayttaja } from "./types";

const App: React.FC = (): React.ReactElement => {
  const [kayttaja, setKayttaja] = useState<Kayttaja | null>(null);

  useEffect(() => {
    const k = window.localStorage.getItem("kayttaja");
    if (k) {
      setKayttaja(JSON.parse(k) as Kayttaja);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<Uutiset kayttaja={kayttaja} setKayttaja={setKayttaja} />}
      />
      <Route path="/login" element={<Login setKayttaja={setKayttaja} />} />
    </Routes>
  );
};

export default App;
