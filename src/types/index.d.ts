import {Request, Response, Router} from "express"
import {UsersType} from "../types";

declare global {
    declare namespace Express {

        export interface Request {
            user: UserType | null
        }
    }
}
// прописать импорты