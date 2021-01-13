const request = require('request');
const fs = require('fs');
const { fileURLToPath } = require('url');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let args = process.argv.splice(2);
let url = args[0];
let destDir = args[1];

if(args.length < 2){
  console.log('please provide a url and a destination file path');
  process.exit();
}

request(url, (error, response, body) => {
  if((response && response.statusCode) === 200) {
    if(fs.existsSync(destDir)){
      rl.question(`this file already exists. would you like to overwrite it? \n`, (answer) => {
        if (answer === 'y' || answer === 'Y'){
          write(destDir, body);
        }
        else {
          console.log('exiting program...');
          process.exit();
        }
      });
    }
    else{
      write(destDir, body);
    }  
  }
  else{
    console.log(`fetching data from url failed. error code: ${response.statusCode}`);
    process.exit();
  }
});

const write = (destDir, body) => {
  fs.writeFile(destDir, body, (err) => {
    if(err) console.log(err);
    else console.log('file written successfully');
    process.exit();
  });
}
