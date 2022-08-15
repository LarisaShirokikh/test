import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";


export const bloggersCollection: BloggerType[] = [
    {
        id: "1",
        name: 'Blogger - 01',
        youtubeUrl: "https://someurl.com",
    },
    {
        id: "2",
        name: 'Blogger - 02',
        youtubeUrl: "https://someurl.com",

    },
    {
        id: "3",
        name: 'Blogger - 03',
        youtubeUrl: "https://someurl.com"
    },
    {
        id: "4",
        name: 'Blogger - 04',
        youtubeUrl: "https://someurl.com",
    },
    {
        id: "5",
        name: 'Blogger - 05',
        youtubeUrl: "https://someurl.com",
    },
]


export let postsCollection: PostType[] | null = [
    {
        id: "1",
        title: 'About JS - 01',
        bloggerName: "string",
        shortDescription: 'shortDescription',
        content: "string",
        bloggerId: "1"
    },
    {
        id: "2",
        title: 'About JS - 02',
        bloggerName: "string",
        shortDescription: 'shortDescription',
        content: "string",
        bloggerId: "2"
    },
    {
        id: "3",
        title: 'About JS - 03',
        bloggerName: "string",
        shortDescription: 'shortDescription',
        content: "string",
        bloggerId: "3"
    },
    {
        id: "4",
        title: 'About JS - 04',
        bloggerName: "string",
        shortDescription: 'shortDescription',
        content: "string",
        bloggerId: "4"
    },
    {
        id: "5",
        title: 'About JS - 05',
        bloggerName: "string",
        shortDescription: 'shortDescription',
        content: "string",
        bloggerId: "5"
    },
]

export type BloggerType = {
    id: string,
    name: string
    youtubeUrl: string,
};

export type Pagination<T> = {
    page: number
    pageSize: number
    totalCount: number
    pagesCount: number
    items: T
};

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
    bloggerName: string
};


export type PostsOfBloggerType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [ PostType | PostType[] ]
}

export type UsersType = {
    id: string
    login: string

}

export type UsersWithHashType = {
    id: string,
    login: string,
    passwordHash: string,
    passwordSalt: string,
}

export type CommentType = {
    id: string,
    content: string,

}




