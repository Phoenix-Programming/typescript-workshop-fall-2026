
export interface Post {
    id: number;
    likes: number;
    title: string;
    content: string;
}

// Usually databases are stored in some persistent format (like a file). Data isn't usually stored
// in-memory like this but it's simpler.
export const postDb: { posts: Post[], nextId: number } = {
    posts: [
        { id: 0, likes: 0, title: "First Post", content: "The first post ever made" },
        { id: 1, likes: 3, title: "Second Post", content: "The second post ever made..." },
    ],
    nextId: 2,
};
