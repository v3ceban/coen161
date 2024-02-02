// PLAN:
//
// Scroll position
//
// 0. Create a value for scroll position
// 1. When page loads, check if there's a scroll position key
//    saved in local storage. If it is - scroll to that point.
//    If it's not in there - scroll to top.
// 2. When user scrolls, get current window position and save
//    it to local storage under unique key using the variable

let scrollPosition;

window.addEventListener("load", () => {
  const key = `scrollPosition_${document.title}`;
  const savedPosition = localStorage.getItem(key);
  if (savedPosition && !isNaN(savedPosition)) {
    scrollPosition = parseInt(savedPosition);
    window.scrollTo(0, scrollPosition);
  }
});

window.addEventListener("scroll", () => {
  scrollPosition = window.scrollY;
  const key = `scrollPosition_${document.title}`;
  localStorage.setItem(key, scrollPosition);
});

// PLAN:
//
// Highlight and download
//
// 0. Add mouseup and touchend events to document
// 1. On each mouseup/toucheend get selected items from window
//    object. Create span with class highlight and surround all
//    selection in this span. Add a click event listener to this
//    span to replace this span with its content.
// 2. Get download button and add click event listener. On each
//    click get all highlights and add them to an array. Stringify
//    and encode it into JSON. Create a link to download the string,
//    add encoded string into it, add download handler to save the
//    file and click it to download JSON file.

document.addEventListener("mouseup", handleHighlight);
document.addEventListener("touchend", handleHighlight);

function handleHighlight() {
  let selection = window.getSelection();
  let range = selection.getRangeAt(0);

  let highlightNode = document.createElement("span");
  highlightNode.classList.add("highlight");
  range.surroundContents(highlightNode);

  highlightNode.addEventListener("click", (e) => {
    let span = e.target;
    let content = span.innerHTML;
    span.parentNode.replaceChild(document.createTextNode(content), span);
  });
}

let downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", () => {
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
});
