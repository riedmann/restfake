const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT

app.use(express.json());

const type = ["guitar","piano","electric"]

app.get('/', (req, res) => {
    const data = [];
    for (let index = 0; index < 20; index++) {
        let num = Math.floor(Math.random()*1000);
        data.push({id:index,title:"Hans-" + num,type:type[num%3], description:"Lorem fjkas kdas fal fdjal"});
    }
    res.send(data);
})

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})