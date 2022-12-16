const express = require("express");
const cron = require("node-cron");
const cors = require('cors');
const helmet = require("helmet");
const morgan = require("morgan"); // logger
const rateLimit = require("express-rate-limit"); // limit requests

// my own libraries
const DataLoader = require("./DataLoader");
const FileSaver = require("./FileSaver")


// files
const importedData = require("./import.json");
const products = require("./items.json");

// environment
require("dotenv").config();


// set Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// registering middleware
const app = express();
const port = process.env.PORT;
const defaultLimit = process.env.LIMIT||20;

app.use(express.json());
app.use(helmet());
app.use(morgan());
app.use(limiter);
app.use(cors());


const type = ["guitar", "piano", "electric"];

app.get("/", (req, res) => {
  const data = [];
  for (let index = 0; index < 20; index++) {
    let num = Math.floor(Math.random() * 1000);
    data.push({
      id: index,
      title: "Hans-" + num,
      type: type[num % 3],
      description: "Lorem fjkas kdas fal fdjal",
    });
  }
  res.send(data);
});


// products with page and limit
app.get("/products",(req,res)=>{
  let page = req.query.page;
  let limit = req.query.limit;
  if (page==undefined){
    res.send(products.value);
  } else {
    limit = (limit==undefined)?defaultLimit:limit;
    
    let lower = parseInt(page)*parseInt(limit);
    console.log(lower);
    let upper = parseInt(lower) + parseInt(limit);
    console.log(upper);
    res.send( products.value.slice(lower,upper));

  }
  
})

// return imported file
app.get("/file",(req,res)=>{
  console.log(importedData);
  res.send(importedData);
})

app.get("/import",async (req, res) => {
   DataLoader.loadData().then((data)=>{
    FileSaver.saveFile(JSON.stringify(data))
    res.send("File saved " + JSON.stringify(data));
   });

});

cron.schedule('* * 20 * * *', () => {
  console.log('running a task every minute');
  DataLoader.loadData().then((data)=>{
    FileSaver.saveFile(JSON.stringify(data))
    res.send("File saved " + JSON.stringify(data));
   });
});


app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
