import bcrypt from "bcrypt"
/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries

  const password = process.env.INITIAL_ADMIN_PW;

  // await knex('users').del()

  if (!password) {
    throw new Error("Initial password undefined");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await knex('users').insert({
    first_name: "Richard",
    last_name: 'Regala',
    email: 'richard.regala@netrust.com.ph',
    password_hash: passwordHash
});
};
