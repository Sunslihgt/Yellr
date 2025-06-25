import { Request } from 'express';
 
export interface JwtUserRequest extends Request {
    jwtUserId?: string;
}