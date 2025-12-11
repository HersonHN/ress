import { Source } from './types';

const sources: Source[] = [
  {
    id: 'hacker-news',
    title: 'Hacker News',
    url: 'https://news.ycombinator.com/rss',
    icon: 'https://news.ycombinator.com/favicon.ico',
  },
  {
    id: 'lobsters',
    title: 'Lobsters',
    url: 'https://lobste.rs/rss',
    icon: 'https://lobste.rs/apple-touch-icon.png',
  },
  {
    id: 'ars-technica',
    title: 'Ars Technica',
    url: 'http://feeds.arstechnica.com/arstechnica/index/',
    icon: 'https://cdn.arstechnica.net/wp-content/uploads/2016/10/cropped-ars-logo-512_480-300x300.png',
  },
  {
    id: 'nature',
    title: 'Nature',
    url: 'http://feeds.nature.com/nature/rss/current',
    icon: 'https://www.nature.com/static/images/favicons/nature/favicon.ico',
  },
];

export const defaultSources = () => sources.map((x) => ({ ...x }));

export default defaultSources;
