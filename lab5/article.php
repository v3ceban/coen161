<?php

error_reporting(0);

function init()
{
  $id = $_GET['id'];
  $name = $_GET['name'];

  if (isset($id) && isset($name)) { // using && returns false if id OR name missing, true if one or both missing
    echo "Error: id or name parameter missing";
    return;
  }

  if (!file_exists('coen161_lab5_articles.db')) {
    echo "Error: database does not exist";
    return;
  }

  $databaseFile = "coen161_lab5_articles.db";

  try {
    $db = new PDO("sqlite:" . $databaseFile);
    $query = $db->prepare("SELECT * FROM MyPosts WHERE id = :id");
    $query->bindParam(':id', $id);
    // $query->bindParam(':name', $name);
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
  } catch (Exception $e) {
    echo "Database connection failed: " . $e->getMessage();
  }

  // if (!file_exists('articles.json')) {
  //   echo "Error: articles.json does not exist";
  //   return;
  // }
  //
  // $articles = json_decode(file_get_contents('articles.json'));
  //
  // if (!is_array($articles)) {
  //   echo "Error: articles.json of is not an array";
  //   return;
  // }

  $title = "";
  $content = "";
  $tags = "";

  if (isset($id)) {
    if ($id == $result['id']) {
      $title = $result['title'];
      $tags = explode(', ', $result['tags']);
      $content = $result['content'];
      $date = $result['date'];
    }
  } else {
    if ($name == $result['title']) {
      $title = $result['title'];
      $tags = explode(', ', $result['tags']);
      $content = $result['content'];
      $date = $result['date'];
    }
  }

  if (!$title) {
    echo "Error: article not found";
    return;
  }

  if (!file_exists("article.html")) {
    echo "Error: article page does not exist";
    return;
  }

  $page = new DOMDocument();
  $page->loadHTMLFile("article.html");

  $titleTag = $page->getElementsByTagName("title")[0];
  if (!$titleTag) {
    echo "Error: titleTag element not found";
    return;
  } else {
    $titleTag->nodeValue = "Lab 4: $title";
  }

  $pageTitle = $page->getElementById("top");
  if (!$pageTitle) {
    echo "Error: pageTitle element not found";
    return;
  } else {
    $pageTitle->nodeValue = $title;
  }

  $pageDate = $page->getElementById("date");
  if (!$pageDate) {
    echo "Error: pageDate element not found";
    return;
  } else {
    $pageDate->nodeValue = "Date written: $date";
  }

  $pageContent = $page->getElementById("content");
  if (!$pageContent) {
    echo "Error: pageContent element not found";
    return;
  } else {
    $pageContent->nodeValue = $content;
  }

  $xpath = new DOMXPath($page);
  $pageTags = $xpath->query('//a[@class="tag"]');
  if ($pageTags->length == 0) {
    echo "Error: pageTags element not found";
    return;
  } else {
    for ($i = 0; $i < $pageTags->length; $i++) {
      $lowerTag = strtolower($tags[$i]);
      $pageTags[$i]->setAttribute("href", "./?page=articles&tag=$lowerTag");
      $pageTags[$i]->nodeValue = $lowerTag;
    }
  }

  $nextId = null;
  if ($id >= sizeof($result)) {
    $nextId = 1;
  } else {
    $nextId = $id + 1;
  }

  $pageNextLink = $page->getElementById("next");
  if (!$pageNextLink) {
    echo "Error: pageNextLink element not found";
    return;
  } else {
    $pageNextLink->setAttribute("href", "./?page=article&id=$nextId");
  }

  $prevId = null;
  if ($id <= 1) {
    $prevId = sizeof($result);
  } else {
    $prevId = $id - 1;
  }

  $pagePrevLink = $page->getElementById("prev");
  if (!$pagePrevLink) {
    echo "Error: pagePrevLink element not found";
    return;
  } else {
    $pagePrevLink->setAttribute("href", "./?page=article&id=$prevId");
  }

  echo $page->saveHTML();
}

init();
