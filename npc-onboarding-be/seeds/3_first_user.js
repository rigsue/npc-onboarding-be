import bcrypt from "bcrypt"

export async function seed(knex) {

  const password = process.env.INITIAL_ADMIN_PW;

  if (!password) {
    throw new Error("Initial password undefined");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await knex.transaction(async (trx) => {

    const [role] = await trx("roles")
      .select("role_id")
      .where({ role_name: "Super admin" })
      .limit(1);

    if(!role) {
      throw new Error("Super admin role not found");
    }

    const [department] = await trx("departments")
      .select("department_id")
      .where({
        department_name: "Service Delivery",
      })
      .limit(1);

      if(!department) {
        throw new Error(
          "Service Delivery not found"
        );
      }

    const [user] = await trx("users")
      .insert({
        employee_number: "N0187",
        first_name: "Richard",
        last_name: 'Regala',
        email: 'richardbregala60521@gmail.com',
        contact_number: "+639123456789",
        position: "IT",
        password_hash: passwordHash,
        is_active: true,
        department_id: department.department_id,
      })
      .returning("user_id");

      await trx("user_roles").insert({
        user_id: user.user_id,
        role_id: role.role_id,
        updated_by: user.user_id
      });
});
}
