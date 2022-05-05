let hash = require("crypto")
  .createHash("SHA256")
  .update("kissakala")
  .digest("hex");
console.log(hash);
