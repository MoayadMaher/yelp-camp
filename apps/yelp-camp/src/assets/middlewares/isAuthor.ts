import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId
        }
    })
    if (!(review.authorId == (req.cookies.userID))) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};