// Replaces ${env:FOO} with value of FOO from env
//
// Call it with an input and an output file
//   node generate-app-yaml.js app.template.yaml app.yaml
//
// Based on https://github.com/prisma/prisma/blob/master/cli/packages/prisma-yml

const fs = require("fs");
const yaml = require("yaml");
const _ = require("lodash");
const deepMap = require("deep-map");

// const variableSyntax = RegExp("\\${([ ~:a-zA-Z0-9._'\",\\-\\/\\(\\)]+?)}", "g");
// uppercase letters, digits, underscore and do not begin with a digit
const envSyntax = str => /^\${env:([a-zA-Z_][a-zA-Z0-9_]*)}/g.exec(str);

const sourceFile = process.argv[2];
const outputFile = process.argv[3];

const source = fs.readFileSync(sourceFile, "utf8");
const content = yaml.parse(source);

const mapped = deepMap(content, (property, propertyPath) => {
  if (typeof property !== "string") return property;

  const matches = envSyntax(property);
  if (!matches) return property;

  const envVarName = matches[1];
  const isDefined = process.env.hasOwnProperty(envVarName);
  if (!isDefined) {
    const p = propertyPath.join(".");
    console.warn(
      `Tried to replace "${property}" in "${p}" but env var ${envVarName} is not set. Falling back to empty string.`
    );
  }
  return isDefined ? process.env[envVarName] : "";
});

fs.writeFileSync(outputFile, yaml.stringify(mapped), "utf8");
