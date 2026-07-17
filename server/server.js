import express from "express";
const app = express() //creates my server

app.use(express.json()); // Allows Express to read JSON sent by React

//app.listen(3000) //start server + wait for req

app.get("/", (req, res) => {
    console.log("Someone visited the homepage!");
    res.send("Hello!");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});