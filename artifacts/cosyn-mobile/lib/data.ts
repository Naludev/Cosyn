export type Convention = {
  id: string;
  name: string;
  city: string;
  country: string;
  dates: string;
  day: string;
  month: string;
  category: string;
  venue: string;
  description: string;
  attendees: number;
  accent: 'violet' | 'cyan' | 'pink' | 'green';
};

export type FeedPost = {
  id: string;
  username: string;
  initials: string;
  country: string;
  body: string;
  time: string;
  likes: number;
  accent: 'violet' | 'cyan' | 'pink';
};

export type Chat = {
  id: string;
  name: string;
  subtitle: string;
  unread: number;
  accent: 'violet' | 'cyan' | 'pink';
};

export type Message = {
  id: string;
  author: string;
  initials: string;
  body: string;
  time: string;
  mine?: boolean;
};

export const conventions: Convention[] = [
  {
    id: 'made-in-asia',
    name: 'Made in Asia',
    city: 'Brussels',
    country: 'Belgium',
    dates: '06–07 MAR 2027',
    day: '06',
    month: 'MAR',
    category: 'Anime',
    venue: 'Brussels Expo',
    description: 'Belgium’s biggest celebration of anime, manga, cosplay and Asian pop culture.',
    attendees: 248,
    accent: 'violet',
  },
  {
    id: 'dutch-comic-con',
    name: 'Dutch Comic Con',
    city: 'Utrecht',
    country: 'Netherlands',
    dates: '20–21 MAR 2027',
    day: '20',
    month: 'MAR',
    category: 'Comics',
    venue: 'Jaarbeurs',
    description: 'A weekend of comics, cosplay, gaming, special guests and fandom culture.',
    attendees: 189,
    accent: 'cyan',
  },
  {
    id: 'facts-spring',
    name: 'FACTS Spring',
    city: 'Ghent',
    country: 'Belgium',
    dates: '03–04 APR 2027',
    day: '03',
    month: 'APR',
    category: 'Sci-fi',
    venue: 'Flanders Expo',
    description: 'The home of sci-fi, fantasy, gaming and some of the best cosplay in the Benelux.',
    attendees: 164,
    accent: 'pink',
  },
  {
    id: 'gameforce',
    name: 'Gameforce',
    city: 'Mechelen',
    country: 'Belgium',
    dates: '15–16 MAY 2027',
    day: '15',
    month: 'MAY',
    category: 'Gaming',
    venue: 'Nekkerhal',
    description: 'Two days of gaming, esports, indie games, retro classics and cosplay.',
    attendees: 96,
    accent: 'green',
  },
];

export const feedPosts: FeedPost[] = [
  {
    id: 'nobara',
    username: 'MikaMoon',
    initials: 'MM',
    country: 'Belgium',
    body: 'Progress check: the Nobara hammer is finally painted. See you at Made in Asia?',
    time: '18 min',
    likes: 42,
    accent: 'violet',
  },
  {
    id: 'jupiter',
    username: 'YukiFox',
    initials: 'YF',
    country: 'Netherlands',
    body: 'I just found the perfect boots for my Sailor Jupiter build. Convention season is officially on.',
    time: '1 h',
    likes: 28,
    accent: 'cyan',
  },
  {
    id: 'lens',
    username: 'PixelSage',
    initials: 'PS',
    country: 'Belgium',
    body: 'Photographers: what is your favorite convention lens setup?',
    time: '3 h',
    likes: 19,
    accent: 'pink',
  },
];

export const chats: Chat[] = [
  { id: 'mia', name: 'Made in Asia 2027', subtitle: '2,481 orbiters', unread: 4, accent: 'violet' },
  { id: 'facts', name: 'FACTS Spring', subtitle: '1,932 orbiters', unread: 0, accent: 'cyan' },
  { id: 'jujutsu', name: 'Jujutsu Kaisen Group', subtitle: 'Cosplay group', unread: 2, accent: 'pink' },
];

export const initialMessages: Record<string, Message[]> = {
  mia: [
    { id: 'm1', author: 'AikoRin', initials: 'AR', body: 'Anyone else arriving on Saturday morning?', time: '09:42' },
    { id: 'm2', author: 'PixelSage', initials: 'PS', body: 'Yep! I’ll be near the main entrance with a camera.', time: '09:47' },
    { id: 'm3', author: 'MikaMoon', initials: 'MM', body: 'Same here. I’m doing Nobara this year.', time: '09:51', mine: true },
  ],
  facts: [
    { id: 'f1', author: 'Nova', initials: 'NV', body: 'The cosplay contest schedule just dropped!', time: 'Yesterday' },
  ],
  jujutsu: [
    { id: 'j1', author: 'Ren', initials: 'RN', body: 'We need a Gojo for the group shot.', time: 'Mon' },
  ],
};

export const groups = [
  { id: 'g1', conventionId: 'made-in-asia', name: 'Jujutsu Kaisen Group', description: 'A chaotic but camera-ready group for sorcerers.', characters: 'Nobara · Yuji · Gojo · Megumi', members: 18, joined: true },
  { id: 'g2', conventionId: 'made-in-asia', name: 'Sailor Moon Moonies', description: 'Moon prism power, snacks, and a group photo.', characters: 'Sailor Jupiter · Sailor Mars · Tuxedo Mask', members: 11, joined: false },
  { id: 'g3', conventionId: 'dutch-comic-con', name: 'Spider-Verse Across Utrecht', description: 'Every universe welcome. Canon optional.', characters: 'Miles · Gwen · Miguel', members: 24, joined: false },
];

export const photoshoots = [
  { id: 'p1', conventionId: 'made-in-asia', title: 'Sorcerers at golden hour', date: 'Sat 06 Mar', time: '17:30', location: 'Hall 4 — west doors', rsvps: 12, joined: false },
  { id: 'p2', conventionId: 'made-in-asia', title: 'Casual cosplay coffee walk', date: 'Sun 07 Mar', time: '10:00', location: 'Atomium entrance', rsvps: 8, joined: true },
  { id: 'p3', conventionId: 'dutch-comic-con', title: 'Spider-Verse rooftop set', date: 'Sat 20 Mar', time: '15:00', location: 'Jaarbeurs plaza', rsvps: 16, joined: false },
];

export const getConvention = (id: string) => conventions.find((convention) => convention.id === id) ?? conventions[0];
export const getChat = (id: string) => chats.find((chat) => chat.id === id) ?? chats[0];