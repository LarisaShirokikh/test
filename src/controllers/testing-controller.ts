import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {
    BloggersModel,
    CommentsModel,
    EndpointsAttemptsTrysModel, PostsModel,
    UsersEmailConfDataModel, UsersModel
} from "../settingses/db";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";



@injectable()
export class TestingController {
    constructor(@inject(PostsRepository)
                protected postsRepository: PostsRepository,
                protected bloggersRepository: BloggersRepository,
                protected usersRepository: UsersRepository,

) {}


    async deleteAll(req: Request, res: Response) {

        await PostsModel.deleteMany()
        await BloggersModel.deleteMany()
        await UsersModel.deleteMany()
        await CommentsModel.deleteMany()
        await EndpointsAttemptsTrysModel.deleteMany()
        await UsersEmailConfDataModel.deleteMany()

        res.sendStatus(204)
    }

}
