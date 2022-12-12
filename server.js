const express = require("express");
const cron = require("node-cron");
const dataloader = require("./app/dataloader");
const saveFile = require("./app/saveFile")
const importedData = require("./import.json");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

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

app.get("/file",(req,res)=>{
  console.log(importedData);
  res.send(importedData);
})

app.get("/import",async (req, res) => {
   dataloader.loadData().then((data)=>{
    saveFile.saveFile(JSON.stringify(data))
    res.send("File saved " + JSON.stringify(data));
   });

});

cron.schedule('* * 20 * * *', () => {
  console.log('running a task every minute');
  dataloader.loadData().then((data)=>{
    saveFile.saveFile(JSON.stringify(data))
    res.send("File saved " + JSON.stringify(data));
   });
});


app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
