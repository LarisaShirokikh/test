import { Router, Request, Response } from "express";
import {postsRepository} from "../repositories/posts-repository";
import {usersRepository} from "../repositories/users-repository";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {commentsRepository} from "../repositories/comment-repository";
import {attemptsRepository} from "../repositories/attempts-repository";
import {refreshTokensBLRepository} from "../repositories/refresh-repository";


export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {
        await postsRepository.deleteAllPost()
        await usersRepository.deleteAllUsers()
        await bloggersRepository.deleteAllBloggers()
        await commentsRepository.deleteAllComments()
        await attemptsRepository.deleteAllAttempts()
        await refreshTokensBLRepository.deleteAllTokensInBlackList()

        res.sendStatus(204)
    }
)
