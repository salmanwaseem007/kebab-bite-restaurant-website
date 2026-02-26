import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface UserProfile {
    name: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface UserWithRole {
    principal: Principal;
    role: UserRole;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface MenuPhoto {
    id: string;
    url: string;
    order: bigint;
    name: string;
}
export interface ContactInfo {
    latitude: number;
    whatsapp: string;
    email: string;
    longitude: number;
    restaurantName: string;
    address: string;
    openingHours: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuPhoto(photo: MenuPhoto): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMenuPhoto(photoId: string): Promise<void>;
    getAllUsers(): Promise<Array<UserWithRole>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo>;
    getMenuPhotos(): Promise<Array<MenuPhoto>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    reorderMenuPhotos(photoIds: Array<string>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateContactInfo(info: ContactInfo): Promise<void>;
}
