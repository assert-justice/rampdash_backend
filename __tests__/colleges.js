const app = require("../src/app");
const request = require("supertest");

const logoUrl = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.Uk41Cmx_g2XOat5U4PPqXgHaHa%26pid%3DApi&f=1&ipt=6ea2b5b6e1617b72402b738f99f0253740ba117fc5db90006b5ee6f3af0096c0&ipo=images";

function getAdminToken(){
    return request(app)
        .post("/users/login")
        .send({user_name: "riley", user_pwd: "password"})
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => res.body.token)
}

describe("Colleges routes", ()=>{
    it("List colleges", async ()=>{
        const response = await request(app)
            .get(`/colleges`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                college_id: expect.any(Number),
                college_name: expect.any(String),
                college_logo: expect.any(String),
            }),
        ]));
    });
    it("Create and delete college", async ()=>{
        const token = await getAdminToken();
        const response = await request(app)
            .post(`/colleges?token=${token}`)
            .send({college:{college_name: "test college", college_logo: logoUrl}})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                college: expect.objectContaining({
                    college_id: expect.any(Number),
                    college_name: expect.any(String),
                    college_logo: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/colleges/${response.body.college.college_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create, edit, and delete college", async ()=>{
        const token = await getAdminToken();
        let response;
        response = await request(app)
            .post(`/colleges?token=${token}`)
            .send({college:{college_name: "test college", college_logo: logoUrl}})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                college: expect.objectContaining({
                    college_id: expect.any(Number),
                    college_name: expect.any(String),
                    college_logo: expect.any(String),
                })
            }),
        );
        await request(app)
            .patch(`/colleges/${response.body.college.college_id}?token=${token}`)
            .send({college:{college_name: "edited test name"}})
            .expect('Content-Type', /json/)
            .expect(200);
        response = await request(app)
            .get(`/colleges/${response.body.college.college_id}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                college: expect.objectContaining({
                    college_id: expect.any(Number),
                    college_name: expect.stringMatching("edited test name"),
                    college_logo: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/colleges/${response.body.college.college_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create invalid college", async ()=>{
        const token = await getAdminToken();
        await request(app)
            .post(`/colleges?token=${token}`)
            .send({college:{user_rrole: "admin"}})
            .expect('Content-Type', /json/)
            .expect(400);
    });
});