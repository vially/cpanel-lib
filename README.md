Node.js library for the cPanel/WHM API
=====

## Instalation
    $ npm install cpanel-lib

## Usage
    var cpanel = require('cpanel-lib');
    
    var options = {
      host: 'whm.example.com',
      port: 2087,
      secure: true,
      username: 'WHM_USERNAME',
      accessKey: 'YOUR_ACCESS_KEY'
    };

    var cpanelClient = cpanel.createClient(options);

    cpanelClient.call('version', {}, function (result) {
      console.log('WHM Version: %j', result.version);
    });

    cpanelClient.call('listaccts', {}, function (result) {
      console.log('Result: %j', result);
    });
