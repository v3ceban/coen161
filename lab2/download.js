//eslint-disable-next-line
function downloadPage() {
  var url = window.location.href;
  const fileName = document.querySelector("h1");

  var xhr = new XMLHttpRequest();

  xhr.responseType = "text";

  xhr.onload = function() {
    if (xhr.status === 200) {
      var content = xhr.responseText;
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(content),
      );
      element.setAttribute("download", `${fileName.textContent}.html`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      console.error("Request failed. Status code: " + xhr.status);
    }
  };

  xhr.open("GET", url);

  xhr.send();
}
