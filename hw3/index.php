<?php

error_reporting(0);

$html_file = fopen("./app/tablets.html", "w");

// If you needed me to do this in PHP and not in JS - here it is
//
// include_once("app/pieChart.php");
// pieChart();
//

if (!$html_file) {
  echo "Error: Failed to open file";
  return;
}

fwrite($html_file, '<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="./app/pieChart.js" defer></script>
  <link rel="stylesheet" href="./app/style.css" />
  <title>Data visualization</title> 
</head>

<body>
  <h1>File name</h1>
  <section>
    <svg id="pieChart"></svg>
  </section>
  <div id="hover"></div>
</body> 

</html>');

fclose($html_file);

$html_file = "./app/tablets.html";

if (!file_exists($html_file)) {
  echo "Error: File not found";
  return;
}


// look in root directory first
$csv_file = "tablets.csv";

// look in src_data directory
if (!file_exists($csv_file)) {
  $csv_file = "src_data/tablets.csv";
}

// get last csv file in src_data directory
if (!file_exists($csv_file)) {
  $files = scandir("src_data");

  if (!$files || count($files) <= 2) {
    echo "Error: src_data directory not found";
    return;
  }

  $latest_file = "";
  $latest_time = 0;
  foreach ($files as $file) {
    if (preg_match("/\.csv$/", $file)) {
      $file_time = filemtime("src_data/" . $file);
      if ($file_time > $latest_time) {
        $latest_time = $file_time;
        $latest_file = $file;
      }
    }
  }

  if ($latest_file) {
    $csv_file = "src_data/" . $latest_file;
  }
}

if (!file_exists($csv_file)) {
  echo "Error: CSV file not found";
  return;
}

$csv_data = file_get_contents($csv_file);

if (!$csv_data || empty($csv_data)) {
  echo "Error: Failed to get CSV data. File is empty or corrupted";
  return;
}

$csv_data = explode("\n", $csv_data);

$json_data = [];
$names = [];

foreach ($csv_data as $data) {
  $fields = explode(",", $data);
  $num_field = end($fields);
  $string_field = prev($fields);

  if (strpos($data, "#") !== 0 && is_numeric($num_field) && count($fields) === 3) {
    if (in_array($string_field, $names)) {
      $index = array_search($string_field, $names);
      $json_data[$index]->value += (int) $num_field;
    } else {
      $names[] = $string_field;
      $json_data[] = (object) array("name" => $string_field, "value" => (int) $num_field);
    }
  }
}

file_put_contents("app/data.json", json_encode($json_data));

$page = new DOMDocument();
$page->loadHTMLFile("app/tablets.html");

$page->getElementsByTagName("h1")[0]->nodeValue = str_replace('src_data/', '', $csv_file);

echo $page->saveHTML();
