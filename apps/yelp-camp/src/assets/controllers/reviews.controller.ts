import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class Reviwe {
    static createReview = async (req, res) => {
        const campground = await prisma.campground.findUnique({
            where: {
                id: req.params.id
            }
        });
        const review = await prisma.review.create({
            data: {
                campgroundId: campground.id,
                rating: parseInt(req.body.review.rating),
                body: req.body.review.body,
                authorId: req.cookies.userID
            }
        });
        req.flash('success', 'Created new review!');
        res.redirect(`/campgrounds/${campground.id}`);
    }

    static deleteReview = async (req, res) => {
        await prisma.review.delete({
            where: {
                id: req.params.reviewId
            }
        })
        req.flash('success', 'Successfully deleted review');
        res.redirect(`/campgrounds/${req.params.id}`);
    }
}



export default Reviwe;