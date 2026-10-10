const express = require("express");
const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("student api is running");
});

app.get("/api/students", (req, res) => {
  /*res.json([
    {
      id: 1,
      name: "Juan",
      course: "BSIT",
    },
  ]);*/
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
