const app = require("../src/app");
const request = require("supertest");

function getAdminToken(){
    return request(app)
        .post("/users/login")
        .send({user_name: "riley", user_pwd: "password"})
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => res.body.token)
}

describe("Users routes", ()=>{
    it("Admin login", async ()=>{
        const res = await request(app)
            .post("/users/login")
            .send({user_name: "riley", user_pwd: "password"})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                user: expect.objectContaining({
                    user_id: expect.any(Number),
                    user_name: expect.any(String),
                }),
                token: expect.any(String),
            })
        );
    });
    it("List users", async ()=>{
        const token = await getAdminToken();
        const response = await request(app)
            .get(`/users?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                user_id: expect.any(Number),
                user_name: expect.any(String),
            }),
        ]));
    });
    it("List users requires authentication", async ()=>{
        // const token = await getAdminToken();
        const token = "bad_token";
        const response = await request(app)
            .get(`/users?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.any(String),
            }),
        );
    });
    it("Create and delete users", async ()=>{
        const token = await getAdminToken();
        const response = await request(app)
            .post(`/users?token=${token}`)
            .send({user:{user_name: "test_name", user_role: "admin", user_email: "test@email.com"}})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                user: expect.objectContaining({
                    user_id: expect.any(Number),
                    user_name: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/users/${response.body.user.user_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create, patch, and delete users", async ()=>{
        const token = await getAdminToken();
        let userRes = await request(app)
            .post(`/users?token=${token}`)
            .send({user:{user_name: "test_name", user_role: "admin", user_email: "test@email.com"}})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(userRes.body).toEqual(
            expect.objectContaining({
                user: expect.objectContaining({
                    user_id: expect.any(Number),
                    user_name: expect.any(String),
                })
            }),
        );
        const user = userRes.body.user;
        await request(app)
            .patch(`/users/update/${user.user_id}?token=${token}`)
            .send({user:{user_name: "test_name2"}})
            .expect('Content-Type', /json/)
            .expect(200);
        userRes = await request(app)
            .get(`/users/${user.user_id}?token=${token}`)
            .send({user:{user_name: "test_name", user_role: "admin", user_email: "test@email.com"}})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(userRes.body).toEqual(
            expect.objectContaining({
                user: expect.objectContaining({
                    user_name: expect.stringMatching("test_name2"),
                })
            }),
        );
        await request(app)
            .delete(`/users/${user.user_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
});
