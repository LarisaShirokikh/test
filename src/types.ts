export class BloggersType {
    constructor(
        public id: string,
        public name: string,
        public youtubeUrl: string
    ) {
    }
}

export type PostsType = {
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
    addedAt: object // new
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
        newestLikes: [NewestLikesType | NewestLikesType[]]
    }
}

export class UsersType {
    constructor(
        public id: string,
        public login: string
    ) {
    }
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


export class UsersEmailConfDataType {
    constructor(
        public email: string,
        public confirmationCode: string,
        public expirationDate: Date,
        public isConfirmed: boolean
    ) {
    }
}

export class AttemptType {
    constructor(
        public userIP: string,
        public url: string,
        public time: Date
    ) {
    }
}

export class RefreshTokensCollectionType {
    constructor(
        public refreshToken: string
    ) {
    }
}

export class UsersDBType {
    constructor(
        public accountData: {
            id: string,
            login: string,
            email: string,
            passwordHash: string,
            isConfirmed: boolean
        },
        public emailConfirmation: {
            email: string
            confirmationCode: string,
            expirationDate: Date,
            isConfirmed: boolean
        }
    ) {
    }
}

export type LikesStatusType = {
    id: string
    userId: string
    likeStatus: "None" | "Like" | "Dislike"
}

export type NewestLikesType = {
    addedAt: Object
    userId: String
    login: String
}




