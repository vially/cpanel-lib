[![build status](https://secure.travis-ci.org/vially/cpanel-lib.png)](http://travis-ci.org/vially/cpanel-lib)
Node.js library for the cPanel/WHM API
=====

## Instalation
    $ npm install cpanel-lib

## Usage
```js
var cpanel = require('cpanel-lib');

var options = {
    host: 'whm.example.com',
    port: 2087,
    secure: true,
    username: 'WHM_USERNAME',
    accessKey: 'YOUR_ACCESS_KEY',
    ignoreCertError: true
};

var cpanelClient = cpanel.createClient(options);

cpanelClient.call('version', {}, function (err, res) {
    console.log('WHM Version: %j', res.version);
});

cpanelClient.call('listaccts', {}, function (err, res) {
    console.log('Result: %j', res);
});

cpanelClient.callApi2('AddonDomain', 'listaddondomains', {}, function (err, res) {
    console.log('Result: %j', res);
});
```

## API
    cpanelClient.call(action, params, callback)
    cpanelClient.callApi1(module, func, args, [user], callback)
    cpanelClient.callApi2(module, func, args, [user], callback)
    cpanelClient.callUapi(module, func, args, callback)
