export interface AuthenticatedUser {
    id: string;
    isAdmin: boolean;
    isBuyer: boolean;
    isSeller: boolean;
}