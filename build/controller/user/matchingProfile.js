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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatchingProfiles = void 0;
const http_errors_1 = __importStar(require("http-errors"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const findMatchingProfiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized user'));
        const user = yield userModel_1.default.findById(userId);
        if (!user)
            return next((0, http_errors_1.default)(404, 'could not find user'));
        const query = {
            _id: { $ne: userId, $nin: user.connections },
            $or: [
                { isTechnical: user.cofounderTechnical },
                { haveIdea: user.cofounderHasIdea },
                { 'cofounderResponsibilities': { $in: user.responsibilities } },
                { 'responsibilities': { $in: user.cofounderResponsibilities } },
                { 'cofounderHasIdea': user.cofounderHasIdea },
                { 'interests': { $in: user.interests } },
                { 'location.country': user.location.country }
            ]
        };
        const pageSize = 20;
        const page = req.query.page || '1';
        const skip = (parseInt(page) - 1) * pageSize;
        const totalMatchingProfiles = yield userModel_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalMatchingProfiles / pageSize);
        const calculateCompatibilityScore = (user1, user2) => {
            // Assign weights to the different criteria
            const weights = {
                interests: 5,
                haveIdea: 5,
                responsibilities: 4,
                isTechnical: 3,
                location: 3,
            };
            // Calculate the score for each criterion
            const scoreInterests = user1.interests.filter((interest) => user2.interests.includes(interest)).length * weights.interests;
            const scoreResponsibilities = user1.cofounderResponsibilities.filter((responsibilities) => user2.responsibilities.includes(responsibilities)).length * weights.responsibilities;
            const scoreLocation = user1.locationPreference === user2.locationPreference ? weights.location : 0;
            const scoreSkills = (user1.cofounderTechnical === 1) && user2.isTechnical || (user1.cofounderTechnical === 2) && !(user === null || user === void 0 ? void 0 : user.isTechnical) ? weights.isTechnical : 0;
            const scoreIdea = user1.cofounderHasIdea !== user2.cofounderHasIdea ? weights.haveIdea : 0;
            // Sum up the scores to get the overall compatibility score
            const score = scoreInterests + scoreResponsibilities + scoreLocation + scoreSkills + scoreIdea;
            return score;
        };
        const quickSort = (arr, left, right) => {
            if (left >= right) {
                return;
            }
            const pivotIndex = Math.floor((left + right) / 2);
            const pivotValue = arr[pivotIndex].score;
            const partitionIndex = partition(arr, left, right, pivotValue);
            quickSort(arr, left, partitionIndex - 1);
            quickSort(arr, partitionIndex, right);
        };
        const partition = (arr, left, right, pivotValue) => {
            while (left <= right) {
                while (arr[left].score > pivotValue) {
                    left++;
                }
                while (arr[right].score < pivotValue) {
                    right--;
                }
                if (left <= right) {
                    swap(arr, left, right);
                    left++;
                    right--;
                }
            }
            return left;
        };
        const swap = (arr, i, j) => {
            [arr[i], arr[j]] = [arr[j], arr[i]];
        };
        const matchingProfiles = yield userModel_1.default.find(query).skip(skip).limit(pageSize);
        const sortedProfiles = yield Promise.all(matchingProfiles.map((profile) => __awaiter(void 0, void 0, void 0, function* () {
            const score = calculateCompatibilityScore(user, profile);
            return { profile, score };
        }))).then((profiles) => {
            quickSort(profiles, 0, profiles.length - 1);
            return profiles.map((p) => p.profile);
        });
        res.status(200).json({ matchingProfiles: sortedProfiles, page, totalPages });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.findMatchingProfiles = findMatchingProfiles;
