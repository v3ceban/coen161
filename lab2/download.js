//eslint-disable-next-line
function downloadPage() {
  // Get the current URL
  var url = window.location.href;
  const fileName = document.querySelector("h1");

  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Set the response type to 'text'
  xhr.responseType = "text";

  // Define a callback function to handle the response
  xhr.onload = function() {
    if (xhr.status === 200) {
      // The request was successful
      var content = xhr.responseText;
      // start downloading content into a text file
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(content),
      );
      element.setAttribute("download", `${fileName}.html`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      // The request failed
      console.error("Request failed. Status code: " + xhr.status);
    }
  };

  // Open a GET request to the current URL
  xhr.open("GET", url);

  // Send the request
  xhr.send();
}
