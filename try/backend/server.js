const db = require("./db.js");
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("student api is running");
});

app.get("/api/students", (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to retrieve students",
      });
    }

    res.json(result);
  });
});

app.post("/api/students", (req, res) => {
  const { name, course, age } = req.body;

  if (!name || !course || age === undefined || age === null || age === "") {
    return res.status(400).json({
      message: "Name, course, and age are required",
    });
  }

  const sql = "INSERT INTO students (name, course, age) VALUES (?, ?, ?)";
  db.query(sql, [name, course, age], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to add student",
      });
    }

    res.status(201).json({
      id: result.insertId,
      name,
      course,
      age,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
