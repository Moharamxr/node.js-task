const fs = require("fs/promises");
const path = require("path");

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const bodyParser = require("body-parser");
const calcAge = require("./modules/calcAge");
const { config } = require("./config");

const app = express();

app.use(
    express.static(path.join(__dirname, "/client"))
)


// Allow json parsing and cors middlewares

app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.post("/users", async (req, res) => {
  const { name, age } = req.body;

  const id = uuidv4();
  const birthYear = calcAge(age);
console.log(birthYear);
  // 1. Create a new user from request data
  const user = {
    id,
    name,
    birthYear,
  };

  // 2. Read the users database-like file
  const usersJson = await fs.readFile("./DB/users.json", "utf-8");
  const users = JSON.parse(usersJson);
  users.push(user);

  // 3. Add the new user to permanent users
  try {
    console.log(users.name,users.birthYear)
    // await fs.writeFile('users.json',JSON.stringify(user),(err)=>{
    //   console.log(err);
    // });
    await fs.writeFile(
      path.resolve(__dirname, "./DB/users.json"),
      JSON.stringify(users),
    );
  } catch (error) {
    console.log("error ", error);
  }
  res.status(201).json(users);
});

// TODO: create /users GET endpoint to list all users
app.get("/users", async (req, res) => {
  fs.readFile("./DB/users.json", "utf-8")
    .then((usersJson) => {
      const users = JSON.parse(usersJson);
      res.json(users);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Error fetching users" });
    });
});

// TODO: create /users/:id GET endpoint to list user by id
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  fs.readFile("./DB/users.json", "utf-8")
    .then((usersJson) => {
      const users = JSON.parse(usersJson);
      const user = users.find((user) => user.id === userId);

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Error fetching user" });
    });
});

// Default PORT to listen
app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT} `);
});
