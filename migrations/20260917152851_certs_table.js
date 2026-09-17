export async function up(knex) {
    
  await knex.schema.createTable("certificates", (table) => {
    table.increments("cert_id").primary();

    table.integer("user_progress_id")
        .notNullable()
        .references("user_progress_id")
        .inTable("user_progress")
        .onDelete("CASCADE");

    table.string("cert_number", 250).notNullable().unique();
    table.string("cert_verification", 250).notNullable().unique();

    table.timestamp("issue_at")
        .notNullable()
        .defaultTo(knex.fn.now());

    table.timestamp("expires_at").nullable();

    table.boolean("is_revoked")
        .notNullable()
        .defaultTo(false);
    
    table.integer("user_id")
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
    
    table.timestamp("revoked_at").nullable();

    table.string("revoked_reason", 500).nullable();
    table.string("cert_file", 500).notNullable();
    table.string("temp_version", 100).notNullable();

    table.timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now());
    
    table.unique(["user_progress_id", "user_id"]);
  });
};
export async function down(knex) {
  await knex.schema.dropTableIfExists("certificates");
};
