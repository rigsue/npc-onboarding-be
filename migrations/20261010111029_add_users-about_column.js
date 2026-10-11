export async function up(knex) {
  await knex.schema.alterTable("users", function(table) {

    table.text("abou_me");
  });
}


export async function down(knex) {
  await knex.schema.alterTable("users", function(table) {
    table.dropcoloumn("about_me");
  });
}
