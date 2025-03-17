//start backend code
const express = require("express");
const app = express();
const cors = require("cors");

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
