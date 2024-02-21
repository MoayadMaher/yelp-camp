import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const isReviewAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await prisma.campground.findUnique({
        where: {
            id
        }
    })
    if (!(campground.authorId == (req.cookies.userID))) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};