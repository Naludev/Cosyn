import { Router, type IRouter, type Request } from "express";
import { getAuth } from "@clerk/express";
import {
  CreateConventionBody,
  CreateGroupBody,
  CreateMessageBody,
  CreatePhotoshootBody,
  CreatePostBody,
  GetConventionParams,
  JoinGroupParams,
  ListConventionsQueryParams,
  ListGroupsQueryParams,
  ListMessagesParams,
  ListPhotoshootsQueryParams,
  MarkAttendanceBody,
  MarkAttendanceParams,
  TogglePostLikeParams,
} from "@workspace/api-zod";
import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import {
  attendanceTable,
  chatsTable,
  conventionsTable,
  friendsTable,
  groupMembersTable,
  groupsTable,
  messagesTable,
  photoRsvpsTable,
  photoshootsTable,
  postsTable,
  usersTable,
} from "@workspace/db";
import { db } from "@workspace/db";

const router: IRouter = Router();

const seedConventions = [
  {
    name: "Made in Asia",
    country: "Belgium",
    city: "Brussels",
    venue: "Brussels Expo",
    address: "Place de Belgique 1, 1020 Brussels",
    startDate: "2027-03-06",
    endDate: "2027-03-07",
    description: "Belgium's biggest celebration of anime, manga, cosplay and Asian pop culture.",
    bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=85",
    websiteUrl: "https://madeinasia.be",
    ticketUrl: "https://madeinasia.be/tickets",
    category: "Anime",
    organizer: "Easyfairs",
    featured: true,
  },
  {
    name: "Dutch Comic Con",
    country: "Netherlands",
    city: "Utrecht",
    venue: "Jaarbeurs",
    address: "Jaarbeursplein, 3521 AL Utrecht",
    startDate: "2027-03-20",
    endDate: "2027-03-21",
    description: "A weekend of comics, cosplay, gaming, special guests and fandom culture.",
    bannerUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=1600&q=85",
    websiteUrl: "https://dutchcomiccon.com",
    ticketUrl: "https://dutchcomiccon.com/tickets",
    category: "Comics",
    organizer: "Comic Con Holland",
    featured: true,
  },
  {
    name: "FACTS Spring",
    country: "Belgium",
    city: "Ghent",
    venue: "Flanders Expo",
    address: "Maaltekouter 1, 9051 Ghent",
    startDate: "2027-04-03",
    endDate: "2027-04-04",
    description: "The home of sci-fi, fantasy, gaming and the best cosplay in the Benelux.",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85",
    websiteUrl: "https://facts.be",
    ticketUrl: "https://facts.be/tickets",
    category: "Sci-Fi",
    organizer: "Easyfairs",
    featured: true,
  },
  {
    name: "Gameforce",
    country: "Belgium",
    city: "Mechelen",
    venue: "Nekkerhal",
    address: "Plattebeekstraat 1, 2800 Mechelen",
    startDate: "2027-05-15",
    endDate: "2027-05-16",
    description: "Two days of gaming, esports, indie games, retro classics and cosplay.",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85",
    websiteUrl: "https://gameforce.be",
    ticketUrl: "https://gameforce.be/tickets",
    category: "Gaming",
    organizer: "Gameforce",
    featured: false,
  },
];

const seedUsers = [
  {
    clerkId: "demo_user",
    username: "MikaMoon",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=80",
    bio: "Cosplayer, convention wanderer, and professional snack finder.",
    country: "Belgium",
  },
  {
    clerkId: "yuki_fox",
    username: "YukiFox",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=80",
    bio: "Sailor Moon collector and part-time photographer.",
    country: "Netherlands",
  },
  {
    clerkId: "pixel_sage",
    username: "PixelSage",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80",
    bio: "Retro games, prop making, and good lighting.",
    country: "Belgium",
  },
];

let seedPromise: Promise<void> | undefined;

async function ensureSeeded() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const existing = await db.select({ id: conventionsTable.id }).from(conventionsTable).limit(1);
    if (existing.length) return;

    const users = await db.insert(usersTable).values(seedUsers).returning();
    const conventions = await db.insert(conventionsTable).values(seedConventions).returning();
    await db.insert(attendanceTable).values([
      { userId: users[0].id, conventionId: conventions[0].id, cosplayCharacter: "Nobara Kugisaki", fandom: "Jujutsu Kaisen", cosplayProgress: "75%" },
      { userId: users[1].id, conventionId: conventions[0].id, cosplayCharacter: "Sailor Jupiter", fandom: "Sailor Moon", cosplayProgress: "Finished" },
      { userId: users[2].id, conventionId: conventions[1].id, cosplayCharacter: "Link", fandom: "The Legend of Zelda", cosplayProgress: "50%" },
      { userId: users[0].id, conventionId: conventions[2].id, cosplayCharacter: "Vi", fandom: "Arcane", cosplayProgress: "Started" },
    ]);
    const chats = await db.insert(chatsTable).values([
      { conventionId: conventions[0].id, name: "General" },
      { conventionId: conventions[1].id, name: "General" },
      { conventionId: conventions[2].id, name: "General" },
    ]).returning();
    await db.insert(messagesTable).values([
      { chatId: chats[0].id, userId: users[1].id, body: "Anyone up for a JJK meetup on Saturday?", reactions: 8 },
      { chatId: chats[0].id, userId: users[0].id, body: "Absolutely. I am bringing my Nobara build.", reactions: 3 },
      { chatId: chats[1].id, userId: users[2].id, body: "The Zelda group is forming near the main stage.", reactions: 5 },
    ]);
    const groups = await db.insert(groupsTable).values([
      { conventionId: conventions[0].id, name: "Jujutsu Kaisen Group", description: "Cursed energy and coordinated photos at the fountain.", characters: "Yuji · Megumi · Nobara · Gojo", meetingPlace: "North entrance", meetingTime: "Saturday · 13:00" },
      { conventionId: conventions[1].id, name: "Hyrule Heroes", description: "Looking for the full party for a group shoot.", characters: "Link · Zelda · Ganondorf · Midna", meetingPlace: "Hall 2, photo wall", meetingTime: "Sunday · 11:30" },
    ]).returning();
    await db.insert(groupMembersTable).values([
      { groupId: groups[0].id, userId: users[0].id },
      { groupId: groups[1].id, userId: users[2].id },
    ]);
    await db.insert(photoshootsTable).values([
      { conventionId: conventions[0].id, title: "JJK Cursed Energy Shoot", date: "2027-03-06", time: "15:30", location: "Fountain courtyard", description: "A relaxed shoot for all JJK characters. Photographers welcome.", rsvpCount: 18 },
      { conventionId: conventions[1].id, title: "Cosplay Portrait Walk", date: "2027-03-21", time: "12:00", location: "Main atrium", description: "Bring your favorite look and find a photographer pairing.", rsvpCount: 11 },
    ]);
    await db.insert(postsTable).values([
      { userId: users[0].id, body: "Progress check: the Nobara hammer is finally painted. See you at Made in Asia?", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80", likes: 42, comments: 8 },
      { userId: users[1].id, body: "I just found the perfect boots for my Sailor Jupiter build. Convention season is officially on.", imageUrl: null, likes: 28, comments: 4 },
      { userId: users[2].id, body: "Photographers: what is your favorite convention lens setup?", imageUrl: null, likes: 19, comments: 12 },
    ]);
  })();
  return seedPromise;
}

async function currentUser(req: Request) {
  const clerkId = getAuth(req).userId ?? "demo_user";
  const found = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  if (found[0]) return found[0];
  const created = await db.insert(usersTable).values({
    clerkId,
    username: `cosyn_${clerkId.slice(-6)}`,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=80",
    bio: "New to Cosyn. Looking for my next convention crew.",
    country: "",
  }).returning();
  return created[0];
}

async function userView(userId: number) {
  const user = (await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1))[0];
  if (!user) throw new Error("User not found");
  const [attendance, posts, friends] = await Promise.all([
    db.select({ value: count() }).from(attendanceTable).where(eq(attendanceTable.userId, userId)),
    db.select({ value: count() }).from(postsTable).where(eq(postsTable.userId, userId)),
    db.select({ value: count() }).from(friendsTable).where(eq(friendsTable.userId, userId)),
  ]);
  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    country: user.country,
    friendsCount: Number(friends[0]?.value ?? 0),
    conventionsAttended: Number(attendance[0]?.value ?? 0),
    cosplayPosts: Number(posts[0]?.value ?? 0),
  };
}

async function conventionView(id: number, userId?: number) {
  const convention = (await db.select().from(conventionsTable).where(eq(conventionsTable.id, id)).limit(1))[0];
  if (!convention) return null;
  const attendeeCount = await db.select({ value: count() }).from(attendanceTable).where(eq(attendanceTable.conventionId, id));
  const mine = userId
    ? await db.select({ id: attendanceTable.id }).from(attendanceTable).where(and(eq(attendanceTable.conventionId, id), eq(attendanceTable.userId, userId))).limit(1)
    : [];
  return { ...convention, attendeeCount: Number(attendeeCount[0]?.value ?? 0), isAttending: Boolean(mine.length) };
}

async function postView(id: number, userId: number) {
  const row = (await db.select({ post: postsTable, user: usersTable }).from(postsTable).innerJoin(usersTable, eq(postsTable.userId, usersTable.id)).where(eq(postsTable.id, id)).limit(1))[0];
  if (!row) return null;
  return {
    id: row.post.id,
    author: await userView(row.user.id),
    body: row.post.body,
    imageUrl: row.post.imageUrl,
    createdAt: row.post.createdAt.toISOString(),
    likes: row.post.likes,
    comments: row.post.comments,
    likedByMe: false,
  };
}

async function groupView(id: number, userId: number) {
  const group = (await db.select().from(groupsTable).where(eq(groupsTable.id, id)).limit(1))[0];
  if (!group) return null;
  const members = await db.select({ value: count() }).from(groupMembersTable).where(eq(groupMembersTable.groupId, id));
  const joined = await db.select({ id: groupMembersTable.id }).from(groupMembersTable).where(and(eq(groupMembersTable.groupId, id), eq(groupMembersTable.userId, userId))).limit(1);
  return { ...group, memberCount: Number(members[0]?.value ?? 0), joined: Boolean(joined.length) };
}

async function photoshootView(id: number, userId: number) {
  const shoot = (await db.select().from(photoshootsTable).where(eq(photoshootsTable.id, id)).limit(1))[0];
  if (!shoot) return null;
  const joined = await db.select({ id: photoRsvpsTable.id }).from(photoRsvpsTable).where(and(eq(photoRsvpsTable.photoshootId, id), eq(photoRsvpsTable.userId, userId))).limit(1);
  return { ...shoot, joined: Boolean(joined.length) };
}

router.get("/dashboard", async (req, res) => {
  await ensureSeeded();
  const user = await currentUser(req);
  const all = await db.select().from(conventionsTable).orderBy(asc(conventionsTable.startDate));
  const views = await Promise.all(all.map((item) => conventionView(item.id, user.id)));
  const feed = await db.select({ id: postsTable.id }).from(postsTable).orderBy(desc(postsTable.createdAt)).limit(3);
  const posts = (await Promise.all(feed.map((post) => postView(post.id, user.id)))).filter(Boolean);
  res.json({
    user: await userView(user.id),
    trending: views.filter(Boolean).slice(0, 3),
    featured: views.filter((item) => item?.featured).slice(0, 3),
    upcoming: views.filter(Boolean).slice(0, 4),
    feed: posts,
  });
});

router.get("/conventions", async (req, res) => {
  await ensureSeeded();
  const filters = ListConventionsQueryParams.parse(req.query);
  const user = await currentUser(req);
  const all = await db.select().from(conventionsTable).orderBy(asc(conventionsTable.startDate));
  const filtered = all.filter((item) => {
    const text = `${item.name} ${item.city} ${item.country} ${item.category}`.toLowerCase();
    return (!filters.search || text.includes(filters.search.toLowerCase()))
      && (!filters.country || item.country.toLowerCase() === filters.country.toLowerCase())
      && (!filters.city || item.city.toLowerCase() === filters.city.toLowerCase())
      && (!filters.category || item.category.toLowerCase() === filters.category.toLowerCase())
      && (!filters.date || item.startDate >= filters.date);
  });
  res.json((await Promise.all(filtered.map((item) => conventionView(item.id, user.id)))).filter(Boolean));
});

router.post("/conventions", async (req, res) => {
  await ensureSeeded();
  const input = CreateConventionBody.parse(req.body);
  const created = await db.insert(conventionsTable).values({ ...input, organizer: "Cosyn Community" }).returning();
  res.status(201).json(await conventionView(created[0].id));
});

router.get("/conventions/:id", async (req, res) => {
  await ensureSeeded();
  const { id } = GetConventionParams.parse(req.params);
  const user = await currentUser(req);
  const convention = await conventionView(id, user.id);
  if (!convention) {
    res.status(404).json({ error: "Convention not found" });
    return;
  }
  const chat = (await db.select().from(chatsTable).where(eq(chatsTable.conventionId, id)).limit(1))[0];
  const groups = await db.select({ id: groupsTable.id }).from(groupsTable).where(eq(groupsTable.conventionId, id));
  const photos = await db.select({ id: photoshootsTable.id }).from(photoshootsTable).where(eq(photoshootsTable.conventionId, id));
  res.json({
    ...convention,
    chat: chat ? { id: chat.id, conventionId: id, name: chat.name, lastMessage: "", unreadCount: 0, memberCount: convention.attendeeCount } : { id: 0, conventionId: id, name: "General", lastMessage: "", unreadCount: 0, memberCount: convention.attendeeCount },
    groups: (await Promise.all(groups.map((item) => groupView(item.id, user.id)))).filter(Boolean),
    photoshoots: (await Promise.all(photos.map((item) => photoshootView(item.id, user.id)))).filter(Boolean),
  });
});

router.get("/conventions/:id/attendees", async (req, res) => {
  await ensureSeeded();
  const { id } = GetConventionParams.parse(req.params);
  const rows = await db.select({ attendance: attendanceTable, user: usersTable })
    .from(attendanceTable)
    .innerJoin(usersTable, eq(attendanceTable.userId, usersTable.id))
    .where(eq(attendanceTable.conventionId, id));
  res.json(rows.map(({ attendance, user }) => ({
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    cosplayCharacter: attendance.cosplayCharacter,
    fandom: attendance.fandom,
    progress: attendance.cosplayProgress,
  })));
});

router.post("/conventions/:id/attendance", async (req, res) => {
  await ensureSeeded();
  const { id } = MarkAttendanceParams.parse(req.params);
  const input = MarkAttendanceBody.parse(req.body ?? {});
  const user = await currentUser(req);
  const existing = await db.select({ id: attendanceTable.id }).from(attendanceTable).where(and(eq(attendanceTable.conventionId, id), eq(attendanceTable.userId, user.id))).limit(1);
  if (!existing.length) {
    await db.insert(attendanceTable).values({ conventionId: id, userId: user.id, cosplayCharacter: input.cosplayCharacter ?? "", fandom: input.fandom ?? "", cosplayProgress: input.cosplayProgress ?? "Planning", cosplayPictureUrl: input.cosplayPictureUrl });
  } else {
    await db.update(attendanceTable).set({ cosplayCharacter: input.cosplayCharacter ?? "", fandom: input.fandom ?? "", cosplayProgress: input.cosplayProgress ?? "Planning", cosplayPictureUrl: input.cosplayPictureUrl }).where(eq(attendanceTable.id, existing[0].id));
  }
  res.status(201).json({ id: user.id, username: user.username, avatarUrl: user.avatarUrl, cosplayCharacter: input.cosplayCharacter ?? "", fandom: input.fandom ?? "", progress: input.cosplayProgress ?? "Planning" });
});

router.get("/feed", async (req, res) => {
  await ensureSeeded();
  const user = await currentUser(req);
  const rows = await db.select({ id: postsTable.id }).from(postsTable).orderBy(desc(postsTable.createdAt)).limit(20);
  res.json((await Promise.all(rows.map((row) => postView(row.id, user.id)))).filter(Boolean));
});

router.post("/feed", async (req, res) => {
  await ensureSeeded();
  const input = CreatePostBody.parse(req.body);
  const user = await currentUser(req);
  const created = await db.insert(postsTable).values({ userId: user.id, body: input.body, imageUrl: input.imageUrl ?? null }).returning();
  res.status(201).json(await postView(created[0].id, user.id));
});

router.post("/feed/:id/like", async (req, res) => {
  await ensureSeeded();
  const { id } = TogglePostLikeParams.parse(req.params);
  const current = (await db.select({ likes: postsTable.likes }).from(postsTable).where(eq(postsTable.id, id)).limit(1))[0];
  if (!current) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  await db.update(postsTable).set({ likes: current.likes + 1 }).where(eq(postsTable.id, id));
  res.json(await postView(id, (await currentUser(req)).id));
});

router.get("/chats", async (req, res) => {
  await ensureSeeded();
  const chats = await db.select().from(chatsTable).orderBy(asc(chatsTable.id));
  const result = await Promise.all(chats.map(async (chat) => {
    const memberCount = await db.select({ value: count() }).from(attendanceTable).where(eq(attendanceTable.conventionId, chat.conventionId));
    const latest = await db.select().from(messagesTable).where(eq(messagesTable.chatId, chat.id)).orderBy(desc(messagesTable.createdAt)).limit(1);
    return { id: chat.id, conventionId: chat.conventionId, name: chat.name, lastMessage: latest[0]?.body ?? "Start the conversation", unreadCount: 0, memberCount: Number(memberCount[0]?.value ?? 0) };
  }));
  res.json(result);
});

router.get("/chats/:id/messages", async (req, res) => {
  await ensureSeeded();
  const { id } = ListMessagesParams.parse(req.params);
  const user = await currentUser(req);
  const rows = await db.select({ message: messagesTable, user: usersTable })
    .from(messagesTable)
    .innerJoin(usersTable, eq(messagesTable.userId, usersTable.id))
    .where(eq(messagesTable.chatId, id))
    .orderBy(asc(messagesTable.createdAt));
  res.json(await Promise.all(rows.map(async ({ message, user: author }) => ({
    id: message.id, chatId: message.chatId, author: await userView(author.id), body: message.body, createdAt: message.createdAt.toISOString(), reactions: message.reactions,
  }))));
});

router.post("/chats/:id/messages", async (req, res) => {
  await ensureSeeded();
  const { id } = ListMessagesParams.parse(req.params);
  const input = CreateMessageBody.parse(req.body);
  const user = await currentUser(req);
  const created = await db.insert(messagesTable).values({ chatId: id, userId: user.id, body: input.body }).returning();
  res.status(201).json({ id: created[0].id, chatId: id, author: await userView(user.id), body: created[0].body, createdAt: created[0].createdAt.toISOString(), reactions: 0 });
});

router.get("/groups", async (req, res) => {
  await ensureSeeded();
  const params = ListGroupsQueryParams.parse(req.query);
  const user = await currentUser(req);
  const query = params.conventionId
    ? db.select({ id: groupsTable.id }).from(groupsTable).where(eq(groupsTable.conventionId, params.conventionId))
    : db.select({ id: groupsTable.id }).from(groupsTable);
  const rows = await query;
  res.json((await Promise.all(rows.map((row) => groupView(row.id, user.id)))).filter(Boolean));
});

router.post("/groups", async (req, res) => {
  await ensureSeeded();
  const input = CreateGroupBody.parse(req.body);
  const user = await currentUser(req);
  const group = (await db.insert(groupsTable).values(input).returning())[0];
  await db.insert(groupMembersTable).values({ groupId: group.id, userId: user.id });
  res.status(201).json(await groupView(group.id, user.id));
});

router.post("/groups/:id/join", async (req, res) => {
  await ensureSeeded();
  const { id } = JoinGroupParams.parse(req.params);
  const user = await currentUser(req);
  const existing = await db.select({ id: groupMembersTable.id }).from(groupMembersTable).where(and(eq(groupMembersTable.groupId, id), eq(groupMembersTable.userId, user.id))).limit(1);
  if (!existing.length) await db.insert(groupMembersTable).values({ groupId: id, userId: user.id });
  res.json(await groupView(id, user.id));
});

router.get("/photoshoots", async (req, res) => {
  await ensureSeeded();
  const params = ListPhotoshootsQueryParams.parse(req.query);
  const user = await currentUser(req);
  const rows = params.conventionId
    ? await db.select({ id: photoshootsTable.id }).from(photoshootsTable).where(eq(photoshootsTable.conventionId, params.conventionId))
    : await db.select({ id: photoshootsTable.id }).from(photoshootsTable);
  res.json((await Promise.all(rows.map((row) => photoshootView(row.id, user.id)))).filter(Boolean));
});

router.post("/photoshoots", async (req, res) => {
  await ensureSeeded();
  const input = CreatePhotoshootBody.parse(req.body);
  const user = await currentUser(req);
  const shoot = (await db.insert(photoshootsTable).values(input).returning())[0];
  res.status(201).json(await photoshootView(shoot.id, user.id));
});

export default router;