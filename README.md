# invoice-gateway

*** UNDER CONSTRUCTION ***

GUI for setting up a connection between your bookkeeping system and your Peppol provider.
To be combined with https://github.com/pondersource/node-peppol for handling the webhook execution.

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
