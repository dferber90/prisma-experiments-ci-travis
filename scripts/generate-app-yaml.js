// # All URLs ending in .gif .png or .jpg are treated as paths to
// # static files in the static/ directory. The URL pattern is a
// # regular expression, with a grouping that is inserted into the
// # path to the file.
// # - url: /(robots\.txt|favicon\.ico)$
// #   static_files: build/public/\1
// #   upload: static/.*\.(gif|png|jpg)$

console.log(`runtime: nodejs10

handlers:
- url: /static
  static_dir: build/public/static
- url: /.*
  secure: always
  redirect_http_response_code: 301
  script: auto
`);
