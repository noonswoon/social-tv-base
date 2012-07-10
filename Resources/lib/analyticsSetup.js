	//Set up analytics
	var analytics = new Analytics('UA-32782163-1');
	// Call the next function if you want to reset the analytics to a new first time visit.
	// This is useful for development only and should not go into a production app.
	//analytics.reset();

	// The analytics object functions must be called on app.js otherwise it will loose it's context
	Titanium.App.addEventListener('analytics_trackPageview', function(e){
		analytics.trackPageview('/Chatterbox' + e.pageUrl);
	});

	Titanium.App.addEventListener('analytics_trackEvent', function(e){
		analytics.trackEvent(e.category, e.action, e.label, e.value);
	});

	// I've set a global Analytics object to contain the two functions to make it easier to fire the analytics events from other windows
	Titanium.App.Analytics = {
		trackPageview:function(pageUrl){
			Titanium.App.fireEvent('analytics_trackPageview', {pageUrl:pageUrl});
		},
		trackEvent:function(category, action, label, value){
			Titanium.App.fireEvent('analytics_trackEvent', {category:category, action:action, label:label, value:value});
		}
	}

	// Starts a new session as long as analytics.enabled = true
	// Function takes an integer which is the dispatch interval in seconds
	analytics.start(10);
	
	////////////////////////////