import fastify from "fastify";
import { postDb, type Post } from "./database.js";

const app = fastify();

// The Hello world endpoint.
app.get("/", async () => {
    return { message: "Hello world!" };
});

// Read (all posts)
app.get("/posts", async () => {
    return postDb.posts;
});

// Read (specific post of id)
app.get<{ Params: { id: string } }>("/posts/:id", async (request, reply) => {
    const id: number = Number(request.params.id);

    // technically "number" could be NaN
    if (isNaN(id)){
        reply.code(400).send({ status: "error", message: "ID must be a number" });
        return;
    }

    // find a post that matches the ID paramater
    const post: Post | undefined = postDb.posts.find(p => p.id === id);

    // post not found
    if (!post){
        reply.code(404).send({ status: "error", message: "Post not found" });
        return;
    }

    return post;
});

// Create new post (of title and content)
app.post<{ Body: { title: string, content: string } }>("/posts", async (request, reply) => {
    // create new post
    const post: Post = {
        title: request.body.title,
        content: request.body.content,
        likes: 0,
        id: postDb.nextId++,
    };
    postDb.posts.push(post);

    // reply to the user that their post was created
    reply.code(200).send({ status: "ok", message: "Post created" });
});

// Update post (user can optionally specify title or content)
app.patch<{ Params: { id: string }, Body: { title?: string, content?: string } }>("/posts/:id", async (request, reply) => {
    // try to find post
    const id: number = Number(request.params.id);

    // technically "number" could be NaN
    if (isNaN(id)){
        reply.code(400).send({ status: "error", message: "ID must be a number" });
        return;
    }

    const post: Post | undefined = postDb.posts.find(p => p.id === id);

    if (!post){
        reply.code(404).send({ status: "error", message: "Post not found" });
        return;
    }

    if (request.body.title)
        post.title = request.body.title;
    if (request.body.content)
        post.content = request.body.content;

    reply.code(200).send({ status: "ok", message: "Post updated" });
});


// Delete post of ID
app.delete<{ Params: { id: string } }>("/posts/:id", async (request, reply) => {
    const id: number = Number(request.id);

    // technically "number" could be NaN
    if (isNaN(id)){
        reply.code(400).send({ status: "error", message: "ID must be a number" });
        return;
    }

    // the post has an entry in the array (so it has an index or idx) but it also has a unique
    // identifier that can never change (id)
    const postIdx: number | undefined = postDb.posts.findIndex(p => p.id === id);
    if (!postIdx){
        reply.code(404).send({ status: "error", message: "Post not found" });
        return;
    }

    // removes the post from the array, and shifts everything over
    postDb.posts.splice(postIdx, 1);

    reply.code(200).send({ status: "ok", message: "Post deleted" });
});

// listens to any requests that might come its way
app.listen({ port: 3000 }, (err, addr) => {
    if (err)
        throw err;
    console.log("Listening on", addr);
});
