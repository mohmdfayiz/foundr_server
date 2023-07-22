"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.verifyOtp = exports.generateOtp = exports.updateCofounderPreference = exports.updateAbout = exports.updateUserProfile = exports.profilePhoto = exports.getProfilePhoto = exports.userDetails = exports.signin = exports.signup = exports.userExist = exports.authenticate = void 0;
const http_errors_1 = __importStar(require("http-errors"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = __importDefault(require("../../util/validateEnv"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const fileUploader_1 = __importDefault(require("../../util/fileUploader"));
// middleware for  user authentication 
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.method == "GET" ? req.query : req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user)
            return next((0, http_errors_1.default)(404, 'user not found'));
        next();
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.authenticate = authenticate;
// check user already exist or not for signup
const userExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        const user = yield userModel_1.default.findOne({ email });
        if (user)
            return res.status(400).send({ message: "Email already exists" });
        next();
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.userExist = userExist;
// USER SIGN UP
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const userExist = yield userModel_1.default.findOne({ email });
        if (userExist)
            return next((0, http_errors_1.default)(422, 'Email already exist!'));
        yield bcrypt_1.default.hash(password, 10).then((hashPassword) => {
            const newUser = new userModel_1.default({
                userName,
                email,
                password: hashPassword
            });
            newUser.save()
                .then(() => {
                // create jwt token
                const token = jsonwebtoken_1.default.sign({
                    userId: newUser._id,
                    email: newUser.email,
                    userName: newUser.userName
                }, validateEnv_1.default.JWT_SECRET, { expiresIn: "24h" });
                return res.status(201).json({
                    message: "Signup Successful...",
                    token,
                });
            })
                .catch((error) => { res.status(500).json(error); });
        });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.signup = signup;
// USER SIGN IN
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email, status: "Active" });
        if (!user)
            return next((0, http_errors_1.default)(404, 'User not found!'));
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword)
            return next((0, http_errors_1.default)(401, 'Invalid password!'));
        // create jwt token
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email,
            userName: user.userName
        }, validateEnv_1.default.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({
            message: "Signin Successful...",
            token
        });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.signin = signin;
// GET USER DETAILS
const userDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Invalid userId'));
        const user = yield userModel_1.default.findById(userId);
        if (!user)
            return next((0, http_errors_1.default)(404, 'Could not find the user!'));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = Object.assign({}, user.toJSON()), { password } = _a, rest = __rest(_a, ["password"]); // details except password 
        res.status(200).json({ userDetails: rest });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.userDetails = userDetails;
// GET PROFILE PHOTO
const getProfilePhoto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized user'));
        const user = yield userModel_1.default.findById(userId);
        res.status(200).json({ profilePhoto: (user === null || user === void 0 ? void 0 : user.profilePhoto) || null });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.getProfilePhoto = getProfilePhoto;
// ADD PROFILE PHOTO
const profilePhoto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized user'));
        const profilePhoto = req.body.file;
        (0, fileUploader_1.default)(profilePhoto)
            .then((profilePhoto) => __awaiter(void 0, void 0, void 0, function* () {
            yield userModel_1.default.updateOne({ _id: userId }, { $set: { profilePhoto } });
            res.sendStatus(201);
        })).catch(() => next((0, http_errors_1.default)(400, 'Invalid input')));
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.profilePhoto = profilePhoto;
// UPDATE USER PROFILE
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized user'));
        const { intro, gender, age, country, state, city } = req.body;
        yield userModel_1.default.updateOne({ _id: userId }, { $set: { intro, gender, age, location: { country, state, city } } });
        res.status(201).send('updated successfully');
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.updateUserProfile = updateUserProfile;
// UPDATE ABOUT USER
const updateAbout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized User'));
        const { isTechnical, haveIdea, accomplishments, education, employment, responsibilities, interests } = req.body;
        yield userModel_1.default.updateOne({ _id: userId }, { $set: { isTechnical, haveIdea, accomplishments, education, employment, responsibilities, interests } });
        res.status(201).send({ message: 'Updated successfully' });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.updateAbout = updateAbout;
// UPDATE COFOUNDER PREFERENCE
const updateCofounderPreference = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized user'));
        const { activelySeeking, cofounderTechnical, cofounderHasIdea, locationPreference, cofounderResponsibilities } = req.body;
        yield userModel_1.default.updateOne({ _id: userId }, { $set: { activelySeeking, cofounderTechnical, cofounderHasIdea, locationPreference, cofounderResponsibilities } });
        res.status(201).send({ message: 'cofounder preference updated successfully' });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.updateCofounderPreference = updateCofounderPreference;
// GENERATE OTP
const generateOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.app.locals.OTP = otp_generator_1.default.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        res.status(201).send({ code: req.app.locals.OTP });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.generateOtp = generateOtp;
// VERIFY OTP
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    if (!code)
        return next((0, http_errors_1.default)(501, 'invalid OTP'));
    if ((req.app.locals.OTP) === code) {
        req.app.locals.OTP = null; // reset the otp value
        req.app.locals.resetSession = true; //start session for reset password
        return res.status(200).send({ msg: 'Verified Successfully.' });
    }
    return next((0, http_errors_1.default)(401, 'invalid OTP'));
});
exports.verifyOtp = verifyOtp;
// CHANGE PASSWORD
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPassword, email } = req.body;
        const password = yield bcrypt_1.default.hash(newPassword, 10);
        yield userModel_1.default.findOneAndUpdate({ email }, { $set: { password: password } }).then((result) => {
            if (!result)
                return res.sendStatus(404);
            res.sendStatus(200);
        });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.changePassword = changePassword;
