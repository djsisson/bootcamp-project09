"use server";

import { db } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export const upsertTags = async (msgid, msg, editmsg = false) => {
  const tags = msg.toLowerCase().match(/#[\p{L}0-9-_]+/giu);

  if (tags.length == 0) return;
  tags.forEach((x) => revalidatePath(`/posts/tags/${x.slice(1)}`));

  const client = await db.connect();

  if (editmsg) {
    client.sql`DELETE FROM nextmessage_tags WHERE msg_id = ${msgid};`;
  }

  await client.sql`INSERT INTO nexthashtag (tag) (SELECT DISTINCT tag FROM unnest(${tags}::text[]) as tag) ON CONFLICT DO NOTHING;`;

  await client.sql` INSERT INTO nextmessage_tags (SELECT m.id as msg_id, tag_id FROM nextmessages AS m CROSS JOIN (select t.id as tag_id from nexthashtag as t WHERE t.tag = ANY(${tags})) WHERE m.id = ${msgid});`;
  await client.end();
};
