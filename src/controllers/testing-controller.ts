import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {
    BloggersModelClass,
    CommentsModelClass,
    EndpointsAttemptsTrysModelClass, PostsModelClass,
    UserModelClass,
    UsersEmailConfDataModelClass
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

        await PostsModelClass.deleteMany()
        await BloggersModelClass.deleteMany()
        await UserModelClass.deleteMany()
        await CommentsModelClass.deleteMany()
        await EndpointsAttemptsTrysModelClass.deleteMany()
        await UsersEmailConfDataModelClass.deleteMany()

        res.sendStatus(204)
    }

}
