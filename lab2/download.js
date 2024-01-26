//write a function to download the contents of the page
function downloadPage() {
  // Get the current URL
  var url = window.location.href;

  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Set the response type to 'text'
  xhr.responseType = "text";

  // Define a callback function to handle the response
  xhr.onload = function() {
    if (xhr.status === 200) {
      // The request was successful
      var content = xhr.responseText;
      console.log(content);
      // You can do something with the downloaded content here
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
