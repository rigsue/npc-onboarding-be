/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("employee_id").primary();

    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("password_hash", 100).notNullable();
    table.integer("role_id").notNullable();
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

  })
};

/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("users");
};
