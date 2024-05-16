import { faker } from "@faker-js/faker";
import { icons, themes } from "./seed_data.js";

const randomWords = () => {
  const words = [];
  for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
    words.push(`#${faker.lorem.word()}`);
  }
  return words;
};

const randomMessage = () => {
  return faker.lorem.sentences({ min: 1, max: 3 }, "\n");
};

const randomName = () => {
  const first_name = faker.person.firstName();
  const last_name = faker.person.lastName();
  const email = faker.internet.email({
    firstName: first_name,
    lastName: last_name,
  });
  const username = `${faker.word.adjective()}_${faker.word.noun()}`.replace(
    " ",
    ""
  );
  const bio = faker.person.bio();

  return {
    username: username.toLowerCase().replace("'", "''"),
    first_name: first_name.replace("'", "''"),
    last_name: last_name.replace("'", "''"),
    email: email.replace("'", "''"),
    bio: bio,
  };
};

export const addThemes = async (client) => {
  await client.query(
    `INSERT INTO nextthemes (name, colour, path) SELECT name, colour, path FROM json_populate_recordset(NULL::nextthemes, $1);`,
    [JSON.stringify(themes)]
  );
};

export const addIcons = async (client) => {
  await client.sql`create type icontemp as (name text, path text, theme_name text);`;
  await client.query(
    `INSERT INTO nexticons (name, path, theme_id) SELECT i.name, i.path, t.id as theme_id FROM json_populate_recordset(NULL::icontemp, $1) AS i JOIN nextthemes AS t ON t.name = i.theme_name;`,
    [JSON.stringify(icons)]
  );
  await client.sql`DROP type icontemp;`;
};

export const addUsers = async (client) => {
  const { rows: icons } = await client.sql`SELECT * FROM nexticons`;
  const users = [];
  for (let i = 0; i < 100; i++) {
    users.push({
      ...randomName(),
      imglink: icons[Math.floor(Math.random() * icons.length)].path,
      clerk_id: `testuser${i}`,
    });
  }
  await client.query(
    `INSERT INTO nextusers (clerk_id, username, first_name, last_name, email, imglink, bio) SELECT clerk_id, username, first_name, last_name, email, imglink, bio FROM json_populate_recordset(NULL::nextusers, $1);`,
    [JSON.stringify(users)]
  );
};

const generateMessage = async (client, nummsg = 100) => {
  const { rows: icons } = await client.sql`select u.id, t.name
  from nextusers u
  join nexticons i on u.imglink = i.path
  join nextthemes t on t.id = i.theme_id;`;

  const msgs = [];
  const allTags = [];
  for (let i = 0; i < nummsg; i++) {
    const userId = Math.floor(Math.random() * 100);
    const rndTags = [...randomWords(), `#${icons[userId].name.toLowerCase()}`];
    const msgToSend = {
      message: `${randomMessage()} ${rndTags.join(" ")}`,
      created:
        faker.date.recent({ days: 365 }).toISOString().slice(0, -5) + "Z",
      user_id: icons[userId].id,
    };
    msgs.push(msgToSend);
    allTags.push(rndTags);
  }

  return { msgs: msgs, allTags: allTags };
};

export const addMessages = async (client) => {
  const { msgs, allTags } = await generateMessage(client, 100);

  const { rows: msgIds } = await client.query(
    `INSERT INTO nextmessages (message, created, user_id) SELECT message, created, user_id FROM json_populate_recordset(NULL::nextmessages, $1) RETURNING id;`,
    [JSON.stringify(msgs)]
  );

  const { rows: tagIds } =
    await client.sql`INSERT INTO nexthashtag (tag) (SELECT DISTINCT tag FROM unnest(${allTags.flat()}::text[]) as tag) ON CONFLICT DO NOTHING RETURNING *;`;

  const junction = msgIds
    .map((x, i) =>
      allTags[i].map((y) => ({
        msg_id: x.id,
        tag_id: tagIds.find((z) => z.tag == y)?.id,
      }))
    )
    .flat();

  await client.query(
    `INSERT INTO nextmessage_tags (msg_id, tag_id) SELECT DISTINCT msg_id, tag_id FROM json_populate_recordset(NULL::nextmessage_tags, $1);`,
    [JSON.stringify(junction)]
  );
};

export const addComments = async (client) => {
  const { msgs, allTags } = await generateMessage(client, 200);

  const { rows: allMsgs } = await client.sql`SELECT id FROM nextmessages`;

  const comments = msgs.map((x, i) => ({
    ...x,
    parent_id: allMsgs[Math.floor(i / 2)].id,
  }));

  await client.sql`INSERT INTO nexthashtag (tag) (SELECT DISTINCT tag FROM unnest(${allTags.flat()}::text[]) as tag) ON CONFLICT DO NOTHING;`;

  const { rows: tagIds } =
    await client.sql`select * from nexthashtag as t WHERE t.tag = ANY(${allTags.flat()})`;

  const { rows: msgIds } = await client.query(
    `INSERT INTO nextmessages (message, created, parent_id, user_id) SELECT message, created, parent_id, user_id FROM json_populate_recordset(NULL::nextmessages, $1) RETURNING id;`,
    [JSON.stringify(comments)]
  );

  const junction = msgIds
    .map((x, i) =>
      allTags[i].map((y) => ({
        msg_id: x.id,
        tag_id: tagIds.find((z) => z.tag == y)?.id,
      }))
    )
    .flat();

  await client.query(
    `INSERT INTO nextmessage_tags (msg_id, tag_id) SELECT DISTINCT msg_id, tag_id FROM json_populate_recordset(NULL::nextmessage_tags, $1);`,
    [JSON.stringify(junction)]
  );
};
