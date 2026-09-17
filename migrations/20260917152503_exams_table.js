export async function up(knex) {
  
  await knex.schema.createTable("exams", (table) => {
    table.increments("exam_id").primary();

    table.integer("learn_mod_id")
        .notNullable()
        .references("learn_mod_id")
        .inTable("learning_module")
        .onDelete("CASCADE");

    table.string("title", 100).notNullable();

    table.integer("passing_score")
        .notNullable()
        .checkBetween([0, 100]);

    table.integer("attempt_limit").nullable();

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

    table.unique(["learn_mod_id", "title"])
  })
};
export async function down(knex) {
  await knex.schema.dropTableIfExists("exams");
};