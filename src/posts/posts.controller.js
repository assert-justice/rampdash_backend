const service = require("./posts.service");

async function listPosts(res, req){
    const posts = await service.listPosts();
    req.send(posts);
}

async function validatePostId(res, req, next){
    const {post_id} = res.params;
    if(!post_id) return next(400, "no post id provided");
    // check if id exists
    const post = await service.getPost(post_id);
    if(!post) return next(400, "no such post");
    req.locals.post = post;
    next();
}

function getPost(res, req){
    req.send(req.locals.post);
}

function validatePost(res, req, next){
    const post = res.body;
    const fields = [
        "company_name",
        "company_logo",
        "company_website",
        "company_description",
        "post_title",
        "post_types",
        "post_details",
    ];
    for (const field of fields) {
        if(!post[field]) {
            const message = `Missing field ${field}!`;
            console.log(message);
            return next(400, message);
        }
    }
    req.locals.post = post;
    next();
}

async function publishPost(res, req){
    const data = await service.publishPost(req.locals.post);
    console.log(data[0]);
    req.send(data[0]);
}

module.exports = {
    listPosts,
    getPost: [validatePostId, getPost],
    publishPost: [validatePost, publishPost],
};