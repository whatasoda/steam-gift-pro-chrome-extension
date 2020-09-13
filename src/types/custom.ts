interface GameItem {
  href: string;
  title: string;
}

type BackgroundMessage = {
  type: 'steam-search';
  gameTitle: string;
};
