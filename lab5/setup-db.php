<?php

function executeSetup()
{
  $databaseFile = "coen161_lab5_articles.db";

  try {
    $db = new PDO("sqlite:" . $databaseFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $create_table_query = "CREATE TABLE MyPosts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    tags VARCHAR(100) NOT NULL,
    date VARCHAR(12) NOT NULL,
    content TEXT
  )";

    if ($db->exec($create_table_query) !== false) {
      // echo "Table created successfully\n";
    } else {
      // echo "Error creating table: " . $db->errorInfo()[2] + "\n";
    }

    if (!file_exists('articles.json')) {
      // echo "Error: articles.json does not exist";
      return;
    }
    $articles = json_decode(file_get_contents('articles.json'));

    $query = $db->prepare("INSERT INTO MyPosts (title, tags, date, content) VALUES (:title, :tags, :date, :content)");

    foreach ($articles as $article) {
      $title = $article->title;
      $tags = implode(', ', $article->tags);
      $content = $article->content;
      $date = $article->date;

      $query->bindParam(':title', $title);
      $query->bindParam(':tags', $tags);
      $query->bindParam(':date', $date);
      $query->bindParam(':content', $content);

      $query->execute();
      // echo ("Inserted article: " . $title . "\n");
    }

    $query_select = $db->prepare("SELECT * FROM MyPosts");
    $query_select->execute();
    // $result = $query_select->fetchAll(PDO::FETCH_ASSOC);
    // var_dump($result);
    // echo "Total articles: " . count($result);
  } catch (Exception $e) {
    // echo "Database connection failed: " . $e->getMessage();
  }
}
