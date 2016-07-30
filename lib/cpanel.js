var qs = require('qs')

exports.createClient = function (options) {
  options = options || {};

  var client = cpanelJsonClient({
    host: options.host,
    port: options.port || 2087,
    secure: options.secure,
    username: options.username,
    password: options.password,
    accessKey: options.accessKey,
    path: options.path || '/json-api/',
    ignoreCertError: options.ignoreCertError
  });

  return client;
};

var cpanelJsonClient = function (obj) {
  if (obj.secure == null)
    obj.secure = true;

  obj.connection = obj.secure ? require('https') : require('http');
  obj.call = function (action, query, callback) {
    if (obj.host == null || obj.username == null || (obj.accessKey == null && obj.password == null)) {
      throw("Host, username and an accessKey or a password must be set")
    }

    var params = qs.stringify(query);
    var headers = {};
    if (obj.accessKey != null) {
      // WHM access hash authenticaion
      headers.Authorization = "WHM " + obj.username + ":" + obj.accessKey
    } else {
      // basic user authentication
      headers.Authorization = "Basic " + new Buffer(obj.username + ":" + obj.password).toString('base64')
    }

    var options = {
      host: obj.host,
      port: obj.port,
      path: obj.path + action + '?' + params,
      headers: headers,
      rejectUnauthorized: !obj.ignoreCertError
    };
    var req = obj.connection.get(options, function (res) {
      var data = '';
      res.on('data', function (chunk) {
        data += chunk.toString()
      });
      res.on('end', function() {
        try{
          callback(null, JSON.parse(data));
        }catch(e){
          callback('Format request not valid');
        } 
      });
    }).on('error', function(e) {
      callback(e);
    });
  };

  obj.callApi1 = function (module, func, args) {
    var callback;
    var user;

    if (arguments.length == 4) {
      user = obj.username;
      callback = arguments[3];
    } else {
      user = arguments[3];
      callback = arguments[4];
    }

    var query = {};
    for (var i = 0; i < args.length; i++) {
      query['arg-' + i] = args[i];
    }

    obj._callOldApi(user, module, func, query, 1, callback);
  };

  obj.callApi2 = function (module, func, query) {
    var callback;
    var user;

    if (arguments.length == 4) {
      user = obj.username;
      callback = arguments[3];
    } else {
      user = arguments[3];
      callback = arguments[4];
    }

    obj._callOldApi(user, module, func, query, 2, callback);
  };
  
  obj.callUapi = function(module, func, args, callback){
    obj.path = '/execute/';
    obj.call(module+'/'+func, args, callback);
  }

  obj._callOldApi = function (user, module, func, query, version, callback) {
    query['cpanel_jsonapi_user'] = user;
    query['cpanel_jsonapi_module'] = module;
    query['cpanel_jsonapi_func'] = func;
    query['cpanel_jsonapi_apiversion'] = version;
    obj.call('cpanel', query, callback);
  };

  return obj;
};
