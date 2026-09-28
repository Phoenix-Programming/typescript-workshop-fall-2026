import fastify from "fastify";

const app = fastify();

app.get("/", () => {
    return { message: "Hello world!" };
});

app.listen({ port: 3000 }, (err, addr) => {
    if (err)
        throw err;
    console.log("Listening on", addr);
});
