export class BloggersType {
    constructor(
        public id: string,
        public name: string,
        public youtubeUrl: string
    ) {
    }
}

export class NewestLikesType {
    constructor(
        public addedAt: object,
        public userId: string,
        public login: string
    ) {
    }

}

export class PostsType {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public bloggerId: string,
        public bloggerName: string,
        public addedAt: object,
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string,
            newestLikes: [
                {
                    addedAt: object,
                    userId: string,
                    login: string,
                    myStatus: string
                }
            ]
        }) {
    }
}

export class UsersType {
    constructor(
        public id: string,
        public login: string
    ) {
    }
}

export class CommentsType {
    constructor(
        public postId: string,
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public addedAt: object,
        public likesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string
        }
    ) {
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

export enum likeStatusEnum {None = "None", Like = "Like", Dislike = "Dislike"}

export class LikesStatusType {
    constructor(
        public userId: string,
        public parentId: string,
        public likeStatus: likeStatusEnum
    ) {
    }

}


export class NewestLikes {
    constructor(
        public addedAt: object,
        public userId: string,
        public login: string
    ) {
    }
}




