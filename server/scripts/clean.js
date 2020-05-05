
module.exports = function (req, res) {
  let url = req.body.url;

  let conf = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.2; +http://www.google.com/bot.html)'
    }
  };

  axios.get(url, conf)
    .then(res => res.send(text.data))
    .catch(error => {
      console.error(error);
      res.status(500).send('<strong class="error">Cannot read page<strong>');
    });
}