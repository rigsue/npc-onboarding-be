export async function up(knex) {
  await knex.schema.createTable("exam_attempts", (table) => {
    table.increments("exam_attempt_id").primary();

    table.integer("exam_id")
        .notNullable()
        .references("exam_id")
        .inTable("exams")
        .onDelete("RESTRICT");

    table.integer("user_progress_id")
        .notNullable()
        .references("user_progress_id")
        .inTable("user_progress")
        .onDelete("RESTRICT");

    table.integer("attempt_number")
        .notNullable()
        .checkPositive();

    table.integer("score").notNullable();
    table.integer("total_points").notNullable();
    table.decimal("percentage", 5, 2).notNullable();
    table.boolean("is_passed").notNullable().defaultTo(false);

    table.string("status", 30)
        .notNullable()
        .defaultTo("in_progress");

    table.timestamp("started_at")
        .notNullable()
        .defaultTo(knex.fn.now());

    table.timestamp("completed_at").nullable();


    table.unique(["exam_id", "user_progress_id", "attempt_number"]);
  });
};

export async function down(knex) {
  await knex.schema.dropTableIfExists("exam_attempts");
};
