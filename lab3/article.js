let scrollPosition;

function saveScrollPosition() {
  const key = `scrollPosition_${document.title}`;
  localStorage.setItem(key, scrollPosition);
}

function restoreScrollPosition() {
  const key = `scrollPosition_${document.title}`;
  const savedPosition = localStorage.getItem(key);
  if (savedPosition && !isNaN(savedPosition)) {
    scrollPosition = parseInt(savedPosition);
    window.scrollTo(0, scrollPosition);
  }
}

window.addEventListener("load", () => {
  restoreScrollPosition();
});

window.addEventListener("scroll", () => {
  scrollPosition = window.scrollY;
  saveScrollPosition();
});

// Attach an event handler to the mouseup or touchup event of the article.
document.addEventListener("mouseup", handleHighlight);
document.addEventListener("touchend", handleHighlight);

// Get the document's current selection and get the range starting at 0.
function handleHighlight() {
  let selection = window.getSelection();
  let range = selection.getRangeAt(0);

  // Create a new highlight node that surrounds the highlighted element.
  let highlightNode = document.createElement("span");
  highlightNode.classList.add("highlight");
  range.surroundContents(highlightNode);

  // When a highlighted element is clicked, it should stop being highlighted
  highlightNode.addEventListener("click", removeHighlight);
}

// Remove the highlight class from the clicked element
function removeHighlight(event) {
  event.target.classList.remove("highlight");
}

// Attach an event handler to the download button's click event.
let downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadHighlightedText);

// Loop through all the elements that have been highlighted and save the element’s string text into a new array
function downloadHighlightedText() {
  let highlightedElements = document.getElementsByClassName("highlight");
  let highlightedTextArray = [];

  for (let i = 0; i < highlightedElements.length; i++) {
    let highlightedText = highlightedElements[i].textContent;
    highlightedTextArray.push(highlightedText);
  }

  // Convert the new array to a JSON string and call encodeURIComponent
  let jsonString = JSON.stringify(highlightedTextArray);
  let encodedString = encodeURIComponent(jsonString);

  // Create an anchor element that can download this string
  let downloadLink = document.createElement("a");
  downloadLink.href = "data:text/plain;charset=utf-8," + encodedString;
  downloadLink.download = "highlightedText.json";
  downloadLink.click();
}
