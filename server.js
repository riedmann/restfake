const express = require("express");
const cron = require("node-cron");
const DataLoader = require("./DataLoader");
const FileSaver = require("./FileSaver")

// getting local files
const importedData = require("./import.json");
const products = require("./items.json");

// environment
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const defaultLimit = process.env.LIMIT||20;

app.use(express.json());

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
app.get("/file",(req,res)=>{
  console.log(importedData);
  res.send(importedData);
})

app.get("/import",async (req, res) => {
   dataloader.loadData().then((data)=>{
    FileSaver.saveFile(JSON.stringify(data))
    res.send("File saved " + JSON.stringify(data));
   });

});

cron.schedule('* * 20 * * *', () => {
  console.log('running a task every minute');
  dataloader.loadData().then((data)=>{
    FileSaver.saveFile(JSON.stringify(data))
    res.send("File saved " + JSON.stringify(data));
   });
});


app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
