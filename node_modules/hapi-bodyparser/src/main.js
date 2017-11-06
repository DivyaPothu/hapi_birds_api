'use strict';
var Content = require('content'),
    Parser = require('./parser');

var register = function (server, options, next) {
    var v = Parser.__SCHEMA.validate(options);
    options = Object.assign({}, Parser.__DEFAULTS, v.value);
    server.ext('onPostAuth', function (request, reply) {
        if (request.method === 'get') {
            return reply.continue();
        }
        
        var opts = request.route.settings.plugins.body;
        if (opts) {
            v = Parser.__SCHEMA.validate(opts);
            options = Object.assign({}, options, v.value);
        }

        var mime = Content.type(request.headers['content-type']).mime;       
        if (mime === 'multipart/form-data' || mime === 'application/x-www-form-urlencoded') {     
            Parser.parse(request, options);
        }

        return reply.continue();
    });

    next();
};

register.attributes = { pkg: require('../package.json') };

exports.register = register;