/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex ('users').del();

  await knex('users').insert([
    {
      username: 'James Kelley',
      password: 'password'
    }
  ]);
  console.log("Default user added to the database");
};
