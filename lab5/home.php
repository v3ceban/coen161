<?php

error_reporting(0);

function init()
{
  // if (!file_exists('articles.json')) {
  //   echo "Error: articles.json does not exist";
  //   return;
  // }
  //
  // $articles = json_decode(file_get_contents('articles.json'));

  if (!file_exists('coen161_lab5_articles.db')) {
    echo "Error: database does not exist";
    return;
  }

  $databaseFile = "coen161_lab5_articles.db";

  try {
    $db = new PDO("sqlite:" . $databaseFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $query = $db->prepare("SELECT * FROM MyPosts ORDER BY id DESC LIMIT 1");
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage();
  }

  if (!file_exists("home.html")) {
    echo "Error: home page does not exist";
    return;
  }

  $page = new DOMDocument();
  $page->loadHTMLFile("home.html");
  $xpath = new DOMXPath($page);
  $main = $xpath->query('//main')[0];

  if (!$main) {
    echo "Error: main element does not exist";
    return;
  }

  if (!$result) {
    echo "Error: no articles in database";
    return;
  }

  $id = $result['id'];
  $header = $result['title'];
  $tags = explode(', ', $result['tags']);
  $content = implode(". ", array_slice(explode(". ", $result['content']), 0, 2));
  $date = $result['date'];


  $h2 = $page->createElement('h2');
  $h2link = $page->createElement('a');
  $h2link->setAttribute('href', "./?page=article&id=$id");
  $h2link->nodeValue = $header;
  $h2->appendChild($h2link);

  $ul = $page->createElement('ul');
  $ul->setAttribute('class', 'tags');

  foreach ($tags as $tag) {
    $tag = strtolower($tag);
    $li = $page->createElement('li');
    $alink = $page->createElement('a');
    $alink->setAttribute('href', "./?page=articles&tag=$tag");
    $alink->setAttribute('class', 'tag');
    $alink->nodeValue = $tag;
    $li->appendChild($alink);
    $ul->appendChild($li);
  }

  $pdate = $page->createElement('p');
  $pdate->nodeValue = "Date written: $date";

  $p = $page->createElement('p');
  $p->nodeValue = $content;

  $nav = $page->createElement('nav');
  $navAll = $page->createElement('a');
  $navAll->setAttribute('href', "./?page=articles");
  $navAll->nodeValue = "View All";
  $navContinue = $page->createElement('a');
  $navContinue->setAttribute('href', "./?page=article&id=$id");
  $navContinue->nodeValue = "Continue";
  $nav->appendChild($navAll);
  $nav->appendChild($navContinue);

  $main->appendChild($h2);
  $main->appendChild($ul);
  $main->appendChild($pdate);
  $main->appendChild($p);
  $main->appendChild($nav);

  echo $page->saveHTML();
}

init();
