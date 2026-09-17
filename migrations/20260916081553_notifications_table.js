export async function up(knex) {
  await knex.schema.createTable("notifications", (table) => {
    table.increments("notification_id").primary();

    table.integer("created_by")
        .nullable()
        .references("user_id")
        .inTable("users")
        .onDelete("SET NULL");

    table.integer("user_progress_id")
        .nullable()
        .references("user_progress_id")
        .inTable("user_progress")
        .onDelete("SET NULL");

    table.string("notifications_type", 50).notNullable();
    table.string("title", 50).notNullable();
    table.string("description", 250).nullable();

    table.timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now()); 
  })
};

export async function down(knex) {
  await knex.schema.dropTableIfExists("notifications");
};
