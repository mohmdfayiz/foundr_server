declare const _default: Readonly<{
    MONGO_CONNECTION_STRING: string;
    PORT: number;
    JWT_SECRET: string;
    MAIL_PASSWORD: string;
    FRONT_END_URL: string;
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
} & import("envalid").CleanedEnvAccessors>;
export default _default;
