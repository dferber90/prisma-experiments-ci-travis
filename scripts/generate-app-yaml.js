// # All URLs ending in .gif .png or .jpg are treated as paths to
// # static files in the static/ directory. The URL pattern is a
// # regular expression, with a grouping that is inserted into the
// # path to the file.
// # - url: /(robots\.txt|favicon\.ico)$
// #   static_files: build/public/\1
// #   upload: static/.*\.(gif|png|jpg)$

// TODO always let user define app.yaml, and we just patch it here by adding
// the GRAPHQL_ENDPOINT as an env var by amending the existing app.yaml?

console.log(`runtime: nodejs10

handlers:
  - url: /static
    static_dir: build/public/static
  - url: /.*
    script: auto

env_variables:
  GRAPHQL_ENDPOINT: '${process.env.GRAPHQL_ENDPOINT}'
`);
