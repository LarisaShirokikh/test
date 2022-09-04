import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {AttemptsRepository} from "../repositories/attempts-repository";
import {UsersEmailConfDataModelClass} from "../settingses/db";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";
import {CommentsRepository} from "../repositories/comment-repository";


@injectable()
export class TestingController {
    constructor(@inject(PostsRepository)
                protected postsRepository: PostsRepository,
                protected bloggersRepository: BloggersRepository,
                protected usersRepository: UsersRepository,
                protected commentRepository: CommentsRepository,
                protected attemptsRepository: AttemptsRepository
) {}


    async deleteAll(req: Request, res: Response) {

        await this.postsRepository.deleteAllPost()

        await this.bloggersRepository.deleteAllBloggers()
        await this.usersRepository.deleteAllUsers()
        await this.commentRepository.deleteAllComments()
        await this.attemptsRepository.deleteAllAttempts()
        await UsersEmailConfDataModelClass.deleteMany()

        res.sendStatus(204)
    }

}
