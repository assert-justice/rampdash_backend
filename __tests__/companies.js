const app = require("../src/app");
const request = require("supertest");

const logoUrl = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.Uk41Cmx_g2XOat5U4PPqXgHaHa%26pid%3DApi&f=1&ipt=6ea2b5b6e1617b72402b738f99f0253740ba117fc5db90006b5ee6f3af0096c0&ipo=images";
const websiteUrl = "https://en.wikipedia.org/wiki/Wiki";

function getAdminToken(){
    return request(app)
        .post("/users/login")
        .send({user_name: "riley", user_pwd: "password"})
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => res.body.token)
}

describe("companies routes", ()=>{
    it("List companies", async ()=>{
        const response = await request(app)
            .get(`/companies`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                company_id: expect.any(Number),
                company_name: expect.any(String),
                company_logo: expect.any(String),
            }),
        ]));
    });
    it("Create and delete company", async ()=>{
        const token = await getAdminToken();
        const response = await request(app)
            .post(`/companies?token=${token}`)
            .send({company:{
                company_name: "test company", 
                company_logo: logoUrl, 
                company_description: "company desc",
                company_website: websiteUrl,
            }})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                company: expect.objectContaining({
                    company_id: expect.any(Number),
                    company_name: expect.any(String),
                    company_logo: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/companies/${response.body.company.company_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create, edit, and delete company", async ()=>{
        const token = await getAdminToken();
        let response;
        response = await request(app)
            .post(`/companies?token=${token}`)
            .send({company:{
                company_name: "test company", 
                company_logo: logoUrl, 
                company_description: "company desc",
                company_website: websiteUrl,
            }})            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                company: expect.objectContaining({
                    company_id: expect.any(Number),
                    company_name: expect.any(String),
                    company_logo: expect.any(String),
                })
            }),
        );
        await request(app)
            .patch(`/companies/${response.body.company.company_id}?token=${token}`)
            .send({company:{company_name: "edited test name"}})
            .expect('Content-Type', /json/)
            .expect(200);
        response = await request(app)
            .get(`/companies/${response.body.company.company_id}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                company: expect.objectContaining({
                    company_id: expect.any(Number),
                    company_name: expect.stringMatching("edited test name"),
                    company_logo: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/companies/${response.body.company.company_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create invalid company", async ()=>{
        const token = await getAdminToken();
        await request(app)
            .post(`/companies?token=${token}`)
            .send({company:{user_rrole: "admin"}})
            .expect('Content-Type', /json/)
            .expect(400);
    });
});