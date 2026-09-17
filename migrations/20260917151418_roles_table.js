export async function up(knex) {
  await knex.schema.createTable("roles", (table) => {
    table.increments("role_id").primary();

    table.string("role_name", 20)
        .notNullable()
        .unique();

    table.timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now());
  })
};
export async function down(knex) {
  await knex.schema.dropTableIfExists("roles");
};
