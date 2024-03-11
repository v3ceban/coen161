<?php

error_reporting(0);

require_once 'setup-db.php';
executeSetup();

$page = $_GET['page'] ?? '';

if (empty($page)) {
  $page = "home.php";
} else {
  $page = $page . ".php";
}


if (!file_exists($page)) {
  echo "Error 404: $page does not exist";
  return;
} else {
  include($page);
}
