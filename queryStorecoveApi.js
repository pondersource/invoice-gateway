const fetch = require('node-fetch');

async function test () {
  const res = await fetch('https://api.storecove.com/api/v2/legal_entities/18843', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.STORECOVE_API_KEY}`
    }
  });
  const json = await res.json();
  console.log(json);
}

// ...
test();
