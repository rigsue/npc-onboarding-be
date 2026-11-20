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
        .notNullable()
        .defaultTo(0)
        .checkBetween([0, 100]);
    
    table.integer("total_time_spent_seconds")
        .notNullable()
        .defaultTo(0)
        .checkBetween([0, 2147483647]);
        
    table.string("status", 20)
        .notNullable()
        .defaultTo("pending");

    table.timestamp("due_at", { useTz: true })
        .nullable();

    table.integer("expected_duration_minutes")
        .nullable();
    
    table.timestamp("started_at", { useTz: true })
        .nullable();

    table.timestamp("completed_at", { useTz: true })
        .nullable();

    table.timestamp("updated_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());

    table.unique(["user_id", "learn_mod_id"]);
  });
};

export async function down(knex) {
  await knex.schema.dropTableIfExists("user_progress");
};
