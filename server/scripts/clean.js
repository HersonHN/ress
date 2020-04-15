
const axios = require('axios');

module.exports = function (req, res) {
  let url = req.body.url;

  axios.get(url, {})
    .then(page => res.send(page.data))
    .catch(error => {
      if (error.response && error.response.status) {
        console.error(`Error loading ${url}`);
        console.error(`Error Message: ${error.response.status} ${error.response.statusText}`);
      }
      res.status(500).send(`<strong class="error">Cannot read page ${url}<strong>`);
    });
}