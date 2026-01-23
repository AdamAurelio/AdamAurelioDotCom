import logo from "./logo.svg";
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
    },
  );
});

// Start the server
app.listen(process.env.PORT || 3000, function () {
  console.log("AdamAurelio.com web server is on");
});

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <img
            src={logo}
            className="h-16 w-16 mx-auto animate-spin"
            alt="logo"
          />
          <p className="mt-4 text-center text-gray-700">
            Edit{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">src/App.js</code>{" "}
            and save to reload.
          </p>
          <a
            className="block text-center mt-4 text-blue-600 hover:text-blue-800 underline transition-colors"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;
