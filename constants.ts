import { Product, UnitType, CarcassBatch, CutRecipe } from './types';

export const MOCK_PRODUCTS: Product[] = [
    { id: 'p2', name: 'กอกอน/คอติดหนัง (Neck w/ Skin)', unitType: UnitType.KG, pricePerUnit: 82, category: 'Raw Meat', image: 'https://picsum.photos/200/200?random=2' },
    { id: 'p3', name: 'คอหมูย่าง (Grilled Pork Neck)', unitType: UnitType.KG, pricePerUnit: 138, category: 'Raw Meat', image: 'https://picsum.photos/200/200?random=3' },
    { id: 'p4', name: 'สะโพกหลัง (Hip/Ham)', unitType: UnitType.KG, pricePerUnit: 112, category: 'Primal', image: 'https://picsum.photos/200/200?random=4' },
    { id: 'p5', name: 'สันยาว (Loin Long)', unitType: UnitType.KG, pricePerUnit: 114, category: 'Primal', image: 'https://picsum.photos/200/200?random=5' },
    { id: 'p6', name: 'สันตัด (Cut Loin)', unitType: UnitType.KG, pricePerUnit: 112, category: 'Primal', image: 'https://picsum.photos/200/200?random=6' },
    { id: 'p7', name: 'สามชั้น (Belly)', unitType: UnitType.KG, pricePerUnit: 140, category: 'Primal', image: 'https://picsum.photos/200/200?random=7' },
    { id: 'p8', name: 'กระดูกแกวหน้า (Front Bone)', unitType: UnitType.KG, pricePerUnit: 116, category: 'Bone', image: 'https://picsum.photos/200/200?random=8' },
    { id: 'p9', name: 'โครงอ่อน (Soft Ribs)', unitType: UnitType.KG, pricePerUnit: 132, category: 'Bone', image: 'https://picsum.photos/200/200?random=9' },
    { id: 'p10', name: 'โครงกลาง (Mid Frame)', unitType: UnitType.KG, pricePerUnit: 90, category: 'Bone', image: 'https://picsum.photos/200/200?random=10' },
    { id: 'p11', name: 'หัวโครง-อก (Breast Bone)', unitType: UnitType.KG, pricePerUnit: 48, category: 'Bone', image: 'https://picsum.photos/200/200?random=11' },
    { id: 'p12', name: 'ตับสด (Fresh Liver)', unitType: UnitType.KG, pricePerUnit: 75, category: 'Offal', image: 'https://picsum.photos/200/200?random=12' },
    { id: 'p13', name: 'หนังยำ (Skin for Salad)', unitType: UnitType.KG, pricePerUnit: 50, category: 'Skin', image: 'https://picsum.photos/200/200?random=13' },
    { id: 'p14', name: 'แคปปั่น (Fat for Crackling)', unitType: UnitType.KG, pricePerUnit: 44, category: 'Fat', image: 'https://picsum.photos/200/200?random=14' },
    { id: 'p15', name: 'ขาเลาะ (Deboned Leg)', unitType: UnitType.KG, pricePerUnit: 82, category: 'Primal', image: 'https://picsum.photos/200/200?random=15' },
    { id: 'p16', name: 'เครื่องในต้ม (Boiled Offal)', unitType: UnitType.KG, pricePerUnit: 25, category: 'Offal', image: 'https://picsum.photos/200/200?random=16' },
    { id: 'p17', name: 'ไส้ใหญ่ต้ม (Boiled Intestine)', unitType: UnitType.KG, pricePerUnit: 32, category: 'Offal', image: 'https://picsum.photos/200/200?random=17' },
    { id: 'p18', name: 'กระดูกกาดั้ง (Misc Bone)', unitType: UnitType.KG, pricePerUnit: 10, category: 'Bone', image: 'https://picsum.photos/200/200?random=18' },
    { id: 'p19', name: 'โครงบุก (Frame Buk)', unitType: UnitType.KG, pricePerUnit: 70, category: 'Bone', image: 'https://picsum.photos/200/200?random=19' },
    { id: 'p20', name: 'สองชั้นสะโพกหลัง (2-Layer Hip)', unitType: UnitType.KG, pricePerUnit: 98, category: 'Meat', image: 'https://picsum.photos/200/200?random=20' },
    { id: 'p21', name: 'สองชั้น (2-Layer)', unitType: UnitType.KG, pricePerUnit: 94, category: 'Meat', image: 'https://picsum.photos/200/200?random=21' },
];

export const MOCK_BATCHES: CarcassBatch[] = [
    { id: 'BATCH-2023-001', sourceFarm: 'Sunny Valley Farms', dateReceived: '2023-10-25', initialWeightKg: 85.5, remainingWeightKg: 85.5, status: 'ACTIVE' },
    { id: 'BATCH-2023-002', sourceFarm: 'Green Pastures', dateReceived: '2023-10-26', initialWeightKg: 92.0, remainingWeightKg: 92.0, status: 'ACTIVE' }
];

export const STANDARD_PIG_RECIPE: CutRecipe = {
    id: 'rec1',
    name: 'Standard Retail Breakdown',
    items: [
        { productId: 'p7', expectedYieldPercentage: 0.18 }, // Belly 18%
        { productId: 'p5', expectedYieldPercentage: 0.22 }, // Loin 22%
        { productId: 'p4', expectedYieldPercentage: 0.25 }, // Shoulder/Hip 25%
        { productId: 'p14', expectedYieldPercentage: 0.15 }, // Fat 15%
        { productId: 'p10', expectedYieldPercentage: 0.20 }, // Bone 20%
    ]
};

export const INITIAL_INVENTORY: Record<string, number> = {
    'p2': 12.7,
    'p3': 9.0,
    'p4': 33.4,
    'p5': 19.3,
    'p6': 13.6,
    'p7': 70.0,
    'p8': 5.7,
    'p9': 7.5,
    'p10': 32.0,
    'p11': 6.5,
    'p12': 13.5,
    'p13': 7.6,
    'p14': 22.8,
    'p15': 21.9,
    'p16': 10.4,
    'p17': 6.4,
    'p18': 8.7,
    'p19': 6.9,
    'p20': 68.0,
    'p21': 113.8,
};