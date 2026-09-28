import fastify from "fastify";
import { postDb, type Post } from "./database.js";

const app = fastify();

app.get("/posts", async () => {
    return postDb.posts;
});

app.get<{ Params: { id: string } }>("/posts/:id", async (request, reply) => {
    const id: number = Number(request.id);
    const post: Post | undefined = postDb.posts.find(p => p.id === id);

    if (!post){
        reply.code(404).send({ status: "error", message: "Post not found" });
        return;
    }

    return post;
});

app.post<{ Body: { title: string, content: string } }>("/posts", async (request, reply) => {
    const post: Post = {
        title: request.body.title,
        content: request.body.content,
        likes: 0,
        id: postDb.nextId++,
    };
    postDb.posts.push(post);
    reply.code(200).send({ status: "ok", message: "Post created" });
});

app.patch<{ Params: { id: string }, Body: { title?: string, content?: string } }>("/posts/:id", async (request, reply) => {
    const id: number = Number(request.id);
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

app.delete<{ Params: { id: string } }>("/posts/:id", async (request, reply) => {
    const id: number = Number(request.id);
    const postIdx: number | undefined = postDb.posts.findIndex(p => p.id === id);

    if (!postIdx){
        reply.code(404).send({ status: "error", message: "Post not found" });
        return;
    }

    delete postDb.posts[postIdx];
    reply.code(200).send({ status: "ok", message: "Post deleted" });
});

app.listen({ port: 3000 }, (err, addr) => {
    if (err)
        throw err;
    console.log("Listening on", addr);
});
