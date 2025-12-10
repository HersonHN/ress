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
  {
    id: 'smithsonian-magazine',
    title: 'Smithsonian Magazine',
    url: 'https://www.smithsonianmag.com/rss/latest_articles/',
    icon: 'https://static-media.smithsonianmag.com/img/icons/Smithsonian-com-Icon2-120.png',
  },
];

export const defaultSources = () => sources;

export default defaultSources;
