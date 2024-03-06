<?php

error_reporting(0);

$html_file = './app/index.html';

if (!file_exists($html_file)) {
  echo 'Error: File not found';
  return;
}

$files = scandir('src_data');

if (!$files) {
  echo 'Error: src_data directory not found';
  return;
}

foreach ($files as $file) {
  // gets the last csv file in directory
  if (preg_match('/\.csv$/', $file)) {
    $csv_file = $file;
  }
}

if (!$csv_file) {
  echo 'Error: CSV file not found';
  return;
}

$csv_data = file_get_contents("src_data/$csv_file");
$csv_data = explode("\n", $csv_data);

for ($index = 0; $index < count($csv_data); $index++) {
  $fields = explode(",", $csv_data[$index]);
  $last_field = end($fields);
  $second_last_field = prev($fields);
  if (strpos($csv_data[$index], '#') !== 0 && is_numeric($last_field)) {
    $new_lines[] = (object) array("name" => $second_last_field, "value" => (int) $last_field);
  }
}

$names = [];

foreach ($new_lines as $key => $line) {
  if (in_array($line->name, $names)) {
    $index = array_search($line->name, $names);
    $names[$index] = $line->name;
    $new_lines[$index]->value += $line->value;
    unset($new_lines[$key]);
    $new_lines = array_values($new_lines);
  } else {
    $names[] = $line->name;
  }
}

file_put_contents('app/data.json', json_encode($new_lines));

$page = new DOMDocument();
$page->loadHTMLFile("app/index.html");

$page->getElementsByTagName('h1')[0]->nodeValue = $csv_file;

echo $page->saveHTML();
