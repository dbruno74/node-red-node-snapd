module.exports = function(RED) {
    function SnapdNode(config) {
	var utf8 = require("utf8");
	var ipc = require("node-ipc");

	ipc.config.id="snapd";
	ipc.config.retry= 1500;
	ipc.config.rawBuffer=true;
	ipc.config.encoding='utf8';

        RED.nodes.createNode(this,config);
        var node = this;

	uri_prefix 	= "http://localhost";
	host 		= "localhost";
	user_agent 	= "node-red-node-snapd";
	accept		= "*/*";
	snapd_socket 	= "/run/snapd.socket";
	content_type	= "application/json";

	function doGet(uri) {
		ipc.connectTo(ipc.config.id,snapd_socket, function(){
                        node.warn("connectTo");
                        ipc.of.snapd.on(
                                "connect", function(){
                                        var msg="GET " + uri_prefix + uri + " HTTP/1.1\nHost: " + host + "\nUser-Agent: " + user_agent + "\nAccept: " + accept + "\n\n"; 
                                        node.warn(msg);
                                        ipc.of.snapd.emit(utf8.encode(msg));
                        });
                        ipc.of.snapd.on(
                                "disconnect", function(){
                                        node.warn("disconnected!");
                        });
                        ipc.of.snapd.on(
                                "data", function(data){
                                        ipc.disconnect(ipc.config.id);
                                        buff = Buffer.from(data);
                                        str = buff.toString();

                                        json = "{"+str.split(/{(.+)/)[1];       // isolate JSON body
                                        payload = JSON.parse(json);

                                 var msg = {'topic':'snapd'};
                                 msg.payload = payload;
                                        node.send(msg);
                        });
                        ipc.of.snapd.on(
                                "error", function(err){
                                        node.warn(err);
                        });
                });
	};

	function doPost(uri, body) {
		ipc.connectTo(ipc.config.id,snapd_socket, function(){
                        node.warn("connectTo");
                        ipc.of.snapd.on(
                                "connect", function(){
                                        var msg="POST " + uri_prefix + uri + " HTTP/1.1\nHost: " + host + "\nUser-Agent: " + user_agent + "\nContent-Type: " + content_type + "\nAccept: " + accept + "\nContent-Length: " + body.length + "\n\n" + body;
                                        node.warn(msg);
                                        ipc.of.snapd.emit(utf8.encode(msg));
                        });
                        ipc.of.snapd.on(
                                "disconnect", function(){
                                        node.warn("disconnected!");
                        });
                        ipc.of.snapd.on(
                                "data", function(data){
                                        ipc.disconnect(ipc.config.id);
                                        buff = Buffer.from(data);
                                        str = buff.toString();

                                        json = "{"+str.split(/{(.+)/)[1];       // isolate JSON body
                                        payload = JSON.parse(json);

                                 var msg = {'topic':'snapd'};
                                 msg.payload = payload;
                                        node.send(msg);
                        });
                        ipc.of.snapd.on(
                                "error", function(err){
                                        node.warn(err);
                        });
                });
        };

	function doPut(uri, body) {
		ipc.connectTo(ipc.config.id,snapd_socket, function(){
                        node.warn("connectTo");
                        ipc.of.snapd.on(
                                "connect", function(){
                                        var msg="PUT " + uri_prefix + uri + " HTTP/1.1\nHost: " + host + "\nUser-Agent: " + user_agent + "\nContent-Type: " + content_type + "\nAccept: " + accept + "\nContent-Length: " + body.length + "\n\n" + body;
                                        node.warn(msg);
                                        ipc.of.snapd.emit(utf8.encode(msg));
                        });
                        ipc.of.snapd.on(
                                "disconnect", function(){
                                        node.warn("disconnected!");
                        });
                        ipc.of.snapd.on(
                                "data", function(data){
                                        ipc.disconnect(ipc.config.id);
                                        buff = Buffer.from(data);
                                        str = buff.toString();

                                        json = "{"+str.split(/{(.+)/)[1];       // isolate JSON body
                                        payload = JSON.parse(json);

                                 var msg = {'topic':'snapd'};
                                 msg.payload = payload;
                                        node.send(msg);
                        });
                        ipc.of.snapd.on(
                                "error", function(err){
                                        node.warn(err);
                        });
                });
        };


        node.on('input', function(msg) {
            if (msg.topic === "snapd_rest_api_get") {
		 doGet(msg.payload);
            }
            if (msg.topic === "snapd_rest_api_post") {
		 doPost(msg.payload.command, JSON.stringify(msg.payload.body));
	    }
            if (msg.topic === "snapd_rest_api_put") {
		 doPut(msg.payload.command, JSON.stringify(msg.payload.body));
	    }
        });
    }

    RED.nodes.registerType("snapd",SnapdNode);
}
