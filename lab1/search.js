function filterArticles(event) {
  if (event.keyCode === 13) {
    const searchInput = event.target.value.toLowerCase();
    const articles = document.querySelectorAll(".content article");

    articles.forEach((article) => {
      const tags = article.querySelectorAll(".tag");
      let hasTag = false;

      tags.forEach((tag) => {
        if (tag.textContent.toLowerCase().includes(searchInput)) {
          hasTag = true;
        }
      });

      if (!hasTag) {
        article.style.display = "none";
      } else {
        article.style.display = "block";
      }
    });
  }
}
