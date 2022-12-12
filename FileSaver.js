fs = require('fs');

exports.saveFile = function(data){
    fs.writeFile('import.json',data, function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
      });
}