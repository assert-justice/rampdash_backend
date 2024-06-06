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

describe("Groups routes", ()=>{
    it("List groups", async ()=>{
        const response = await request(app)
            .get(`/groups`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                group_id: expect.any(Number),
                college_id: expect.any(Number),
                group_name: expect.any(String),
            }),
        ]));
    });
    it("Create and delete group", async ()=>{
        const token = await getAdminToken();
        const response = await request(app)
            .post(`/groups?token=${token}`)
            .send({group:{group_name: "test group", college_id: 1}})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                group: expect.objectContaining({
                    group_id: expect.any(Number),
                    college_id: expect.any(Number),
                    group_name: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/groups/${response.body.group.group_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create, edit, and delete group", async ()=>{
        const token = await getAdminToken();
        let response;
        response = await request(app)
            .post(`/groups?token=${token}`)
            .send({group:{group_name: "test group", college_id: 1}})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                group: expect.objectContaining({
                    group_id: expect.any(Number),
                    college_id: expect.any(Number),
                    group_name: expect.any(String),
                })
            }),
        );
        await request(app)
            .patch(`/groups/${response.body.group.group_id}?token=${token}`)
            .send({group:{group_name: "edited test name"}})
            .expect('Content-Type', /json/)
            .expect(200);
        response = await request(app)
            .get(`/groups/${response.body.group.group_id}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                group: expect.objectContaining({
                    group_id: expect.any(Number),
                    college_id: expect.any(Number),
                    group_name: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/groups/${response.body.group.group_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create invalid group", async ()=>{
        const token = await getAdminToken();
        await request(app)
            .post(`/groups?token=${token}`)
            .send({group:{user_rrole: "admin"}})
            .expect('Content-Type', /json/)
            .expect(400);
    });
});