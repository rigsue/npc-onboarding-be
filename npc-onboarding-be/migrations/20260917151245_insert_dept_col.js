export async function up(knex) {
  await knex.schema.alterTable("users", (table) => {
    table
        .integer("department_id")
        .notNullable()
        .references("department_id")
        .inTable("departments")
        .onDelete("RESTRICT");
  });
}
export async function down(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("department_id")
  });
}
