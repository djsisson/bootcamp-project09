"use server";

import { faker } from "@faker-js/faker";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const randomWords = () => {
  const words = [];
  for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
    words.push(`#${faker.lorem.word()}`);
  }
  return words;
};

export const randomMessage = () => {
  return faker.lorem.sentences({ min: 1, max: 3 }, "\n");
};

export const randomName = () => {
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

  return {
    username: username.toLowerCase().replace("'", "''"),
    first_name: first_name.replace("'", "''"),
    last_name: last_name.replace("'", "''"),
    email: email.replace("'", "''"),
  };
};

export const getUserIdFromClerkId = async () => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) return null;
  const { rows: id } =
    await sql`SELECT id FROM nextusers WHERE clerk_id = ${userId}`;
  return id[0].id;
};

export const deletePost = async (msgid: string) => {
  try {
    await sql`DELETE FROM nextmessages where id=${msgid}`;
    revalidatePath("/home");
  } catch (error) {
    console.log(error);
  }
};

export const refresh = async () => {
  revalidatePath("/home");
  return redirect("/home");
};

export const getUserData = async (userid: string) => {
  try {
    const { rows: data } =
      await sql`select u.id, u.username, u.bio, u.imglink, (select count(*) from nextmessages m where ${userid} = m.user_id) count_posts, (select count(*) from nextuser_follows f where f.user_id = ${userid}) count_following, (select count(*) from nextuser_follows f where f.follow_id = ${userid}) count_followers from nextusers u where u.id = ${userid}`;
    return data[0];
  } catch (error) {
    console.log(error);
    return {};
  }
};
