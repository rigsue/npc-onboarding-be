export async function up(knex) {

  await knex.schema.createTable("choices", (table) => {
    table.increments("choice_id").primary();

    table.integer("question_id")
        .notNullable()
        .references("question_id")
        .inTable("questions")
        .onDelete("CASCADE");

    table.string("choice_text", 500).notNullable();

    table.boolean("is_correct")
        .notNullable()
        .defaultTo(false);

    table.integer("display_order")
        .notNullable()
        .defaultTo(0);

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

    table.unique(["question_id", "display_order"]);
  });
};
export async function down(knex) {
  await knex.schema.dropTableIfExists("choices");
};
