//eslint-disable-next-line
function filterArticles(event) {
  if (event.keyCode === 13) {
    const searchInput = event.target.value.toLowerCase();
    performSearch(searchInput);
  }
}

// Function to handle initial search trigger on page load
function handleInitialSearch() {
  const searchParam = new URLSearchParams(window.location.search).get("tag");

  if (searchParam) {
    const searchInput = searchParam.toLowerCase();
    performSearch(searchInput);
  }
}

function performSearch(query) {
  const articles = document.querySelectorAll(".content article");
  const header = document.querySelector("h1.searchQuery");
  if (query == "") {
    header.textContent = "All Articles";
  } else {
    header.textContent =
      "Searching for: " + query.charAt(0).toUpperCase() + query.slice(1);
  }

  articles.forEach((article) => {
    const tags = article.querySelectorAll(".tag");
    let hasTag = false;

    tags.forEach((tag) => {
      if (tag.textContent.toLowerCase().includes(query)) {
        hasTag = true;
      }
    });

    if (!hasTag) {
      article.style.display = "none";
    } else {
      article.style.display = "block";
    }
  });
  // Add search query to the URL
  updateURL(query);
}

function updateURL(searchInput) {
  const newURL =
    window.location.href.split("?")[0] +
    "?tag=" +
    encodeURIComponent(searchInput);

  // Update the URL without reloading the page
  history.pushState({ tag: searchInput }, document.title, newURL);
}

handleInitialSearch();
