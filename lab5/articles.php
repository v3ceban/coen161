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
  //
  // if (!file_exists("articles.html")) {
  //   echo "Error: articles page does not exist";
  //   return;
  // }

  if (!file_exists('coen161_lab5_articles.db')) {
    echo "Error: database does not exist";
    return;
  }

  $databaseFile = "coen161_lab5_articles.db";

  try {
    $db = new PDO("sqlite:" . $databaseFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $query = $db->prepare("SELECT * FROM MyPosts");
    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
  } catch (Exception $e) {
    echo "Database connection failed: " . $e->getMessage();
  }

  $page = new DOMDocument();
  $page->loadHTMLFile("articles.html");
  $xpath = new DOMXPath($page);
  $mainSection = $xpath->query('//main//section')[0];
  if (!$mainSection) {
    echo "Error: main element doesn't contain a section element";
    return;
  }

  foreach ($result as $article) {
    $id = $article['id'];
    $header = $article['title'];
    $tags = explode(', ', $article['tags']);
    $content = implode(". ", array_slice(explode(". ", $article['content']), 0, 2));

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

    $p = $page->createElement('p');
    $plink = $page->createElement('a');
    $plink->setAttribute('href', "./?page=article&id=$id");
    $plink->nodeValue = $content;
    $p->appendChild($plink);

    $section = $page->createElement('article');
    $section->appendChild($h2);
    $section->appendChild($ul);
    $section->appendChild($p);

    $mainSection->appendChild($section);
  }

  echo $page->saveHTML();
}

init();
