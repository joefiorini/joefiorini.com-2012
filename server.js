var bricks = require('bricks');
var appServer = new bricks.appserver();
var less = require('less');
var fs = require('fs');
var path = require('path');

var lessPlugin = (function(){

  var plugin = {},
      basedir = "";

  plugin.init = function(options){
    basedir = path.join(__dirname, options.basedir);
  }

  plugin.plugin = function(request, response){
    var filename = path.join(basedir, path.basename(request.url)) + ".less";
    var parser = new(less.Parser)({ paths: [basedir] });
    fs.readFile(filename, 'utf-8', function(e, str){
      if(e && e.errno == 34){
        appServer.plugins.filehandler.plugin(request, response, {});
      } else {
        parser.parse(str, function(e, tree){
          if(e){
            console.log("Error: ", JSON.stringify(e));
          }
          css = tree.toCSS({compress: false});
          response.setHeader("content-type", "text/css");
          response.write(css);
          response.end();
        });
      }
    });
  }

  return plugin;
})();

appServer.addRoute("/css/.+", lessPlugin, { basedir: "./less/" });
appServer.addRoute("/.+", appServer.plugins.filehandler, { basedir: "./" });
appServer.addRoute(".+", appServer.plugins.fourohfour);

var server = appServer.createServer();

server.listen(3000);
