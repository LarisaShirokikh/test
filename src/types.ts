export type BloggersType = {

         id: string,
         name: string,
         youtubeUrl: string

}

export type PostsType = {
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
    addedAt: object // new
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
        newestLikes: [NewestLikesType | NewestLikesType[]]
    }
}

export type UsersType = {

         id: string,
         login: string

}

export type CommentsType = {
    postId: string,
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    addedAt: object,
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
    }
}

export type UsersEmailConfDataType = {

         email: string,
         confirmationCode: string,
         expirationDate: Date,
         isConfirmed: boolean

}

export type AttemptType = {

         userIP: string,
         url: string,
         time: Date

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

export type LikesStatusType = {
    id: string
    userId: string
    likeStatus: "None" | "Like" | "Dislike"
}

export type NewestLikesType = {
    addedAt: object
    userId: string
    login: string
}




