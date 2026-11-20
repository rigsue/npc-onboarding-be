export async function up(knex) {
  await knex.schema.createTable("notification_recipients", (table) => {
    table.increments("notification_recipient_id").primary();

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
    
    table.string("email_status", 20)
      .nullable()
      .defaultTo("pending");

    table.timestamp("email_sent_at", { useTz: true })
      .nullable();

    table.text("email_error").nullable();

    table
      .boolean("is_read")
      .notNullable()
      .defaultTo(false);

    table
      .timestamp("read_at", { useTz: true })
      .nullable();

    table
      .timestamp("received_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.unique([
      "notification_id", "user_id",
    ]);

    table.index(["user_id", "is_read"]);
  });
};

export async function down(knex) {
  await knex.schema.dropTableIfExists("notification_recipients");
};