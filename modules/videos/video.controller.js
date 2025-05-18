import { catchAsync } from '../../utils/catchAsync.js';
import { Video } from './videos.model.js';

export const findAll = catchAsync(async (req, res, next) => {
  const videos = await Video.findAll({});

  return res.status(200).json({
    status: 'Success',
    results: videos.length,
    videos,
  });
});

export const findOne = catchAsync(async (req, res, next) => {
  const { banner } = req;

  return res.status(200).json({
    status: 'Success',
    banner,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const { name_video, link_video } = req.body;
  console.log(req.body);

  const video = await Video.create({
    name_video,
    link_video,
  });

  res.status(201).json({
    status: 'success',
    message: 'the video has been created successfully!',
    video,
  });
});

export const update = catchAsync(async (req, res) => {
  const { video } = req;
  const { name_video, link_video } = req.body;

  await video.update({
    name_video,
    link_video,
  });

  return res.status(200).json({
    status: 'success',
    message: 'video information has been updated',
    video,
  });
});

export const deleteElement = catchAsync(async (req, res) => {
  const { video } = req;

  await video.destroy();

  return res.status(200).json({
    status: 'success',
    message: `The video with id: ${video.id} has been deleted`,
  });
});
