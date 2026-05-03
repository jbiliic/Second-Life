export interface JwtPayload {
    id: string;
    isAdmin: boolean;
    isBuyer: boolean;
    isSeller: boolean;
    iat?: number;
    exp?: number;
}