const request = require("request");
const fs = require("fs");
const axios = require("axios");
const { log } = require("console");

exports.loadData = async function () {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    let data = {status:200,importDate:new Date(),data:response.data};
    return data;
  } catch (error) {

    return error;
  }
  
};

function saveFile(data) {
  fs.writeFile("helloworld.txt", data, function (err) {
    if (err) return console.log(err);
    console.log("Hello World > helloworld.txt");
  });
}
