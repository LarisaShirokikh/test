


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
    userId: string
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
    time: Date
}
export type UsersWithPassType = {
    id: string
    login?: string
    password?: string
    isConfirmed?: boolean
}
export type CommentContentType = {
    content: string
}
export type RefreshTokensCollectionType = {
    refreshToken: string
}
export type UsersDBType = {
    accountData: {
        id: string,
        login: string,
        email: string,
        passwordHash: string,
        isConfirmed: boolean
    },
    emailConfirmation: {
        email: string
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}



