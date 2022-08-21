import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";


export type BloggersType = {
    id: string
    name: string
    youtubeUrl: string
}

export type PostsType = {
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
}

export type UsersType = {
    id: string
    login: string
    isConfirmed: boolean
}
export type CommentsType = {
    id: string
    content: string
}

export type UsersDBType = {
    id: string,
    login: string,
    isConfirmed: boolean
}

export type UsersEmailConfDataType = {
    email: string
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export type AttemptType = {
    userIP: string
    url: string
    time: Date
}

export type UsersWithPassType = {
    id: string
    login?: string
    password?: string
    isConfirmed?: boolean
}



