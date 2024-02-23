The `defer` attribute in `<script>` tags indicates that the script
should be executed after the HTML document has been fully parsed/loaded.
It allows the browser to continue loading and rendering the page
while the script is downloaded in the background. This also ensures
that the script will be after document is loaded, so javascript can
access and manipulate the DOM.
