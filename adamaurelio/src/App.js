import logo from "./logo.svg";
import "./App.css";
import express from "express";
import { Pool } from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Connect to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get("/", function (req, res) {
  res.send("Test: Landing Page");
});

app.post("/sample", function (req, res) {
  const { name } = req.body;
  pool.query(
    "INSERT INTO samples (name) VALUES ($1) RETURNING *",
    [name],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(result.rows[0]);
      }
    }
  );
});

// Start the server
app.listen(process.env.PORT || 3000, function () {
  console.log("AdamAurelio.com web server is on");
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
