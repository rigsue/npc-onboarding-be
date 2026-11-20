export async function up(knex) {
    await knex.schema.createTable("user_sessions", (table) => {
        table.uuid("session_id").primary();

        table.integer("user_id")
            .notNullable()
            .references("user_id")
            .inTable("users")
            .onDelete("CASCADE");
        
        // sha-256 hash refresh token
        table.string("refresh_token_hash", 64)
            .notNullable();

        table.text("user_agent").nullable();

        table.string("ip_address", 45).nullable();
        
        table.timestamp("created_at", { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());

        table.timestamp("last_used_at", { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());

        table.timestamp("expires_at", {useTz: true})
            .notNullable();

        table.timestamp("revoked_at", { useTz: true })
            .nullable();

        table.string("revoke_reason", 100)
            .nullable();
        
        table.index(["user_id"]);
        table.index(["expires_at"])
        table.index(["user_id", "revoked_at"]);
    });
};

export async function down(knex) {
    await knex.schema.dropTableIfExists("user_sessions");
};