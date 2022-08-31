import {Request, Response} from "express";
import {bloggersService} from "../domain/bloggers-service";

export const findBloggerByIdMiddleware = async (req: Request, res: Response) => {
    const blogger = await bloggersService.findBloggersById(req.params.id)
    if (blogger) {
        res.send(blogger)
    } else {
        res.send(404)
    }
}