//ensures the enclosed function is executed once the content is full oloaded, prevents JS from running until the doc is ready for use
document.addEventListener("DOMContentLoaded", function () {
//creates map variable
var map;//the map obeject

////Activates a callback of a function at a later time and enables the pop up information from specified marker
function infoCallback(marker, myInfo) {
    return function () {
        marker.bindPopup(myInfo).openPopup();//this 'binds' the pop up info to the marker and opens it
    };
}

//adds the markers
function addMarker(myPos, myTitle, myInfo, myRadius) {
    var marker = L.circleMarker(myPos, {//this defines the marker as leaflet circular and specifies the paramters furtehr such as radius, colour, etc
        radius: myRadius,
        fillColor: 'blue', // Defines the fill color
        fillOpacity: 0.7,//the opacity of the fill
        weight: 1,//the weight or thickness
        color: 'black' //defines outline colour
    }).addTo(map);//adds the created marker to the map
	
// when marker is clicked the infocallback function is executed therfore the associated pop us displays.
    marker.bindPopup(myInfo);//connects the popup with a marker and sets the content to the value of myInfo
    marker.on('click', infoCallback(marker, myInfo));//adds a click event - function is executed upon click
    return marker;//retruns the marker for further use
}
//Updates the markersize based on their zoom levels i.e. when zooming out the radius of the circle decreases
function updateMarkerSizes() {
    // Iterate markers' data and update their size based on the emission value and zoom level
    for (var i = 0; i < os_markers.length; i++) {//for loop to iterate through markers stores in the os marker array (script separate file)
        var marker = os_markers[i].marker;//retrieves marker object
        var emission = parseFloat(os_markers[i].emission);//rertieves emission values
        var radius = isNaN(emission) ? 5 : calculateRadius(emission, map.getZoom());//converts to a floating point if it is not a valid number default is set to 5 - //function calls a calculateRadius function and passes the emission value and the current zoom level of the map 

   
        marker.setRadius(radius);// Update the marker's radius with calclated value
    }
}
//initializes the Leaflet map
function initialize() {
	//set the initil map view
    map = L.map('map').setView([54.186325, -2.100929], 6);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {//adds the tile layer from openstreemap
        attribution: 'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery ©CloudMade',
        maxZoom: 10
    }).addTo(map);
	
//iterates through marker data in emissions js file
    for (var i = 0; i < os_markers.length; i++) {
        var info =
            "<div class=infowindow><h1>" +////it creates an HTML string (info) that includes the supplied information
            os_markers[i].Site +//retrives site information
            "</h1><p>Operator: " +
            os_markers[i].Operator +//retrieves operator information
            "</p><p>Sector: " +
            os_markers[i].Sector +//retrieves sector information
            "</p><p>Emissions: " +
            os_markers[i].emission +//retrieves emission information
			"</p><p>Unit: " +
            os_markers[i].Unit +//retrieves unit inormation
            "</p></div>";
//converts os eastign and northings to lat/lon
        var osPt = new OSRef(os_markers[i].easting, os_markers[i].northing);//this put on OS grid

        var llPt = osPt.toLatLng(osPt);//converts OS ref to lat/long
        llPt.OSGB36ToWGS84();//this converts from OSB36 to wgs 84

        // Create the marker with a radius based on emissions and initial zoom level
        os_markers[i].marker = addMarker(
            L.latLng(llPt.lat, llPt.lng),
            os_markers[i].Site, // Use Site as the title
            info,
            calculateRadius(parseFloat(os_markers[i].emission), map.getZoom())
        );
    }

    // Listen for changes in the zoom level and update marker sizes
    map.on('zoomend', updateMarkerSizes);//adds an event listener to the Leaflet map which listens for the 'zoomend' event, and when the map's zoom level changes, it calls the updateMarkerSizes function.
}

// Function to calculate the radius based on emissions and zoom level
function calculateRadius(emission, currentZoom) {
    // Adjust the scaling factor to make the circles smaller or larger based on emissions and zoom level
    return Math.sqrt(emission) * Math.pow(2, currentZoom - 6) * 0.01; // Example scaling factor, experiment with different values
}

    initialize(); // Call initialize to set up the map and markers
        });