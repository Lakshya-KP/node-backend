function getEnv(name: string): string {
    const value = process.env[name];

    if(!value) throw new Error(`Missing environment variable: ${name}`);

    return value;
}

export const env = {
    JWT_SECRET: getEnv("JWT_SECRET"),
}