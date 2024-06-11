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
function getToken(user_name, user_pwd){
    return request(app)
        .post("/users/login")
        .send({user_name, user_pwd})
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => res.body.token)
}

function getInvite(token, user_role, college_id, group_id, invite_max_uses = 0){
    // const token = await getAdminToken();
    return request(app)
        .post(`/invites?token=${token}`)
        .send({invite:{invite_code: "test_code", user_role, college_id, group_id, invite_max_uses}})
        .expect('Content-Type', /json/)
        .expect(200).then(data => data.body.invite);
}

function deleteInvite(token, invite_id){
    return request(app)
        .delete(`/invites/${invite_id}?token=${token}`)
        .expect('Content-Type', /json/)
        .expect(200);
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
    // it("List users requires authentication", async ()=>{
    //     // const token = await getAdminToken();
    //     const token = "bad_token";
    //     const response = await request(app)
    //         .get(`/users?token=${token}`)
    //         .expect('Content-Type', /json/)
    //         .expect(400);
    //     expect(response.body).toEqual(
    //         expect.objectContaining({
    //             error: expect.any(String),
    //         }),
    //     );
    // });
    it("Create and delete admin user", async ()=>{
        const token = await getAdminToken();
        const invite = await getInvite(token, "admin");
        const response = await request(app)
            .post(`/users/activate/${invite.invite_code}`)
            .send({user:{user_name: "test_name", user_email: "test@email.com", user_pwd: "test pass"}})
            .expect('Content-Type', /json/)
            .expect(200);
        await deleteInvite(token, invite.invite_id);
        expect(response.body).toEqual(
            expect.objectContaining({
                user: expect.objectContaining({
                    user_id: expect.any(Number),
                    user_name: expect.any(String),
                    user_role: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/users/${response.body.user.user_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Create, edit, and delete student user", async ()=>{
        const token = await getAdminToken();
        const invite = await getInvite(token, "student", 1, 1);
        let response;
        response = await request(app)
            .post(`/users/activate/${invite.invite_code}`)
            .send({user:{user_name: "test_name", user_email: "test@email.com", user_pwd: "test pass"}})
            .expect('Content-Type', /json/)
            .expect(200);
        await deleteInvite(token, invite.invite_id);
        const user = response.body.user;
        await request(app)
            .patch(`/users/update/${user.user_id}?token=${token}`)
            .send({user:{user_name: "test_name2"}})
            .expect('Content-Type', /json/)
            .expect(200);
        response = await request(app)
            .get(`/users/${user.user_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                user: expect.objectContaining({
                    user_id: expect.any(Number),
                    user_name: expect.stringContaining("test_name2"),
                    user_role: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/users/${response.body.user.user_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Student user can edit themselves", async ()=>{
        const token = await getAdminToken();
        const user_name = "test_name";
        const user_pwd = "test pass";
        const invite = await getInvite(token, "student", 1, 1);
        let response;
        response = await request(app)
            .post(`/users/activate/${invite.invite_code}`)
            .send({user:{user_name, user_email: "test@email.com", user_pwd}})
            .expect('Content-Type', /json/)
            .expect(200);
        await deleteInvite(token, invite.invite_id);
        const user = response.body.user;
        const studentToken = await getToken(user_name, user_pwd);
        await request(app)
            .patch(`/users/update/${user.user_id}?token=${studentToken}`)
            .send({user:{user_name: "test_name2"}})
            .expect('Content-Type', /json/)
            .expect(200);
        response = await request(app)
            .get(`/users/${user.user_id}?token=${studentToken}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                user: expect.objectContaining({
                    user_id: expect.any(Number),
                    user_name: expect.stringContaining("test_name2"),
                    user_role: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/users/${response.body.user.user_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it("Student user can edit their password", async ()=>{
        const token = await getAdminToken();
        const user_name = "test_name";
        const user_pwd = "test pass";
        const new_user_pwd = "new pass";
        const invite = await getInvite(token, "student", 1, 1);
        let response;
        response = await request(app)
            .post(`/users/activate/${invite.invite_code}`)
            .send({user:{user_name, user_email: "test@email.com", user_pwd}})
            .expect('Content-Type', /json/)
            .expect(200);
        await deleteInvite(token, invite.invite_id);
        const user = response.body.user;
        const studentToken = await getToken(user_name, user_pwd);
        await request(app)
            .patch(`/users/update_pwd/${user.user_id}?token=${studentToken}`)
            .send({user:{user_pwd, new_user_pwd}})
            .expect('Content-Type', /json/)
            .expect(200);
        const newStudentToken = await getToken(user_name, new_user_pwd);
        response = await request(app)
            .get(`/users/${user.user_id}?token=${newStudentToken}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                user: expect.objectContaining({
                    user_id: expect.any(Number),
                    user_name: expect.any(String),
                    user_role: expect.any(String),
                })
            }),
        );
        await request(app)
            .delete(`/users/${response.body.user.user_id}?token=${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
    // it("Create and delete users", async ()=>{
    //     const token = await getAdminToken();
    //     const response = await request(app)
    //         .post(`/users?token=${token}`)
    //         .send({user:{user_name: "test_name", user_role: "admin", user_email: "test@email.com"}})
    //         .expect('Content-Type', /json/)
    //         .expect(200);
    //     expect(response.body).toEqual(
    //         expect.objectContaining({
    //             user: expect.objectContaining({
    //                 user_id: expect.any(Number),
    //                 user_name: expect.any(String),
    //             })
    //         }),
    //     );
    //     await request(app)
    //         .delete(`/users/${response.body.user.user_id}?token=${token}`)
    //         .expect('Content-Type', /json/)
    //         .expect(200);
    // });
    // it("Create, patch, and delete users", async ()=>{
    //     const token = await getAdminToken();
    //     let userRes = await request(app)
    //         .post(`/users?token=${token}`)
    //         .send({user:{user_name: "test_name", user_role: "admin", user_email: "test@email.com"}})
    //         .expect('Content-Type', /json/)
    //         .expect(200);
    //     expect(userRes.body).toEqual(
    //         expect.objectContaining({
    //             user: expect.objectContaining({
    //                 user_id: expect.any(Number),
    //                 user_name: expect.any(String),
    //             })
    //         }),
    //     );
    //     const user = userRes.body.user;
    //     await request(app)
    //         .patch(`/users/update/${user.user_id}?token=${token}`)
    //         .send({user:{user_name: "test_name2"}})
    //         .expect('Content-Type', /json/)
    //         .expect(200);
    //     userRes = await request(app)
    //         .get(`/users/${user.user_id}?token=${token}`)
    //         .send({user:{user_name: "test_name", user_role: "admin", user_email: "test@email.com"}})
    //         .expect('Content-Type', /json/)
    //         .expect(200);
    //     expect(userRes.body).toEqual(
    //         expect.objectContaining({
    //             user: expect.objectContaining({
    //                 user_name: expect.stringMatching("test_name2"),
    //             })
    //         }),
    //     );
    //     await request(app)
    //         .delete(`/users/${user.user_id}?token=${token}`)
    //         .expect('Content-Type', /json/)
    //         .expect(200);
    // });
});
