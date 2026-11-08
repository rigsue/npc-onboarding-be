export async function up(knex) {
  await knex.schema.createTable("user_material_progress", (table) => {
    table.increments("user_material_progress_id").primary();

    table.integer("user_id")
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");

    table.integer("learn_mat_id")
        .notNullable()
        .references("learn_mat_id")
        .inTable("learning_materials")
        .onDelete("CASCADE");

    table.integer("progress_percentage")
        .notNullable()
        .defaultTo(0)
        .checkBetween([0, 100]);

    table.integer("time_spent_minutes")
        .notNullable()
        .defaultTo(0)
        .checkBetween([0, 2147483647]);

    table.string("status", 30)
        .notNullable()
        .defaultTo("pending");

    table.timestamp("started_at").nullable();
    table.timestamp("completed_at").nullable();
    table.timestamp("last_accessed_at").nullable();

    table.timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now());

    table.timestamp("updated_at")
        .notNullable()
        .defaultTo(knex.fn.now());

    table.unique(["user_id", "learn_mat_id"]);

    table.index(["user_id", "status"]);

    table.index(["learn_mat_id"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("user_material_progress");
}