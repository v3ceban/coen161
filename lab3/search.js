// PLAN:
//
// 0. Create an array of searched tags.
// 1. Create new tag. Add appropriate class and an
//    event listener to delete it.
// 2. Append this tag to header
// 3. Get search queries from url, add them to array
//    and pass array into search function. Call create
//    tag and append tag for each search query
// 4. Look for the search queries from the array in each
//    article. Mark article if it doesn't have all tags
//    present in the array and hide it.
// 5. Get search query from the form element when "Enter"
//    button is pressed. Add it to the array and run search.
//    Update URL to include all tags.
// 6. Run initial search function right before page loads
//    (defer) script

let searchedTags = [];

function updateURL() {
  const searchParams = new URLSearchParams();
  searchedTags.forEach((tag) => {
    searchParams.append("tag", tag);
  });
  const newUrl =
    window.location.origin +
    window.location.pathname +
    (searchedTags.length > 0 ? "?" + searchParams.toString() : "");
  window.history.pushState(null, null, newUrl);
}

function createTag(tag) {
  let newTag = document.createElement("span");
  newTag.classList.add("tag");
  newTag.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
  newTag.addEventListener("click", () => {
    const index = searchedTags.indexOf(tag);
    if (index > -1) {
      searchedTags.splice(index, 1);
    }
    newTag.remove();
    performSearch(searchedTags);
    updateURL();
  });
  return newTag;
}

function appendTag(tag) {
  const h1 = document.querySelector("h1");
  const newTag = createTag(tag);
  h1.appendChild(newTag);
}

function handleInitialSearch() {
  const searchParams = new URLSearchParams(window.location.search);
  const searchTags = searchParams.getAll("tag");
  if (searchTags.length > 0) {
    searchTags.forEach((tag) => {
      const searchInput = tag.toLowerCase();
      if (!searchedTags.includes(searchInput)) {
        searchedTags.push(searchInput);
        appendTag(searchInput);
      }
    });
    performSearch(searchedTags);
  }
}

function performSearch(query) {
  const articles = document.querySelectorAll("article");

  articles.forEach((article) => {
    const tags = article.querySelectorAll("a.tag");
    let hasTags = false;

    tags.forEach((articleTag) => {
      if (query.includes(articleTag.textContent.toLowerCase())) {
        hasTags = true;
      }
    });

    if (hasTags || searchedTags.length === 0) {
      article.style.display = "block";
    } else {
      article.style.display = "none";
    }
  });
}

// eslint-disable-next-line
function filterArticles(event) {
  if (event.keyCode === 13) {
    const searchInput = event.target.value.toLowerCase();
    if (!searchedTags.includes(searchInput) && searchInput.length > 0) {
      searchedTags.push(searchInput);
      appendTag(searchInput);
    }
    performSearch(searchedTags);
    event.target.value = "";
    updateURL();
  }
}

const articleTags = document.querySelectorAll("article ul.tags a.tag");
articleTags.forEach((tag) => {
  tag.addEventListener("click", (e) => {
    e.preventDefault();
    const searchInput = tag.textContent.toLowerCase();
    if (!searchedTags.includes(searchInput)) {
      searchedTags.push(searchInput);
      appendTag(searchInput);
    }
    performSearch(searchedTags);
    updateURL();
  });
});

handleInitialSearch();
