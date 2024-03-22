/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("posts", (table)=>{
        table.increments("post_id").notNullable();
        // this data should probably be in a companies table
        table.string("company_logo").notNullable();
        table.string("company_name").notNullable();
        table.string("company_website").notNullable();
        table.string("company_description").notNullable();
        table.string("post_title").notNullable();
        // types should be its own table
        table.string("post_types").notNullable();
        table.string("post_details").notNullable();
        // the rate in us cents
        // table.integer("post_rate").notNullable();
        // how often the rate is paid eg hourly, monthly, per job
        // table.string("post_rate_interval").notNullable();
        // table.date("post_expires").notNullable();
    })
    .createTable("users", (table)=>{
        table.increments("user_id").notNullable();
        table.string("user_name").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable("posts")
        .dropTable("users");
};
