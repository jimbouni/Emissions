<?php 
	//Returns JSON data to Javascript file
	header("Content-type:application/json");
	
	//Connect to db 
	$pgsqlOptions = "host='localhost' dbname='geog5871' user='geog5871student' password='Geibeu9b'";
	$dbconn = pg_connect($pgsqlOptions) or die ("connection failure");

	// Define SQL query
	$query = "SELECT site, operator, sector, uk_emission, unit, region FROM public.gy22jlp_emissionsdata WHERE uk_emission > 10000";

	// Execute query
	$result = pg_query($dbconn, $query) or die("Query failed: ". pg_last_error());

	// Define a new array to store results
	$emissionsData = array();

	// Loop through query results
	while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		// Populate emissionsData array
		$emissionsData[] = array("site" => $row["site"],"operator" => $row["operator"],"emissions" => $row["uk_emission"],"unit" => $row["unit"],"sector" => $row["sector"],"region" => $row["region"]);
	}

	// Encode EmissionsData array in JSON
	echo json_encode($emissionsData);

	// Close the database connection
	pg_close($dbconn);
?>
