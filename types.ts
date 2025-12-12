// Enums
export enum UnitType {
    KG = 'kg',
    UNIT = 'unit'
}

export enum TransactionType {
    SALE = 'SALE',
    BREAKDOWN = 'BREAKDOWN',
    RECEIPT = 'RECEIPT'
}

// Entities
export interface Product {
    id: string;
    name: string;
    unitType: UnitType;
    pricePerUnit: number;
    category: string;
    image: string; // Placeholder URL
}

export interface CarcassBatch {
    id: string;
    sourceFarm: string;
    dateReceived: string;
    initialWeightKg: number;
    remainingWeightKg: number;
    status: 'ACTIVE' | 'DEPLETED';
}

export interface InventoryStock {
    productId: string;
    quantity: number; // kg or units
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number; // weight or count
    totalPrice: number;
    batchId?: string; // Traceability
}

export interface Order {
    id: string;
    customerName?: string;
    items: CartItem[];
    total: number;
    status: 'PENDING' | 'COMPLETED' | 'PAID';
    createdAt: Date;
    type: 'POS' | 'WEB';
}

// Breakdown / Recipe Types
export interface CutRecipeItem {
    productId: string; // The resulting cut
    expectedYieldPercentage: number;
}

export interface CutRecipe {
    id: string;
    name: string;
    items: CutRecipeItem[];
}

export interface BreakdownResult {
    productId: string;
    actualWeight: number;
    expectedWeight: number;
    variance: number;
}