// Poshmark region types
export type PoshmarkRegion = 'US' | 'CA';

// Poshmark user types
export interface PoshmarkUser {
    username: string;
    region: PoshmarkRegion;
    closetSize?: number;
    lastActive?: Date;
}

// Poshmark item types
export interface PoshmarkItem {
    id: string;
    title: string;
    price: number;
    description?: string;
    brand?: string;
    size?: string;
    category?: string;
    subcategory?: string;
    color?: string[];
    status: 'active' | 'sold' | 'not_for_sale';
    lastShared?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Poshmark authentication types
export interface PoshmarkAuth {
    username: string;
    password: string;
    region: PoshmarkRegion;
    token?: string;
    refreshToken?: string;
    expiresAt?: Date;
}

// Poshmark API response types
export interface PoshmarkResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}
