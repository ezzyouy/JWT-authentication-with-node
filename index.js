const express = require("express");
const router = require("./routes/auth");
const post = require("./routes/post");

const app=express()
app.use(express.json())
app.use("/auth", router);

app.use("/post", post);

app.listen(5000,()=>{
    console.log("now you runing in the port 5000");
})