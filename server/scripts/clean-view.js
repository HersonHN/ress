
const readability = require('node-readability');
const Deferred = require('promise-deferred');


main();


function cleanView(url) {
  var deferred = new Deferred();

  readability(url, function (err, article) {
    if (err) return deferred.reject(err);

    let content = extraSanitize(article.content);
    article.close();
    deferred.resolve(content);
  })

  return deferred.promise;
}


function extraSanitize(content) {
  return content.replace(/<a/g, '<a target="_blank"');
}


function main() {
  if (require.main === module) {
    let defaultURL = 'https://opinionator.blogs.nytimes.com/2015/01/11/why-life-is-absurd/';
    let param = process.argv[2];

    cleanView(param || defaultURL).then(function (output) {
      console.log(output);
    });
  }
}


module.exports = { cleanView };
