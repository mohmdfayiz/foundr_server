"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailgen_1 = __importDefault(require("mailgen"));
const validateEnv_1 = __importDefault(require("../../util/validateEnv"));
function sendMail(req, res, next) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const userName = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.userName) || 'there..';
        const content = (_b = req.body) === null || _b === void 0 ? void 0 : _b.content;
        const subject = (_c = req.body) === null || _c === void 0 ? void 0 : _c.subject;
        const joinLink = (_d = req.body) === null || _d === void 0 ? void 0 : _d.joinLink;
        if (!email || !content)
            return next((0, http_errors_1.default)(501, 'Invalid input'));
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: 'Gmail',
            auth: {
                user: 'foundrofficial@gmail.com',
                pass: validateEnv_1.default.MAIL_PASSWORD,
            }
        });
        const mailGenerator = new mailgen_1.default({
            theme: 'default',
            product: {
                name: 'foundr.',
                link: 'https://www.foundr.site/'
            }
        });
        // EVENT INVITATION CONTENT
        const invitation = {
            body: {
                greeting: 'Congratulations',
                name: userName,
                intro: 'You have successfully registed for the event.',
                action: {
                    instructions: 'To join the Discord server, please click the button below.',
                    button: {
                        color: '#22BC66',
                        text: 'Join',
                        link: joinLink,
                    }
                },
                outro: 'We are excited to see you there.',
                signature: 'Cheers...'
            }
        };
        // EMAIL VERIFICATION CONTENT
        const emailVerificaton = {
            body: {
                name: userName,
                intro: content,
                signature: false,
            }
        };
        const emailBody = content === 'invitation' ? mailGenerator.generate(invitation) : mailGenerator.generate(emailVerificaton);
        const message = {
            from: "foundrofficial@gmail.com",
            to: email,
            subject: subject || 'Email verification',
            html: emailBody
        };
        // send mail with defined transport object
        yield transporter.sendMail(message).then((info) => {
            res.status(201).json({
                message: 'mail sent successfully',
                info: info.messageId,
                preview: nodemailer_1.default.getTestMessageUrl(info)
            });
        }).catch((error) => { res.send(500).json({ error }); });
    });
}
exports.sendMail = sendMail;
