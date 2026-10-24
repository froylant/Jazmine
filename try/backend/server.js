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

  const findNextIdSql =
    "SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM students";
  db.query(findNextIdSql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to generate student id",
      });
    }

    const nextId = rows[0].nextId;
    const sql =
      "INSERT INTO students (id, name, course, age) VALUES (?, ?, ?, ?)";
    db.query(sql, [nextId, name, course, age], (insertErr, result) => {
      if (insertErr) {
        console.error(insertErr);
        return res.status(500).json({
          message: "Failed to add student",
        });
      }

      res.status(201).json({
        id: nextId,
        name,
        course,
        age,
      });
    });
  });
});

app.put("/api/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, course, age } = req.body;

  if (!name || !course || age === undefined || age === null || age === "") {
    return res.status(400).json({
      message: "Name, course, and age are required",
    });
  }

  const sql = "UPDATE students SET name = ?, course = ?, age = ? WHERE id = ?";
  db.query(sql, [name, course, age, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to update student",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      id: Number(id),
      name,
      course,
      age,
    });
  });
});

app.delete("/api/students/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM students WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to delete student",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({ message: "Student deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
