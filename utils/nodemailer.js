import nodemailer from 'nodemailer';

// Configuración del transporter de Nodemailer
// Se recomienda encarecidamente cargar estas credenciales desde variables de entorno
// Por ejemplo: process.env.EMAIL_USER, process.env.EMAIL_PASS
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar otro servicio o configuración SMTP
  auth: {
    user: process.env.EMAIL_USER, // Tu dirección de correo (remitente)
    pass: process.env.EMAIL_PASS, // Tu contraseña o clave de aplicación de correo
  },
});

// Verificar la conexión con el servidor de correo
transporter.verify((error, success) => {
  if (error) {
    console.error('Error al conectar con el servidor de correo:', error);
    // Considera manejar este error de forma más robusta en un entorno de producción
  } else {
    console.log('Conexión exitosa con el servidor de correo');
    // Esta verificación solo necesita ejecutarse una vez al iniciar la aplicación
  }
});

export const sendConfirmationEmail = async (recipientEmail, userPassword) => {
  // Validar que las variables de entorno necesarias estén cargadas
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(
      'Error: Las variables de entorno para el correo no están configuradas.'
    );
    // Podrías lanzar un error o retornar false aquí
    return;
  }

  // Cuerpo del correo en HTML más estándar y compatible
  // Se usan estilos inline para mejor compatibilidad
  const emailBody = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a la Plataforma de Diagramas Automotrices</title>
        <style>
            body {
                font-family: sans-serif;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #dddddd;
                border-radius: 8px;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h1 {
                color: #0056b3;
            }
            .content {
                margin-bottom: 20px;
            }
            .credentials {
                background-color: #f9f9f9;
                padding: 15px;
                border-left: 4px solid #0056b3;
                margin-top: 15px;
            }
            .credentials p {
                margin: 5px 0;
            }
            .important {
                background-color: #fffacd; /* Color amarillo claro */
                padding: 10px;
                border-left: 4px solid #ffc107; /* Borde amarillo */
                margin-top: 15px;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 0.9em;
                color: #777777;
            }
            a {
                color: #007bff;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            code {
                background-color: #eeeeee;
                padding: 2px 4px;
                border-radius: 4px;
                font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>¡Bienvenido a la Plataforma de Diagramas Automotrices! 🔧🚗</h1>
            </div>
            <div class="content">
                <p>Tu acceso ya está listo. A continuación te dejo los datos para ingresar:</p>

                <p>🔗 <strong>Accede desde este enlace:</strong></p>
                <p>👉 <a href="https://autodigramaspro.com/#/log-in" target="_blank">https://autodigramaspro.com/#/log-in</a></p>

                <div class="credentials">
                    <p>👤 <strong>Usuario:</strong><br>
                    <code>${recipientEmail}</code></p>

                    <p>🔒 <strong>Contraseña:</strong><br>
                    <code>${userPassword}</code></p>
                </div>

                <div class="important">
                    ⚠️ <strong>IMPORTANTE:</strong><br>
                    Asegúrate de ingresar <strong>todo en minúsculas</strong>, tanto el correo como la contraseña.<br>
                    (Si colocas alguna mayúscula, el sistema no te dejará entrar.)
                </div>

                <p>📲 <strong>¿Necesitas ayuda con el acceso?</strong><br>
                Estoy para apoyarte. Escríbeme directamente por WhatsApp haciendo clic aquí:</p>
                <p>👉 <a href="https://wa.link/znjjst" target="_blank">https://wa.link/znjjst</a></p>

                <p>¡Nos vemos dentro! 🚀</p>
            </div>
            <div class="footer">
                Este correo fue enviado automáticamente. Por favor, no respondas a esta dirección.
            </div>
        </div>
    </body>
    </html>
    `;

  // Preparar mailOptions
  const mailOptions = {
    from: process.env.EMAIL_USER, // Dirección del remitente (debe coincidir con el usuario del transporter o ser un alias permitido)
    to: recipientEmail, // Dirección del destinatario
    subject: 'Acceso a la Plataforma de Diagramas Automotrices', // Asunto del correo
    html: emailBody, // Usar el cuerpo HTML
    // text: 'Cuerpo del correo en texto plano (opcional, buena práctica incluir ambos)',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Correo electrónico de confirmación enviado a: ${recipientEmail}, ID: ${info.messageId}`
    );
    return true; // Indicar éxito
  } catch (error) {
    console.error(
      'Error al enviar el correo electrónico de confirmación:',
      error
    );
    // Considera lanzar el error o retornar false para que el llamador lo maneje
    // throw error;
    return false; // Indicar fallo
  }
};

export const sendAlertEmail = async (recipientEmail) => {
  // Validar que las variables de entorno necesarias estén cargadas
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(
      'Error: Las variables de entorno para el correo no están configuradas.'
    );
    return false; // Indicar fallo
  }

  // Cuerpo del correo en HTML más estándar y compatible
  // Se usan estilos inline para mejor compatibilidad
  const emailBody = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Tu acceso está a punto de vencer! Asegura tu RENOVACIÓN AUTOMÁTICA</title> <style>
            body {
                font-family: sans-serif;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #dddddd;
                border-radius: 8px;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h1 {
                color: #dc3545; /* Un color rojo para la alerta */
            }
            .content {
                margin-bottom: 20px;
            }
            .alert-box {
                background-color: #fff3cd; /* Color amarillo claro */
                border-left: 4px solid #ffc107; /* Borde amarillo */
                padding: 15px;
                margin-top: 15px;
                margin-bottom: 15px;
            }
             .alert-box p {
                margin: 5px 0;
             }
            .highlight {
                font-weight: bold;
                color: #dc3545; /* Color rojo para resaltar */
            }
            .footer {
                margin-top: 30px;
                font-size: 0.9em;
                color: #777777;
                border-top: 1px solid #dddddd;
                padding-top: 15px;
            }
            a {
                color: #007bff;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            hr {
                border: none;
                height: 1px;
                background-color: #dddddd;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>¡Alerta de Vencimiento! 🚨</h1>
            </div>
            <div class="content">
                <p><strong>Hola,</strong></p>
                <p>🚨 Te recordamos que tu suscripción a la <span class="highlight">PLATAFORMA DE DIAGRAMAS AUTOMOTRICES</span> <span class="highlight">está a punto de vencer</span> 🚨</p>

                <p>Para que <span class="highlight">NO pierdas acceso</span> a más de <span class="highlight">15,000 DIAGRAMAS DETALLADOS</span> (colores de cables, polaridades y ubicaciones exactas)...</p>

                <div class="alert-box">
                    <p><strong>Asegúrate de tener FONDOS DISPONIBLES en tu MÉTODO DE PAGO</strong>, ya que el sistema hará el <span class="highlight">COBRO AUTOMÁTICO</span> al final de tu período actual.</p>
                </div>

                <hr>

                <p><strong>¿QUÉ PASA si no se renueva a tiempo?</strong></p>
                <p>❌ Pierdes el ACCESO INMEDIATAMENTE</p>
                <p>❌ Podrías perder el <span class="highlight">DESCUENTO EXCLUSIVO</span> con el que ingresaste</p>

                <hr>

                <p><span class="highlight">ACTÚA AHORA</span> para evitar interrupciones y seguir instalando con rapidez, precisión y sin errores.</p>

                <p>Gracias por confiar en <strong>AutoDiagramasPro</strong>.</p>
            </div>
            <div class="footer">
                <p>Nos vemos dentro</p>
                <p>—</p>
                <p><strong>Equipo AutoDiagramasPro</strong></p>
                <p style="font-size: 0.8em; color: #999999;">Este correo fue enviado automáticamente. Por favor, no respondas a esta dirección.</p>
            </div>

                 <p><strong>¿Necesitas renovar tu acceso?</strong><br>
                Escríbeme directamente por WhatsApp haciendo clic aquí:</p>
                <p>👉 <a href="https://wa.link/znjjst" target="_blank">https://wa.link/znjjst</a></p>

        </div>
    </body>
    </html>
`;
  // Preparar mailOptions
  const mailOptions = {
    from: process.env.EMAIL_USER, // Dirección del remitente
    to: recipientEmail, // Dirección del destinatario
    subject:
      '¡Tu acceso Esta  Punto de vencer! Asegura tu RENOVACIÓN AUTOMÁTICA', // Asunto del correo
    html: emailBody, // Usar el cuerpo HTML mejorado
    // text: 'Cuerpo del correo en texto plano (opcional, buena práctica incluir ambos)',
  };

  try {
    // Asegúrate de que 'transporter' esté disponible en este ámbito
    // Si no está global o importado, necesitarás inicializarlo aquí
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Correo de alerta de vencimiento enviado a: ${recipientEmail}, ID: ${info.messageId}`
    );
    return true; // Indicar éxito
  } catch (error) {
    console.error(
      'Error al enviar el correo electrónico de alerta de vencimiento:',
      error
    );
    return false; // Indicar fallo
  }
};

// Nota: La función verify solo necesita ejecutarse al iniciar la aplicación,
// no cada vez que se envía un correo. Puedes moverla a la inicialización de tu servidor.

// Ejemplo de cómo podrías usar la función (esto no iría en el mismo archivo si es un módulo)
/*
async function main() {
    const success = await sendConfirmationEmail('correo_del_usuario@example.com', 'ContraseñaGenerada123');
    if (success) {
        console.log('Correo enviado con éxito.');
    } else {
        console.log('Fallo al enviar el correo.');
    }
}

// Para ejecutar el ejemplo (solo si es un script independiente)
// main().catch(console.error);
*/
