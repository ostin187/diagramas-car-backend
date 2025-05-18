import { AppError } from '../../utils/AppError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { Banners } from './banners.model.js';

export const validExistBanners = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const banner = await Banners.findOne({
    where: {
      id,
    },
  });

  if (!banner) {
    return next(new AppError(`banner with id: ${id} not found `, 404));
  }

  req.banner = banner;
  next();
});
