export interface JwtPayload {
    id: string;
    isAdmin: boolean;
    isVerified: boolean;
    iat?: number;
    exp?: number;
}