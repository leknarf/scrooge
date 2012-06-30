Scrooge is a cache-centric framework for asynchronous web applications.

h2. Project goals

  - All client requests are served out of Amazon's S3 and can be handled with or without a running backend server.

h2. Architecture

A web page consists of two components: an HTML template and a optional JSON document.

There are there kinds of web pages:

  1. Completely static pages (just HTML)
  2. Semi-dynamic pages (template HTML + pre-compiled JSON data)
  3. Fully-dynamic pages (template HTML + dynamically generated JSON data)

Completly static web pages are supported by just retrieving a template from S3.

Semi-dynamic web pages require AJAX:

  1. The browser loads the blank template.
  2. An ajax call retrieves the appropreate JSON document from S3.

Fully-dynamic page get interesting:

  1. The browser loads the blank template
  2. An ajax call from the client checks whether s3://results/my_data.json exists
    1. If it does not, the client PUTS a blank JSON document to s3://results/my_data_hash.json and a JSON document with the query parameters to s3://requests/my_data_hash.json
  3. The client now polls S3 and waits for data to be added to s3://results/my_data_hash.json
    1. The server polls s3://requests/ looking for new requests
    2. It PUTS the results to s3://results/my_data.json
    3. It DELETES s3://requests/my_data.json
  4. The client now retrieves the completed JSON and renders the template, like a semi-dynamic page.

h2. Open concerns

Security: how to prevent someone from deleting all your data?
