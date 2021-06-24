# quickbooks-storecove-bridge
Exploring how to bridge between Quickbooks and Storecove in Node.js

```sh
heroku run node queryStorecoveApi.js --app=quickbooks-storecove-bridge
Running node queryStorecoveApi.js on ⬢ quickbooks-storecove-bridge... up, run.1768 (Free)
{
  id: 18843,
  party_name: 'Test Party',
  line1: 'Test Street',
  line2: null,
  zip: 'Zippy',
  city: 'Test City',
  county: null,
  country: 'NL',
  tenant_id: 'my_id',
  public: true,
  peppol_identifiers: [],
  administrations: [],
  advertisements: [ 'invoice' ]
}
```

And visit https://quickbooks-storecove-bridge.herokuapp.com/ to see the Quickbooks side
