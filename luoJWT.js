let token = require("jsonwebtoken").sign(
  { kayttaja: "besserwisser", salasana: "kissakala" },
  "kissa-asiantuntijatBBC:lle:IPCC:nilmastoraporttiatulkittu"
);
