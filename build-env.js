const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const fs = require('fs');

const env = dotenv.config()
dotenvExpand(env)
fs.writeFile(".env.json", JSON.stringify(env.parsed), function(err) {
  if(err) {
    return console.log(err);
  }
}); 
