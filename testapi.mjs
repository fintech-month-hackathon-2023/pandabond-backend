import dotenv from 'dotenv'
import fetch from 'node-fetch';
dotenv.config()

const endpoint = process.env.API_ENDPOINT

const fetchConfig = {
    method: 'POST',
    headers: {
        "X-API-Key": process.env.AWS_API_KEY
      },
    mode: 'cors',
    cache: 'default',
  };

const register = async (account, name, tier, unhashed) => {
    const name1 = name.split(" ").map(item => item.trim()).join('+');
    await fetch(endpoint + `/register?account=${account}&name=${name1}&tier=${tier}&unhashed=${unhashed}`, fetchConfig);
}

//e.g register('0x123456789','Panda Inc',3,'FET13456')