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

document.addEventListener("mouseup", handleHighlight);
document.addEventListener("touchend", handleHighlight);

function handleHighlight() {
  let selection = window.getSelection();
  let range = selection.getRangeAt(0);

  let highlightNode = document.createElement("span");
  highlightNode.classList.add("highlight");
  range.surroundContents(highlightNode);

  highlightNode.addEventListener("click", removeHighlight);
}

function removeHighlight(event) {
  event.target.classList.remove("highlight");
}

let downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadHighlightedText);

function downloadHighlightedText() {
  let highlightedElements = document.getElementsByClassName("highlight");
  let highlightedTextArray = [];

  for (let i = 0; i < highlightedElements.length; i++) {
    let highlightedText = highlightedElements[i].textContent;
    highlightedTextArray.push(highlightedText);
  }

  let jsonString = JSON.stringify(highlightedTextArray);
  let encodedString = encodeURIComponent(jsonString);

  let downloadLink = document.createElement("a");
  downloadLink.href = "data:text/plain;charset=utf-8," + encodedString;
  downloadLink.download = "highlightedText.json";
  downloadLink.click();
}
