<?php
function init()
{
  $id = $_GET['id'];

  if (!$id) {
    echo "Error: id parameter is missing";
    return;
  }

  if (!file_exists('articles.json')) {
    echo "Error: articles.json does not exist";
    return;
  }

  $articles = json_decode(file_get_contents('articles.json'));

  foreach ($articles as $article) {
    if ($article->id == $id) {
      $title = $article->title;
      $tags = $article->tags;
      $content = $article->content;
    }
  }

  if (!$title) {
    echo "Error: article not found";
    return;
  }

  echo nl2br("Title: $title\nTags: $tags\n\n$content\n");
}

init();
