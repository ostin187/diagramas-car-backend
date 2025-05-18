import axios from 'axios';
import { catchAsync } from '../../utils/catchAsync.js';
import { Banners } from './banners.model.js';
import FormData from 'form-data';

export const findAll = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const banners = await Banners.findAll({});

  return res.status(200).json({
    status: 'Success',
    results: banners.length,
    banners,
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
  let link_banner = null;

  if (req.file) {
    const file = req.file;
    const formDataImg = new FormData();
    formDataImg.append('image', file.buffer, {
      filename: file.originalname,
    });

    const responseImg = await axios.post(
      `${process.env.SERVER_IMAGE}/image`,
      formDataImg,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    link_banner = responseImg.data.imagePath;
  }

  const banner = await Banners.create({
    link_banner,
  });

  res.status(201).json({
    status: 'success',
    message: 'the banner has been created successfully!',
    banner,
  });
});

export const update = catchAsync(async (req, res) => {
  const { banner } = req;

  await banner.update();

  return res.status(200).json({
    status: 'success',
    message: 'banner information has been updated',
    banner,
  });
});

export const deleteElement = catchAsync(async (req, res) => {
  const { banner } = req;

  await banner.destroy();

  return res.status(200).json({
    status: 'success',
    message: `The banner with id: ${banner.id} has been deleted`,
  });
});
