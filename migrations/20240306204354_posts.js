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
    .createTable("colleges", (table)=>{
        table.increments("college_id").notNullable();
        table.string("college_name").notNullable();
        table.string("college_logo").notNullable();
    })
    .createTable("groups", (table)=>{
        table.increments("group_id").notNullable();
        table.string("group_name").notNullable();
        table.integer("college_id").index()
        .references("college_id")
        .inTable("colleges")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("offers", (table)=>{
        table.increments("offer_id").notNullable();
        table.string("offer_title").notNullable();
        // table.string("offer_details").notNullable();
        table.text("offer_details").notNullable();
        table.string("offer_link").notNullable();
        table.integer("company_id").index()
        .references("company_id")
        .inTable("companies")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
        table.integer("college_id").index()
        .references("college_id")
        .inTable("colleges")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
        table.integer("group_id").index()
        .references("group_id")
        .inTable("groups")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("users", (table)=>{
        table.increments("user_id").notNullable();
        table.string("user_name").notNullable();
        table.string("user_role").notNullable();
        table.integer("group_id").index()
        .references("group_id")
        .inTable("groups")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
        table.integer("college_id").index()
        .references("college_id")
        .inTable("colleges")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable("users")
    .dropTable("offers")
    .dropTable("groups")
    .dropTable("companies")
    .dropTable("colleges")
};
