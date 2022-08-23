


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
    email: string
    login: string
    isConfirmed: boolean
}
export type CommentsType = {
    id: string
    content: string
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
    time: number
}

export type UsersWithPassType = {
    id: string
    login?: string
    password?: string
    isConfirmed?: boolean
}



