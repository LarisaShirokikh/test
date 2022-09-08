import dotenv from "dotenv";
import mongoose from "mongoose";
import {
    AttemptType,
    BloggersType,

    RefreshTokensCollectionType,
    UsersEmailConfDataType, LikesStatusType, UsersType, CommentType, PostType
} from "../types";


dotenv.config();


const mongoUri = process.env.mongoURI || "mongodb+srv://LoraDB:p-fkFTpRiB5r6h6@cluster0.zszv3.mongodb.net/test"
let dbName = "mongoose-example"

//export const client = new MongoClient(mongoUri)
//let db = client.db("mongoose-example")
//export const bloggersCollection = db.collection<BloggersType>("bloggers")
//export const postsCollection = db.collection<PostsType>("posts")
//export const usersCollection = db.collection<UsersDBType>("users")
//export const commentsCollection = db.collection<CommentsType>("comments")
//export const usersEmailConfDataCollection = db.collection<UsersEmailConfDataType>("usersEmailConfData")
//export const endpointsAttemptsTrysCollection = db.collection<AttemptType>("attempts")
//export const refreshTokensBlackListCollection = db.collection<RefreshTokensCollectionType>('refreshBlackList')

const usersSchema = new mongoose.Schema<UsersType>({
    id: String,
    login: String,
    password: String,
    isConfirmed: Boolean,
    email: String
})
const commentsSchema = new mongoose.Schema<CommentType>({
        postId: String,
        id: String,
        content: String,
        userId: String,
        userLogin: String,
        addedAt: Object,
        likesInfo: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String
        }
    }, {_id: false}
)
const postsSchema = new mongoose.Schema<PostType>({
        id: String,
        title: String,
        shortDescription: String,
        content: String,
        bloggerId: String,
        bloggerName: String,
        addedAt: Object, // new
        likesInfo: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String,
            newestLikes: [
                {
                    addedAt: Object,
                    userId: String,
                    login: String
                }
            ]
        }
    }, {_id: false}
)
const bloggersSchema = new mongoose.Schema<BloggersType>({
    id: String,
    name: String,
    youtubeUrl: String
})
const usersEmailConfDataSchema = new mongoose.Schema<UsersEmailConfDataType>({
    email: String,
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: Boolean
})
const endpointsAttemptsTrysSchema = new mongoose.Schema<AttemptType>({
    userIP: String,
    url: String,
    time: Date,
})
const refreshTokensBlackListSchema = new mongoose.Schema<RefreshTokensCollectionType>({
    refreshToken: String
})
const likesStatusSchema = new mongoose.Schema<LikesStatusType>({
    id: String,
    userId: String,


})

export const EndpointsAttemptsTrysModel = mongoose.model('endpointsAttemptsTrys', endpointsAttemptsTrysSchema);
export const RefreshTokensBlackListModel = mongoose.model('refreshTokensBlackList', refreshTokensBlackListSchema);
export const UsersModel = mongoose.model('users', usersSchema);
export const CommentsModel = mongoose.model('comments', commentsSchema);
export const PostsModel = mongoose.model('posts', postsSchema);
export const BloggersModel = mongoose.model('bloggers', bloggersSchema);
export const UsersEmailConfDataModel = mongoose.model('usersEmailConfData', usersEmailConfDataSchema);
export const likesStatusCollection = mongoose.model("likesStatus", likesStatusSchema)


export async function runDb() {
    try {
        //await client.connect();
        await mongoose.connect("mongodb+srv://LoraDB:p-fkFTpRiB5r6h6@cluster0.zszv3.mongodb.net/test");
        console.log("Connected to mongo server");
    } catch {
        console.log("Can't connect to db")
        //await client.close();
        await mongoose.disconnect();
    }
}