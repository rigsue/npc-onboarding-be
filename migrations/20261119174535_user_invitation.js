export async function  up(knex) {
    await knex.schema.createTable("user_invitations", (table) => {
        table.increments("invitation_id").primary();

        table.integer("user_id")
            .notNullable()
            .references("user_id")
            .inTable("users")
            .onDelete("CASCADE");
        
        table.string("token_hash", 64)
            .notNullable()
            .unique();

        table.timestamp("expires_at", { useTz: true })
            .notNullable();
        
        table.timestamp("used_at", { useTz: true })
            .nullable();

        table.timestamp("revoked_at", { useTz: true })
            .nullable();

        table.timestamp("created_at", { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());

        table.index(["user_id"]);
        table.index(["expires_at"]);
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("user_invitations");
}