<?php

function init()
{
  if (!file_exists('articles.json')) {
    echo "Error: articles.json does not exist";
    return;
  }

  $articles = json_decode(file_get_contents('articles.json'));

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

  $article = $articles[sizeof($articles) - 1];

  if (!$article) {
    echo "Error: no articles in articles.json";
    return;
  }

  $id = $article->id;
  $header = $article->title;
  $tags = $article->tags;
  $content = implode(". ", array_slice(explode(". ", $article->content), 0, 4));
  $date = $article->date;

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
