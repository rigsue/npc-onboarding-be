/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("user_roles", (table) => {
    table.increments("user_role_id").primary();

    table.integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");

    table.integer("role_id")
        .unsigned()
        .notNullable()
        .references("role_id")
        .inTable("roles")
        .onDelete("CASCADE");
    
    table.integer("updated_by")
        .notNullable()
        .references("user_id")
        .inTable("users");

    table.timestamp("updated_at")
        .notNullable()
        .defaultTo(knex.fn.now());

    table.unique(["user_id", "role_id"]);
  })
};

/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("user_roles");
};
