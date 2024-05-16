import { db } from "@vercel/postgres";
import { createTables, dropTables } from "./seed_create.js";
import {
  addThemes,
  addIcons,
  addUsers,
  addMessages,
  addComments,
} from "./seed_add_data.js";

async function main() {
  const client = await db.connect();
  try {
    await dropTables(client);
    await createTables(client);
    await addThemes(client);
    await addIcons(client);
    await addUsers(client);
    await addMessages(client);
    await addComments(client);
  } catch (error) {
    console.error(
      "An error occurred while attempting to create the database:",
      error
    );
  }
  client.release()
}

main();
