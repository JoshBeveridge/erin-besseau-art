const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
var exec = require('child_process').execSync;

module.exports = function (eleventyConfig) {

  // Run Hydrogen before the eleventy build executes
  eleventyConfig.on('eleventy.after', async () => {
    console.log(exec("npx h2-build").toString());
  });
  
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  // Create a filter
  eleventyConfig.addFilter('featured', (value) => {
    var featuredPosts = [];
    value.forEach(function(post) {
      if (post.data.feature == true) {
        featuredPosts = featuredPosts.concat(post);
      }
    });
    return featuredPosts;
  })

  eleventyConfig.addCollection("artwork", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/artwork/**/*.md");
  });

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./src/static/css/app.css": "./static/css/app.css",
    "./src/static/css/hydrogen.css": "./static/css/hydrogen.css",
    "./src/static/css/hydrogen.vars.css": "./static/css/hydrogen.vars.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy({"./src/static/img/favicons": "./"});

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
