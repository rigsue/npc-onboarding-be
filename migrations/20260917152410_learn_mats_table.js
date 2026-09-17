export async function up(knex) {

  await knex.schema.createTable("learning_materials", (table) => {
    table.increments("learn_mat_id").primary();

    table.integer("learn_mod_id")
        .notNullable()
        .references("learn_mod_id")
        .inTable("learning_module")
        .onDelete("RESTRICT");

    table.string("title", 100).notNullable();
    table.string("description", 200).nullable();

    table.integer("min_duration_minutes")
        .notNullable()
        .defaultTo(5);

    table.string("material_type", 50).notNullable();

    table.string("original_file_name", 255).nullable();
    table.string("storage_key", 500).nullable();
    table.string("mime_type", 100).nullable();
    table.bigInteger("file_size").nullable();

    table.string("content_url", 500).nullable();

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

    table.unique(["learn_mod_id", "display_order"])

  })
};
export async function down(knex) {
  await knex.schema.dropTableIfExists("learning_materials");
};
