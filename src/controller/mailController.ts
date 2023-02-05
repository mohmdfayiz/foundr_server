import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import nodemailer from 'nodemailer';
import env from '../util/validateEnv';

export async function sendMail(req:Request,res:Response, next:NextFunction) {

    const email = req.body.email;
    const userName = req.body?.userName || 'there..';
    const OTP = req.body?.OTP;
    
    if(!email || !OTP) return next(createHttpError(501, 'Invalid input'));

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: 'Gmail',
      
        auth: {
          user: 'foundrofficial@gmail.com',
          pass: env.MAIL_PASSWORD,
        }
      });

      const message = {
        from: "foundrofficial@gmail.com",
        to: email, 
        subject: "Email verification", // Subject line
        html: "<h2> Hello "+ userName +"</h2>"+
        "<h3>OTP for your email verification is </h3>" +
        "<h2 style='font-weight:bold;'>" + OTP +"</h2>"// html body
      }
  
    // send mail with defined transport object
    await transporter.sendMail(message).then((info)=>{

        res.status(201).json({
            message:'message sent successfully',
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
        
    }).catch((error)=>{ res.send(500).json({error})})
   
  }
