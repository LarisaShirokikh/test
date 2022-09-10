import {injectable} from "inversify";
import {likesStatusCollection} from "../settingses/db";
import {likeStatusEnum, UsersType} from "../types";



@injectable()
export class LikesRepository {

    async updateLikeStatus(user: UsersType, parentId: string, likeStatus: likeStatusEnum): Promise<boolean | null> {
        try {
            await likesStatusCollection.findOneAndUpdate({parentId, userId: user.id}, {$set: {likeStatus}}, {upsert: true})
            return true
        }
        catch (e) {
            return null
        }
    }

    async getLikesAndDislikesByCommentId(user: UsersType, parentId: string){
        const likes = await likesStatusCollection.countDocuments({parentId, userId: user.id, likeStatus: likeStatusEnum.Like})
        const dislikes = await likesStatusCollection.countDocuments({parentId, userId: user.id, likeStatus: likeStatusEnum.Dislike})
        return {
            likes,
            dislikes
        }
    }
}