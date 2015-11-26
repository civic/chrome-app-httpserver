chrome.app.runtime.onLaunched.addListener(function(launchData){
	chrome.app.window.create('window.html', {
		bounds: {
			width: 400,
			height: 300
		}
	});
});
