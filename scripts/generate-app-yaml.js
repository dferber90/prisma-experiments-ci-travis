// Replaces ${env:FOO} with value of FOO from env
//
// Call it with an input and an output file
//   node generate-app-yaml.js app.template.yaml app.yaml
//
// Based on https://github.com/prisma/prisma/blob/master/cli/packages/prisma-yml

const fs = require("fs");
const yaml = require("yaml");
const _ = require("lodash");

// const variableSyntax = RegExp("\\${([ ~:a-zA-Z0-9._'\",\\-\\/\\(\\)]+?)}", "g");
// uppercase letters, digits, underscore and do not begin with a digit
const envSyntax = /^\${env:([a-zA-Z_][a-zA-Z0-9_]*)}/g;

const sourceFile = process.argv[2];
const outputFile = process.argv[3];

const source = fs.readFileSync(sourceFile, "utf8");

const content = yaml.parse(source);

const deepMapValues = (object, callback, propertyPath) => {
  const deepMapValuesIteratee = (value, key) =>
    deepMapValues(
      value,
      callback,
      propertyPath ? propertyPath.concat(key) : [key]
    );
  if (_.isArray(object)) {
    return _.map(object, deepMapValuesIteratee);
  } else if (
    _.isObject(object) &&
    !_.isDate(object) &&
    !_.isRegExp(object) &&
    !_.isFunction(object)
  ) {
    return _.extend({}, object, _.mapValues(object, deepMapValuesIteratee));
  }
  return callback(object, propertyPath);
};

const envRefSyntax = /^env:/g;
const replace = objectToPopulate => {
  const clone = _.clone(objectToPopulate);
  deepMapValues(clone, (property, propertyPath) => {
    if (typeof property === "string") {
      const matches = envSyntax.exec(property);
      if (matches) {
        const envVarName = matches[1];
        const isDefined = process.env.hasOwnProperty(envVarName);
        if (!isDefined) {
          const p = propertyPath.join(".");
          console.warn(
            `Tried to replace "${property}" in "${p}" but env var ${envVarName} is not set. Falling back to empty string.`
          );
        }
        _.set(clone, propertyPath, isDefined ? process.env[envVarName] : "");
      }
      //
    }
  });
  return clone;
};

fs.writeFileSync(outputFile, yaml.stringify(replace(content)), "utf8");
