/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("users", (table) => {
    table
        .string("contact_number", 20).nullable();
  })
}

/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("contact_number")
  });
}
