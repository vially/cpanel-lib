var qs = require('qs')

exports.createClient = function (options) {
  options = options || {};

  var client = cpanelJsonClient({
    host: options.host,
    port: options.port || 2087,
    secure: options.secure,
    username: options.username,
    accessKey: options.accessKey,
    path: options.path || '/json-api/'
  });

  return client;
};

var cpanelJsonClient = function (obj) {
  if (obj.secure == null)
    obj.secure = true;

  obj.connection = obj.secure ? require('https') : require('http');
  obj.call = function (action, query, callback) {
    if (obj.host == null || obj.username == null || obj.accessKey == null) {
      throw("Host, username and accessKey must be set")
    }

    var params = qs.stringify(query);
    var headers = {
      "Authorization": "WHM " + obj.username + ":" + obj.accessKey
    };

    var options = {
      host: obj.host,
      port: obj.port,
      path: obj.path + action + '?' + params,
      method: 'GET',
      headers: headers
    };
    var req = obj.connection.request(options, function (res) {
      var data = '';
      res.on('data', function (chunk) {
        data += chunk.toString()
      });
      res.on('end', function() {
        callback(JSON.parse(data));
      });
    });
    req.end();
  };

  return obj;
};
