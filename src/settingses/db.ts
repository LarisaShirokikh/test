import dotenv from "dotenv";
import mongoose, {Types} from "mongoose";
import {
    AttemptType,
    BloggersType,
    CommentsType,
    PostsType, RefreshTokensCollectionType, UsersDBType,
    UsersEmailConfDataType, LikesStatusType, NewestLikesType
} from "../types";
import Array = module
import * as module from "module";


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

const usersSchema = new mongoose.Schema<UsersDBType>({
    accountData: {
        id: String,
        login: String,
        email: String,
        passwordHash: String,
        isConfirmed: Boolean
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: String,
        isConfirmed: Boolean
    }
});
const commentSchema = new mongoose.Schema<CommentsType>({
    userId: String,
    id: String,
    content: String
})

const  NewestLikesSchema = new mongoose.Schema<NewestLikesType>( {

          addedAt: Object,
         userId: String,
         login: String


})


const postsSchema = new mongoose.Schema<PostsType>({
    id: String,
    title: String,
    shortDescription: String,
    content: String,
    bloggerId: String,
    bloggerName: String,
    addedAt: Object,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        newestLikes: []
    }
})
const bloggersSchema = new mongoose.Schema<BloggersType>({
    id: String,
    name: String,
    youtubeUrl: String
})
const usersEmailConfDataSchema = new mongoose.Schema<UsersEmailConfDataType>({
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

export const EndpointsAttemptsTrysModelClass = mongoose.model('endpointsAttemptsTrys', endpointsAttemptsTrysSchema);
export const RefreshTokensBlackListModelClass = mongoose.model('refreshTokensBlackList', refreshTokensBlackListSchema);
export const UserModelClass = mongoose.model('users', usersSchema);
export const CommentsModelClass = mongoose.model('comments', commentSchema);
export const PostsModelClass = mongoose.model('posts', postsSchema);
export const BloggersModelClass = mongoose.model('bloggers', bloggersSchema);
export const UsersEmailConfDataModelClass = mongoose.model('usersEmailConfData', usersEmailConfDataSchema);
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