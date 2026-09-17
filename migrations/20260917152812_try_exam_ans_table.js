export async function up(knex) {
  await knex.schema.createTable("exam_attempt_answers", (table) => {
    table.increments("attempt_answer_id").primary();

    table.integer("exam_attempt_id")
        .notNullable()
        .references("exam_attempt_id")
        .inTable("exam_attempts")
        .onDelete("RESTRICT");

    table.integer("question_id")
        .notNullable()
        .references("question_id")
        .inTable("questions")
        .onDelete("RESTRICT");
    
    table.integer("choice_id")
        .nullable()
        .references("choice_id")
        .inTable("choices")
        .onDelete("RESTRICT");

    table.text("answer_text").nullable();
    table.boolean("is_correct").nullable();
    table.decimal("points_awarded").nullable();

    table.timestamp("answered_at")
        .notNullable()
        .defaultTo(knex.fn.now());

    table.unique([ "exam_attempt_id", "question_id"]);
  });
};
export async function down(knex) {
  await knex.schema.dropTableIfExists("exam_attempt_answers");
};
