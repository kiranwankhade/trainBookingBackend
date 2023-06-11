const express = require("express");
const app = express();

app.use(express.json());
var cors = require('cors')
app.use(cors())

require('dotenv').config();

const {connection} = require("./db");
const { seatRouters } = require("./Routes/Seat.Routes");




// app.get("/",(req,res)=>{
//     console.log("HOME");
//     res.send("WELCOME TO Unstop HOME PAGE")
// })

app.use("/",seatRouters)

app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("Connected")

    }catch(err){
        console.log("NOT Connected");
        console.log(err);
    }
    console.log(`CONNECT SERVER TO ${process.env.port} PORT`)
})