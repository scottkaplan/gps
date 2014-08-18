//
//
// after deviceready
//
//

// Your app must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
//  in order to prompt the user for Location permission.
window.navigator.geolocation.getCurrentPosition(function(location) {
        console.log('Location from Phonegap');
    });

var bgGeo = window.plugins.backgroundGeoLocation;

/**
 * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
 */
var yourAjaxCallback = function(response) {
    ////
};

/**
 * This callback will be executed every time a geolocation is recorded in the background.
 */
var callbackFn = function(location) {
    console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
    console.log (this);
    // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
    //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
    // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
    //
    //
    bgGeo.finish();

    // Do your HTTP request here to POST location to your server.
    //
    //
    var request_parms = { gps_longitude: location.longitude,
			  gps_latitude:  location.latitude,
			  method:        'send_position',
			  device_id:     device_id_mgr.get(),
    };
    ajax_request (request_parms, send_position_callback, send_position_failure_callback);

};

var failureFn = function(error) {
    console.log('BackgroundGeoLocation error'.error.inspect);
};

function init_background_gps () {
    bgGeo.configure(callbackFn, failureFn, {
	    url: 'https://eng.geopeers.com/api', // <-- Android ONLY:  your server url to send locations to 
		params: {
		    method:    'send_position',
		    device_id: device_id_mgr.get(),
		    },
		// headers: {                                   // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
		// "X-Foo": "BAR"
		// },
		notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
		notificationText: 'ENABLED', // <-- android only, customize the text of the notification
		desiredAccuracy: 10,
		stationaryRadius: 20,
		distanceFilter: 30, 
		activityType: 'AutomotiveNavigation',
		debug: true // <-- enable this hear sounds for background-geolocation life-cycle.
		});

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    bgGeo.start();

    // If you wish to turn OFF background-tracking, call the #stop method.
    // bgGeo.stop();
}
