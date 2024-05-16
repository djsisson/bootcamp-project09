export const createTables = async (client) => {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
    CREATE TABLE IF NOT EXISTS nextthemes (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        colour TEXT NOT NULL UNIQUE,
        path TEXT NOT NULL UNIQUE )`;

    await client.sql`
    CREATE TABLE IF NOT EXISTS nexticons (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        path TEXT NOT NULL UNIQUE,
        theme_id UUID NOT NULL REFERENCES nextthemes (id)
            ON DELETE RESTRICT
            ON UPDATE RESTRICT)`;

    await client.sql`
    CREATE TABLE IF NOT EXISTS nextusers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        clerk_id TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        bio TEXT,
        imglink TEXT)`;

    await client.sql`
    CREATE TABLE IF NOT EXISTS nextmessages (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        message TEXT NOT NULL,
        created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated TIMESTAMP ,
        parent_id UUID REFERENCES nextmessages (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        user_id UUID NOT NULL REFERENCES nextusers (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE)`;

    await client.sql`
    CREATE TABLE IF NOT EXISTS nextlikes (
        msg_id UUID NOT NULL REFERENCES nextmessages (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        user_id UUID NOT NULL REFERENCES nextusers (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        PRIMARY KEY (msg_id, user_id))`;

    await client.sql`
    CREATE TABLE IF NOT EXISTS nexthashtag (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            tag TEXT NOT NULL UNIQUE)`;

    await client.sql`
    CREATE TABLE IF NOT EXISTS nextmessage_tags (
        msg_id UUID NOT NULL REFERENCES nextmessages(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        tag_id UUID NOT NULL REFERENCES nexthashtag(id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE,
        PRIMARY KEY (msg_id, tag_id)
      )`;

    await client.sql`
    CREATE TABLE IF NOT EXISTS nextuser_follows (
        user_id UUID NOT NULL REFERENCES nextusers(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        follow_id UUID NOT NULL REFERENCES nextusers(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        PRIMARY KEY (user_id, follow_id)
      )`;

    return;
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
};

export const dropTables = async (client) => {
  await client.sql`DROP TABLE IF EXISTS nextuser_follows
                CASCADE`;
  await client.sql`DROP TABLE IF EXISTS nextmessage_tags
                CASCADE`;
  await client.sql`DROP TABLE IF EXISTS nexthashtag
                CASCADE`;
  await client.sql`DROP TABLE IF EXISTS nextlikes
                CASCADE`;
  await client.sql`DROP TABLE IF EXISTS nextmessages
                CASCADE`;
  await client.sql`DROP TABLE IF EXISTS nextusers
                CASCADE`;
  await client.sql`DROP TABLE IF EXISTS nexticons
                CASCADE`;
  await client.sql`DROP TABLE IF EXISTS nextthemes
                 CASCADE`;
};
