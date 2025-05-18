import { DataTypes } from 'sequelize';
import { db } from '../../database/config.js';

const Video = db.define('videos', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name_video: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link_video: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export { Video };
