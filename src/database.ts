
export interface Post {
    id: number;
    likes: number;
    title: string;
    content: string;
}

export const postDb: { posts: Post[], nextId: number } = {
    posts: [
        { id: 0, likes: 0, title: "First Post", content: "The first post ever made" },
        { id: 1, likes: 3, title: "Second Post", content: "The second post ever made..." },
    ],
    nextId: 2,
};
