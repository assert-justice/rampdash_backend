const app = require("../src/app");
const request = require("supertest");

describe("Users routes", ()=>{
    it("Admin login", async ()=>{
        const res = await request(app)
            .post("/users/login")
            .send({user_name: "riley", user_pwd: "password"})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                user_id: expect.any(Number),
                user_name: expect.any(String),
            })
        )
    });
    it("Get users", async ()=>{
        const response = await request(app)
            .get("/users")
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                user_id: expect.any(Number),
                user_name: expect.any(String),
            }),
        ]));
    });
});
