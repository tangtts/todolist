import { configModuleOptions } from './module-options';

 const configModel = () => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    url: process.env.DB_URL,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING,
  },
  jwt:{
    secret:process.env.JWT_SECRET,
    signOptions:{
      expiresIn:process.env.JWT_EXPIRES_IN,
    }
  }
});
export default configModel;

export type ReturnConfigurationType = ReturnType<typeof configModel>;

export type ObjectType<T = ReturnConfigurationType,R extends string = '',K = keyof T> = 
K extends keyof T ?
T[K] extends object ? ObjectType<T[K],`${R}${R extends "" ? "" : '.'}${K & string}`,keyof T[K]>
:`${R}${R extends "" ? "" : '.'}${K & string}` :any;

type Computed<T> = {
  [K in keyof T]:T[K]
} 
export type ConfigurationType = Computed<ObjectType>
 