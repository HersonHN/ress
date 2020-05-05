
const env = process.env.NODE_ENV;
let domain = '';

if (env == 'development') {
  domain = 'http://localhost:4100';
}

let config = {
  routes: {
    sources: `${domain}/api/sources`,
    feed: `${domain}/api/feed`,
    feeds: `${domain}/api/feeds`,
    article: `${domain}/api/clean`
  }
};

export default config
