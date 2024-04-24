const {up, down} = require("../db_helpers");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  // await knex("users").del();
  // await knex("offers").del();
  // await knex("groups").del();
  // await knex("companies").del();
  // await knex("colleges").del();


  const data = require("./seed_data.json");
  for (const [key, val] of Object.entries(data)) {
    // await knex.raw('ALTER TABLE ' + key + ' AUTO_INCREMENT = 1');
    await knex(key).insert(val);
  }
};
