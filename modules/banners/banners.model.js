import { DataTypes } from 'sequelize';
import { db } from '../../database/config.js';

const Banners = db.define('banners', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  link_web_banner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link_banner: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export { Banners };
