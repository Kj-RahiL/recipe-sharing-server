import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'rahiilarham@gmail.com',
      pass: 'ejhz oqou ogve wtox',
    },
  });

  await transporter.sendMail({
    from: 'rahiilarham@gmail.com',
    to, // list of receivers
    subject: "Forget Password to CHiF's CiRCLe Within 10 mins", 
    text: '', // plain text body
    html, // html body
  });
};


// export const sendEmail = async () => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: config.NODE_ENV === 'production',
//     auth: {
//       user: 'rahiilarham@gmail.com',
//       pass: 'ejhz oqou ogve wtox',
//     },
//   });

//   await transporter.sendMail({
//         from: 'rahiilarham@gmail.com', // sender address
//         to: 'abirhossain.fbr@gmail.com, rahil.jrr@gmail.com', // list of receivers
//         subject: 'Reset your password within ten mins!', // Subject line
//         text: 'Hello world?', // plain text body
//         html: '<b>Hello world?</b>', 
//       });
// };
