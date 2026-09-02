/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  // await knex('user_roles').del()
  await knex('user_roles').insert({
    user_id: 1,
    role_id: 3,
    updated_by: 1
  });
/* const role = await knex("roles")
    .where({ role_name: "super_admin" })
    .first();

const user = await knex("users")
    .where({ email: "richard.regala@netrust.com.ph" })
    .first();

await knex("user_roles").insert({
    user_id: user.id,
    role_id: role.id,
    updated_by: user.id
}); */
};
/* export async function seed(knex) {
  const dbInfo = await knex.raw(`
    SELECT 
      current_database() AS database,
      current_schema() AS schema
  `);
  console.log(dbInfo.rows);
  const users = await knex('users').select('*');
  console.log('USERS:', users);
  const roles = await knex('roles').select('*');
  console.log('ROLES:', roles);
  await knex('user_roles').del();
  await knex('user_roles').insert({
    user_id: 5,
    role_id: 6,
    updated_by: 5
  });
} */