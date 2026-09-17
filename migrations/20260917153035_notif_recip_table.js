export async function up(knex) {
  await knex.schema.createTable("notification_recipients", (table) => {
    
    table
      .increments("notification_recipient_id")
      .primary();

    table
      .integer("notification_id")
      .notNullable()
      .references("notification_id")
      .inTable("notifications")
      .onDelete("CASCADE");

    table
      .integer("user_id")
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .boolean("is_read")
      .notNullable()
      .defaultTo(false);

    table
      .timestamp("read_at")
      .nullable();

    table
      .timestamp("received_at")
      .notNullable()
      .defaultTo(knex.fn.now());

    table.unique([
      "notification_id",
      "user_id",
    ]);

    table.index([
      "user_id",
      "is_read",
    ]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("notification_recipients");
};