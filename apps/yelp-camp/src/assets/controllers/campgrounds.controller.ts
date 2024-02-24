import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class Campground {
  static index = async (req, res) => {
    const campgrounds = await prisma.campground.findMany();
    res.render('campgrounds/index', { campgrounds });
  };

  static renderNewForm = (req, res) => {
    res.render('campgrounds/new');
  };

  static craeateCampground = async (req, res) => {
    const campground = req.body.campground;
    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.originalname,
    }));

    const newCampground = await prisma.campground.create({
      data: {
        title: campground.title,
        location: campground.location,
        description: campground.description,
        price: campground.price,
        authorId: req.cookies.userID,
        images: { createMany: { data: images } },
      },
      include: { images: true },
    });
    console.log(newCampground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground.id}`);
  };

  static showCampground = async (req, res) => {
    const campground = await prisma.campground.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        reviews: { include: { author: true } },
        author: true,
        images: true,
      },
    });
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  };

  static renderEditForm = async (req, res) => {
    const campground = await prisma.campground.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  };

  static updateCampground = async (req, res) => {
    const updatedImages = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));

    const currentCampground = await prisma.campground.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        images: true,
      },
    });

    const campground = await prisma.campground.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.campground.title,
        location: req.body.campground.location,
        description: req.body.campground.description,
        price: req.body.campground.price,
        images: {
          deleteMany:
            updatedImages.length > 0
              ? { id: { in: currentCampground.images.map((img) => img.id) } }
              : {},
          createMany: { data: updatedImages },
        },
      },
    });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground.id}`);
  };

  static deleteCampground = async (req, res) => {
    await prisma.review.deleteMany({
      where: {
        campgroundId: req.params.id,
      },
    });

    await prisma.campground.delete({
      where: {
        id: req.params.id,
      },
    });

    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
  };
}

export default Campground;
