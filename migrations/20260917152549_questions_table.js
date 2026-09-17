export async function up(knex) {
    
  await knex.schema.createTable("questions", (table) => {
    table.increments("question_id").primary();

    table.integer("exam_id")
        .notNullable()
        .references("exam_id")
        .inTable("exams")
        .onDelete("RESTRICT");

    table.string("question", 500).notNullable();
    table.string("question_type", 100).notNullable();

    table.integer("points")
        .nullable()
        .defaultTo(1)
        .checkPositive();

    table.integer("display_order").notNullable();
    table.boolean("is_active").notNullable().defaultTo(true);

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

    table.unique(["exam_id", "display_order"]);
  });
};
export async function down(knex) {
  await knex.schema.dropTableIfExists("questions");
};
