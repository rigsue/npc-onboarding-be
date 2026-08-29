/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary();

    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());
    table.integer("created_by").nullable().references("user_id").inTable("users");
    table.integer("updated_by").nullable().references("user_id").inTable("users");
  })
};

/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("users");
};
