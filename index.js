const express = require("express");
require("colors");
require("dotenv").config();
const app = express();
const { Pool } = require("pg");

const PORT = process.env.PORT || 8080;

app.use(express.json());

const pool = new Pool();

app.get("/", (req, res) => {
  res.send("Welcome to the fighters API");
});

// app.get("/time", (req, res) => {
//   pool.query("SELECT NOW()", (err, res) => {
//     if (err) return response.status(500);
//     res.send(response.rows);
//   });
// });

app.get("/time", (req, res) => {
  pool
    .query("SELECT NOW()")
    .then((data) => res.send(data.rows))
    .catch((e) => {
      console.log(e.message);
      res.sendStatus(500);
    });
});

app.get("/api/fighters", (req, res) => {
  pool
    .query("SELECT * FROM fighters")
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.get("/api/fighters/:id", (req, res) => {
  //   const id = req.params.id
  const { id } = req.params;
  pool
    .query("SELECT * FROM fighters WHERE id=$1", [id])
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.post("/api/fighters", (req, res) => {
  const { first_name, last_name, country_id, style } = req.body;

  pool
    .query(
      "INSERT INTO fighters (first_name, last_name, country_id, style) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, country_id, style]
    )
    .then((data) => res.json(data.rows[0]))
    .catch((e) => res.sendStatus(500));
});

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`.america);
});
