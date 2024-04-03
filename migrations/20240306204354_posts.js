/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("companies", (table)=>{
        table.increments("company_id").notNullable();
        table.string("company_logo").notNullable();
        table.string("company_name").notNullable();
        table.string("company_website").notNullable();
        table.string("company_description").notNullable();
    })
    .createTable("offers", (table)=>{
        table.increments("offer_id").notNullable();
        table.string("offer_title").notNullable();
        table.string("offer_types").notNullable();
        table.string("offer_details").notNullable();
        table.dateTime("offer_expires").notNullable();
        table.integer("company_id").index()
        .references("company_id")
        .inTable("companies")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
    })
    .createTable("users", (table)=>{
        table.increments("user_id").notNullable();
        table.string("user_name").notNullable();
        table.string("user_role").notNullable();
    })
    .createTable("user_offers", (table)=>{
        table.increments("user_offer_id").notNullable();
        table.integer("user_id").index()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
        table.integer("offer_id").index()
        .references("offer_id")
        .inTable("offers")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable("user_offers")
    .dropTable("users")
    .dropTable("offers")
    .dropTable("companies")
};
