var bricks = require('bricks');
var appServer = new bricks.appserver();
var less = require('less');
var fs = require('fs');

var lessPlugin = {
  plugin: function(request, response){
    var filename = __dirname + request.url + ".less";
    var parser = new less.Parser;
    fs.readFile(filename, 'utf-8', function(e, str){
      if(e && e.errno == 34){
        appServer.plugins.filehandler.plugin(request, response, {});
      } else {
        parser.parse(str, function(e, tree){
          if(e){
            console.log("Error: ", e);
          }
          css = tree.toCSS({compress: false});
          response.setHeader("content-type", "text/css");
          response.write(css);
          response.end();
        });
      }
    });
  }
};

appServer.addRoute("/css/.+", lessPlugin, { basedir: "./css/" });
appServer.addRoute("/.+", appServer.plugins.filehandler, { basedir: "./" });
appServer.addRoute(".+", appServer.plugins.fourohfour);

var server = appServer.createServer();

server.listen(3000);
