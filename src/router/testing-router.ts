import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {usersRepository} from "../repositories/users-repository";
import {commentRepository} from "../repositories/comment-repository";
import {attemptsRepository} from "../repositories/attempts-repository";

export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {
        await postsRepository.deleteAllPost()
        await bloggersRepository.deleteAllBloggers()
        await usersRepository.deleteAllUsers()
        await commentRepository.deleteAllComments()
        await attemptsRepository.deleteAllAttempts()
        res.sendStatus(204)
    }
)