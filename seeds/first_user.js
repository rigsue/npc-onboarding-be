import bcrypt from "bcrypt"

export async function seed(knex) {

  const password = process.env.INITIAL_ADMIN_PW;

  if (!password) {
    throw new Error("Initial password undefined");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await knex.transaction(async (trx) => {
    const [user] = await trx("users")
      .insert({
        first_name: "Richard",
        last_name: 'Regala',
        email: 'richardbregala60521@gmail.com',
        password_hash: passwordHash,
        is_active: true,
        department_id: 19,
        contact_number: "+639123456789",
      })
      .returning("user_id");

      await trx("user_roles").insert({
        user_id: user.user_id,
        role_id: 6,
        updated_by: user.user_id
      });
});
}
