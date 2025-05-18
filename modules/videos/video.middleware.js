import { AppError } from '../../utils/AppError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { Video } from './videos.model.js';

export const validExistVideo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const video = await Video.findOne({
    where: {
      id,
    },
  });

  if (!video) {
    return next(new AppError(`video with id: ${id} not found `, 404));
  }

  req.video = video;
  next();
});
