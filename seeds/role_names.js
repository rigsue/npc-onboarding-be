/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  // await knex("roles").del();
  await knex("roles").insert([
/*  {id: 1, colName: 'rowValue1'},
    {id: 2, colName: 'rowValue2'},
    {id: 3, colName: 'rowValue3'} */
/*     {role_name: "local_user"},
    {role_name: "admin"},
    {role_name: "super_admin"} */
  ])
};
