export interface Uutinen {
  id: number;
  otsikko: string;
  sisalto: string;
}
export interface Kommentti {
  id: number;
  kayttaja: Kayttaja;
  teksti: string;
  aika?: string;
}

export interface Kayttaja {
  id: number;
  tunnus: string;
  salasana: string;
  token?: string;
}

export interface ApiData {
  uutiset?: Uutinen[];
  kommentit?: Kommentti[];
  virhe: string;
  haettu: boolean;
}

export interface fetchAsetukset {
  method: string;
  headers?: any;
  body?: string;
}
