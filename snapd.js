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
        node.on('input', function(msg) {
	    if (msg.payload === "refresh_app_list") {
	    	ipc.connectTo("snapd","/run/snapd.socket", function(){
			node.warn("connectTo");
			ipc.of.snapd.on(
				"connect", function(){
					var msg="GET http://localhost/v2/apps HTTP/1.1\nHost: localhost\nUser-Agent: node-red-node-snapd\nAccept: */*\n\n";
					node.warn(msg);
					ipc.of.snapd.emit(utf8.encode(msg));
			});
			ipc.of.snapd.on(
				"disconnect", function(){
					node.warn("disconnected!");
			});
			ipc.of.snapd.on(
				"data", function(data){
					ipc.disconnect("snapd");
					buff = Buffer.from(data);
					str = buff.toString();
					
					json = "{"+str.split(/{(.+)/)[1];	// isolate JSON body 
					payload = JSON.parse(json);

		               	 var msg = {'topic':'snapd'};
     		 	       	 msg.payload = payload;
                			node.send(msg);
			});
			ipc.of.snapd.on(
				"error", function(err){
					node-warn(err);
			});
	    	});
	   }
           // msg.payload = msg.payload.toLowerCase();
           // node.send(msg);
        });
    }

    RED.nodes.registerType("snapd",SnapdNode);
}
