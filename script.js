function fetchData() {
    // Define an array to hold results returned from the server
    emissionsData = new Array(); 

    // AJAX request to the server; accepts a URL to which the request is sent
    // and a callback function to execute if the request is successful.
    $.getJSON("fetchData.php", function (results) {
        // Populate emissionsData with results

        for (var i = 0; i < results.length; i++) {
            emissionsData.push({
                site: results[i].site, 
                operator: results[i].operator,
                emissions: results[i].emissions,
                unit: results[i].unit,
				sector:results[i].sector,
                region: results[i].region
            });
        }

        writeEmissions();
    });
//function to write emissions data to table
    function writeEmissions() {//generates HTML for a table with headers
        var tableHtml = "<table class='emissions-table' border='1'><tr><th>Site</th><th>Operator</th><th>Emissions</th><th>Unit</th><th>Sector</th><th>Region</th></tr>";
		//loops through data to create rows
         for (var i = 0; i < emissionsData.length; i++) {
			tableHtml += "<tr><td>" + emissionsData[i].site + "</td><td>" + emissionsData[i].operator +
				"</td><td>" + emissionsData[i].emissions + "</td><td>" + emissionsData[i].unit +
				"</td><td>" + emissionsData[i].sector + "</td><td>" + emissionsData[i].region + "</td></tr>";
        }

        tableHtml += "</table>";

        document.getElementById('textWrap').innerHTML = tableHtml;
    }
}
//function to clear data
function clearData() {
    document.getElementById('textWrap').innerHTML = '';
}
