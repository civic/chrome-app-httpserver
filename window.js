
var $ = require("jquery");
var HTTPServer = require("./server");
var server = new HTTPServer();

$("#start").removeAttr("disabled").on("click", function(){
	server.start(function(request){
        $("<pre>").text(request).appendTo("#log");
    });
	$("#start").attr("disabled", "disabled");
	$("#stop").removeAttr("disabled");
    $("#log").text("");
});
$("#stop").attr("disabled", "disabled").on("click", function(){
	server.stop();
	$("#start").removeAttr("disabled");
	$("#stop").attr("disabled", "disabled");
});

