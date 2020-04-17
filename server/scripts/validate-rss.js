
const parser = require('./rss-parser');

module.exports = function (req, res) {
  let url = req.body.url;

  parser.parseSingleFeed({ url }).then(response => {
    if (response.error) {
      return res.json({ ok: false });
    }

    res.json({ ok: true });
  })
}
