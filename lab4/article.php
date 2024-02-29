<?php

function init()
{
  $id = $_GET['id'];
  $name = $_GET['name'];

  if (!$id && !$name) { // using && returns false if id OR name missing, true if one or both missing
    echo "Error: id or name parameter missing";
    return;
  }


  if (!file_exists('articles.json')) {
    echo "Error: articles.json does not exist";
    return;
  }

  $articles = json_decode(file_get_contents('articles.json'));

  foreach ($articles as $article) {
    if ($id) {
      if ($id == $article->id) {
        $title = $article->title;
        $tags = $article->tags;
        $content = $article->content;
      }
    } else {
      if ($name == $article->title) {
        $title = $article->title;
        $tags = $article->tags;
        $content = $article->content;
      }
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

  $pageTitle = $page->getElementById("top");
  if (!$pageTitle) {
    echo "Error: pageTitle element not found";
    return;
  } else {
    $pageTitle->nodeValue = $title;
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
      $pageTags[$i]->setAttribute("href", "./articles.html?tag=$tags[$i]");
      $pageTags[$i]->nodeValue = $tags[$i];
    }
  }

  echo $page->saveHTML();
}

init();
