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

describe("Invites routes", ()=>{
    it("List invites", async ()=>{
        const token = await getAdminToken();
        const response = await request(app)
            .get(`/invites?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                invite_id: expect.any(Number),
                invite_status: expect.any(String),
                invite_code: expect.any(String),
                user_role: expect.any(String),
            }),
        ]));
    });
    it("Create and delete admin invite", async ()=>{
        const token = await getAdminToken();
        const response = await request(app)
            .post(`/invites?token=${token}`)
            .send({invite:{user_role: "admin"}})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                invite: expect.objectContaining({
                    invite_id: expect.any(Number),
                    invite_status: expect.any(String),
                    invite_code: expect.any(String),
                    user_role: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/invites/${response.body.invite.invite_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create invalid invite", async ()=>{
        const token = await getAdminToken();
        await request(app)
            .post(`/invites?token=${token}`)
            .send({invite:{user_rrole: "admin"}})
            .expect('Content-Type', /json/)
            .expect(400);
    });
});