import { User } from './user.model.js';
import { AppError } from '../../utils/AppError.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { catchAsync } from '../../utils/catchAsync.js';
import { generateJWT } from '../../utils/jwt.js';
import {
  sendAlertEmail,
  sendConfirmationEmail,
} from '../../utils/nodemailer.js';

// Función auxiliar para crear un retardo
const crearRetardo = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const deshabilitarMembresiasExpiradas = async () => {
  const ahora = new Date();
  const cincoDiasDespues = new Date(ahora);
  cincoDiasDespues.setDate(ahora.getDate() + 5);

  try {
    // 1. Encuentra y deshabilita las membresías que han expirado
    // Esto NO necesita retardo, ya que es una única operación de base de datos.
    const [contadorActualizadosExpirados] = await User.update(
      { membership: 'disabled' }, // Establece la membresía a 'disabled'
      {
        where: {
          membership: 'active', // Solo actualiza membresías activas
          endDate: {
            [Op.lt]: ahora, // Donde endDate es anterior a la hora actual
          },
        },
      }
    );

    console.log(
      `Se deshabilitaron ${contadorActualizadosExpirados} membresías expiradas.`
    );

    // 2. Encuentra las membresías que están a punto de expirar (dentro de los próximos 5 días)
    // Esta consulta tampoco necesita retardo.
    const usuariosPorExpirarPronto = await User.findAll({
      where: {
        membership: 'active', // Aún nos interesan las membresías activas
        endDate: {
          [Op.between]: [ahora, cincoDiasDespues], // Donde endDate está entre ahora y 5 días después
        },
      },
    });

    console.log(
      `Se encontraron ${usuariosPorExpirarPronto.length} usuarios con membresías que expiran pronto.`
    );

    // 3. Itera sobre los usuarios que expiran pronto y envía alertas CON DELAY
    for (const user of usuariosPorExpirarPronto) {
      await crearRetardo(500);
      sendAlertEmail(user.email);
    }
  } catch (error) {
    console.error('Error en deshabilitarMembresiasExpiradas:', error);
    // Implementa un manejo de errores/logs más robusto según sea necesario
  }
};

// deshabilitarMembresiasExpiradas();
// Mantiene el intervalo - se ejecuta cada 24 horas (86400000 ms)
setInterval(deshabilitarMembresiasExpiradas, 86400000);

export const findAll = catchAsync(async (req, res, next) => {
  const { search, status } = req.query;

  let whereClause = {
    role: 'user',
  };

  if (search && search.length > 3) {
    whereClause[Op.or] = [
      { email: { [Op.iLike]: `%${search}%` } },
      { phoneNumber: { [Op.like]: `%${search}%` } },
    ];
  }

  if (status) {
    whereClause.membership = status;
  }

  const users = await User.findAll({
    where: whereClause,
    attributes: {
      exclude: ['password'],
    },
  });

  return res.status(200).json({
    status: 'Success',
    results: users.length,
    users,
  });
});

export const findOne = catchAsync(async (req, res, next) => {
  const { user } = req;

  return res.status(200).json({
    status: 'Success',
    user,
  });
});

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, country, phoneNumber, startDate, endDate, password } =
    req.body;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    phoneNumber,
    country,
    startDate,
    endDate,
    password: encryptedPassword,
  });

  sendConfirmationEmail(email, password);

  res.status(201).json({
    status: 'success',
    message: 'the user has been created successfully!',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      endDate: user.endDate,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Buscar al usuario por su email
  const user = await User.findOne({ where: { email } });

  // Verificar si el usuario no existe
  if (!user) {
    return next(new AppError('El correo ingresado no está registrado.', 404));
  }

  if (user.membership === 'disabled') {
    return next(
      new AppError(
        'Su cuenta está desactivada. Por favor, renueve su membresía.',
        403
      )
    );
  }

  if (user.status === 'disabled') {
    return next(
      new AppError(
        'Su cuenta ha sido desactivada. Comuníquese con el administrador para obtener más detalles.',
        403
      )
    );
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return next(new AppError('La contraseña ingresada es incorrecta.', 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      endDate: user.endDate, // Enviar la fecha de expiración de la membresía
    },
  });
});

export const loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
      status: 'active',
      role: {
        [Op.or]: ['admin', 'superadmin'],
      },
    },
  });

  if (!user) {
    return next(new AppError('El correo no esta registrado', 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Contraseña incorrecta', 401));
  }

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const update = catchAsync(async (req, res) => {
  const { user } = req;
  const {
    name,
    email,
    phoneNumber,
    country,
    startDate,
    endDate,
    password,
    status,
  } = req.body;

  let updatedFields = {
    name,
    email,
    phoneNumber,
    country,
    startDate,
    endDate,
    status,
  };

  // Si se provee una contraseña, y es válida, se encripta
  if (password && password.length > 3) {
    const salt = await bcrypt.genSalt(12);
    const encryptedPassword = await bcrypt.hash(password, salt);
    updatedFields.password = encryptedPassword;
  }

  // Actualizar los campos del usuario
  await user.update(updatedFields);

  if (new Date(endDate) > new Date()) {
    await user.update({ membership: 'active' });
  } else {
    await user.update({ membership: 'disabled' });
  }

  return res.status(200).json({
    status: 'success',
    message: 'User information has been updated',
    user,
  });
});

export const updateMembership = catchAsync(async (req, res) => {
  const { user } = req;

  let statusMembership = 'active'; // Valor predeterminado

  // Verificamos que la fecha de la membresía ha expirado
  if (new Date(user.endDate) < new Date()) {
    await user.update({
      membership: 'disabled',
    });
    statusMembership = 'disabled';
  } else {
    await user.update({
      membership: 'active',
    });
    statusMembership = 'active';
  }

  return res.status(200).json({
    status: 'success',
    message: 'User membership status has been updated',
    membershipStatus: statusMembership,
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  const { user } = req;

  await user.destroy();

  return res.status(200).json({
    status: 'success',
    message: `The user with id: ${user.id} has been deleted`,
  });
});
