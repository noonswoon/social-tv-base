var APP_STORE_OR_AD_HOC_BUILD = false;
var URBAN_AIRSHIP_APP_DEV_KEY = "Ip9pwoBrShK4zKfJ9RwC7w";
var URBAN_AIRSHIP_APP_DEV_SECRET = "qkswgsM0Qymqe0OIZX4ruw";
var URBAN_AIRSHIP_APP_DEV_MASTER_SECRET = "SRu56K1YRVeoulsgvTmoUA";
var URBAN_AIRSHIP_APP_PROD_KEY = "";
var URBAN_AIRSHIP_APP_PROD_SECRET = "";
var URBAN_AIRSHIP_APP_PROD_MASTER_SECRET = "";
var MY_DEVICE_TOKEN_SYM = 'myDeviceToken';

var getDeviceToken = function() {
	if(!IS_ON_DEVICE)
		return "82DFA37CD520A0CBF2EF92A2138550AE88829C08EC01DE2109FE61FC3ADE82D5";
	else {
		var deviceToken = "";
		if(Ti.App.Properties.hasProperty(MY_DEVICE_TOKEN_SYM)) {
			deviceToken =  Ti.App.Properties.getString(MY_DEVICE_TOKEN_SYM);
		} else deviceToken = "";
		//alert('deviceToken: '+deviceToken);
		return deviceToken;
	}
};
exports.getDeviceToken = getDeviceToken;

var setDeviceToken = function(_deviceToken) {
	Ti.App.Properties.setString(MY_DEVICE_TOKEN_SYM,_deviceToken);
};
exports.setDeviceToken = setDeviceToken;

var getAppKey = function() {
	var appKey = "";
	if(APP_STORE_OR_AD_HOC_BUILD)  appKey = URBAN_AIRSHIP_APP_PROD_KEY;
	else appKey = URBAN_AIRSHIP_APP_DEV_KEY;
	//alert('appKey: '+appKey);
	return appKey;
}
exports.getAppKey = getAppKey;

var getAppSecret = function() {
	var appSecret = "";
	if(APP_STORE_OR_AD_HOC_BUILD)  appSecret = URBAN_AIRSHIP_APP_PROD_SECRET;
	else appSecret = URBAN_AIRSHIP_APP_DEV_SECRET;
	//alert('appSecret: '+appSecret);
	return appSecret;
};
exports.getAppSecret = getAppSecret;

var getAppMasterSecret = function() {
	var appMasterSecret = "";
	if(APP_STORE_OR_AD_HOC_BUILD)  appMasterSecret = URBAN_AIRSHIP_APP_PROD_MASTER_SECRET;
	else appMasterSecret = URBAN_AIRSHIP_APP_DEV_MASTER_SECRET;
	return appMasterSecret;
};
exports.getAppMasterSecret = getAppMasterSecret;

exports.registerDeviceToken = function(_deviceToken) {
	setDeviceToken(_deviceToken);
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			if (xhr.status != 200 && xhr.status != 201) {
				xhr.onerror(e);
				return;
			}
		},
		onerror:function(e) {
			alert("Register with Urban Airship Push Service failed. Error: " + e.error);
		}
	}); 
	
	// Register device token with UA
	xhr.open('PUT', 'https://go.urbanairship.com/api/device_tokens/' + _deviceToken, true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(getAppKey() + ':' + getAppSecret()));
	
	var registerParameters = {
	    "alias": "mickey_id",
	    "tags": [
	        "tag1",
	        "tag2"
	    ],
	    "badge": 2,
	    "quiettime": {
	        "start": "6:00",
	        "end": "7:00"
	    },
	    "tz": "America/Los_Angeles"
	};
	xhr.send(JSON.stringify(registerParameters));	  
};

exports.unRegisterDeviceToken = function() {
	var request = Titanium.Network.createHTTPClient({
			onerror:function(e) {
				alert("ERROR: deleted device token data with Urban Airship Push Service failed. Error: "
	                + e.error);
	        }
	    });
	request.open('DELETE', 'https://go.urbanairship.com/api/device_tokens/'+getDeviceToken(), true);
    request.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(getAppKey() + ':' + getAppSecret()));
    request.send();
}

exports.sendPushNotification = function(_recipientDeviceToken, messageToSend) {
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			if (xhr.status != 200 && xhr.status != 201) {
				xhr.onerror(e);
				return;
			} else {
				alert("sending push notification succeeded!");
			}
		},
		onerror:function(e) {
			alert("Sending with Urban Airship Push Service failed. Error: " + e.error);
		}
	}); 
	
	// Register device token with UA
	xhr.open('POST', 'https://go.urbanairship.com/api/push/', true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(getAppKey() + ':' + getAppMasterSecret()));

	var sendParameters = {
	    "device_tokens": [_recipientDeviceToken],
	    "aps": {
	         "badge": 1,
	         "alert": messageToSend,
	         "sound": "default"
	    }
	};
	xhr.send(JSON.stringify(sendParameters));	
}
