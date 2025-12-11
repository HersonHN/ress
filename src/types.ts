export type Source = {
  id: string;
  title: string;
  url: string;
  icon: string;
};

export type ArticleAPI = {
  feedId: string;
  title: string;
  link: string;
  date: string;
};

export type FeedAPI = {
  id: string;
  feed: ArticleAPI[];
};

export type TotalFeedAPI = Record<string, FeedAPI>;

export type ValidateAPI = {
  ok: boolean;
};
