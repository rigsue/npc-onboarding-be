export async function up(knex) {
    
  await knex.schema.createTable("user_progress", (table) => {
    table.increments("user_progress_id").primary();

    table.integer("user_id")
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");

    table.integer("learn_mod_id")
        .notNullable()
        .references("learn_mod_id")
        .inTable("learning_module")
        .onDelete("CASCADE");

    table.integer("progress_percentage")
        .notNullable().
        defaultTo(0);
    
    table.string("status", 20)
        .notNullable()
        .defaultTo("pending")
    
    table.timestamp("started_at")
        .notNullable();

    table.timestamp("completed_at")
        .nullable();

    table.timestamp("updated_at")
        .nullable()
        .defaultTo(knex.fn.now());

    table.unique(["user_id", "learn_mod_id"]);
  });
}
export async function down(knex) {
  await knex.schema.dropTableIfExists("user_progress");
};
