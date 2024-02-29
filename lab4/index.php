<?php

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
