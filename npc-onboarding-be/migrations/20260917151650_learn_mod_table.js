export async function up(knex) {
  
  await knex.schema.createTable("learning_module", (table) => {
    table.increments("learn_mod_id").primary();

    table.string("title", 100).notNullable();
    table.text("description").nullable();
    table.integer("display_order")
        .notNullable()
        .defaultTo(0);

    table.integer("department_id")
        .notNullable()
        .references("department_id")
        .inTable("departments")
        .onDelete("RESTRICT");

    table.integer("expected_duration_minutes")
        .notNullable()
        .defaultTo(30)
        .checkPositive();

    table.integer("time_limit_minutes")
        .nullable()
        .checkPositive();

    table.boolean("is_active")
        .notNullable()
        .defaultTo(true);

    table.integer("created_by")
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("RESTRICT");

    table.timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now());

    table.integer("updated_by")
        .nullable()
        .references("user_id")
        .inTable("users")
        .onDelete("SET NULL");
        
    table.timestamp("updated_at")
        .notNullable()
        .defaultTo(knex.fn.now());
  });
}
export async function down(knex) {
  await knex.schema.dropTableIfExists("learning_module");
};
