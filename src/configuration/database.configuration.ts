/* eslint-disable prettier/prettier */
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "dotenv";

config();

interface DBConfig {
    type: string,
    database: string,
    host: string | number,
    port: number,
    username: string,
    password: string,
    synchronize: boolean,
    expiresIn: string,
    secret: string,
}

export const databaseConfig: Omit<DBConfig, 'expiresIn' | 'secret'> = {
    type: process.env.TYPE,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: Number(process.env.DBPORT),
    username: "postgres",
    password: process.env.PASSWORD,
    synchronize: Boolean(process.env.SYNCHRONIZE),
};

console.log("DB::: ", databaseConfig);

export const portConfig: Pick<DBConfig, 'port'> = { port: Number(process.env.PORT) }

export const jwtConfig: Pick<DBConfig, 'expiresIn' | 'secret'> = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
};

export const typeOrmConfig: TypeOrmModule = {
    type: databaseConfig.type,
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    autoLoadEntities: true,
    synchronize: databaseConfig.synchronize,
    ssl: { rejectUnauthorized: false, }
}