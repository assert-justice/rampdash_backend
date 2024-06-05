const {up, down} = require("../db_helpers");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {

  const data = require("./seed_data.json");
  for (const [key, val] of Object.entries(data)) {
    await knex(key).insert(val);
  }
};
