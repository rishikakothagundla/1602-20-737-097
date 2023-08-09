const express = require('express');
const Joi = require('joi');
const axios = require('axios');
const app = express();

app.use(express.json());

const port = 8008;
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.get('/numbers', async(req,res) => {
  const urls = req.query.url; //get url from the request
  if(!urls){
    return res.status(404).json({error: "Url doesn't exist"});
  }
  const urlsArray = Array.isArray(urls) ? urls : [urls];
  const valid = urlsArray.filter(url => validate(url)); //check if url is valid

  const numbers = await getNumbers(valid);

  res.json(numbers);
});

//function to check if url is valid
function validate(url){
  const schema = Joi.string().uri();

  return schema.validate(url).error === undefined;
}

async function getNumbers(valid){
  const numbers = [];
  for (const url of valid ){
    try{
      const response = await axios.get(url);
      if(response.status === 200){
      numbers.push({...response.data});
    }
    }
    catch(error){
        console.error("Error fetching numbers:", error.message);
    }
  }
  return numbers;
}