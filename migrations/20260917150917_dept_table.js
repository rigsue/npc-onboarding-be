/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("departments", (table) => {
    table.increments("department_id").primary();

    table.string("department_name", 100).notNullable().unique();
    table.string("description", 250).nullable();
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.integer("created_by")
        .nullable()
        .references("user_id")
        .inTable("users")
        .onDelete("SET NULL");

    table.integer("updated_by")
        .nullable()
        .references("user_id")
        .inTable("users")
        .onDelete("SET NULL");
  });
}

/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("departments");
};
