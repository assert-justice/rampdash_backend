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

describe("Offers routes", ()=>{
    it("List offers", async ()=>{
        const token = await getAdminToken();
        const response = await request(app)
            .get(`/offers?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                offer_id: expect.any(Number),
                company_id: expect.any(Number),
                offer_title: expect.any(String),
                offer_details: expect.any(String),
                offer_link: expect.any(String),
            }),
        ]));
    });
    it("Create and delete offer", async ()=>{
        const token = await getAdminToken();
        const response = await request(app)
            .post(`/offers?token=${token}`)
            .send({offer:{
                offer_title: "test offer", 
                offer_details: "test description", 
                offer_link: logoUrl,
                company_id: 1,
            }})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                offer: expect.objectContaining({
                    offer_id: expect.any(Number),
                    company_id: expect.any(Number),
                    offer_title: expect.any(String),
                    offer_details: expect.any(String),
                    offer_link: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/offers/${response.body.offer.offer_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create, edit, and delete offer", async ()=>{
        const token = await getAdminToken();
        let response;
        response = await request(app)
            .post(`/offers?token=${token}`)
            .send({offer:{
                offer_title: "test offer", 
                offer_details: "test description", 
                offer_link: logoUrl,
                company_id: 1,
            }})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                offer: expect.objectContaining({
                    offer_id: expect.any(Number),
                    company_id: expect.any(Number),
                    offer_title: expect.any(String),
                    offer_details: expect.any(String),
                    offer_link: expect.any(String),
                })
            }),
        );
        await request(app)
            .patch(`/offers/${response.body.offer.offer_id}?token=${token}`)
            .send({offer:{offer_title: "edited test name"}})
            .expect('Content-Type', /json/)
            .expect(200);
        response = await request(app)
            .get(`/offers/${response.body.offer.offer_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                offer: expect.objectContaining({
                    offer_id: expect.any(Number),
                    company_id: expect.any(Number),
                    offer_title: expect.any(String),
                    offer_details: expect.any(String),
                    offer_link: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/offers/${response.body.offer.offer_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create invalid offer", async ()=>{
        const token = await getAdminToken();
        await request(app)
            .post(`/offers?token=${token}`)
            .send({offer:{user_rrole: "admin"}})
            .expect('Content-Type', /json/)
            .expect(400);
    });
});