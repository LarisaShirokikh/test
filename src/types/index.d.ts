
import {UsersEmailConfDataType, UsersType} from "../types";

declare global {
    declare namespace Express {

        export interface Request {
            user: UsersType | null
        }
    }
}
