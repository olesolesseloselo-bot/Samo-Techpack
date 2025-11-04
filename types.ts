
export interface Measurement {
    point: string;
    description: string;
    tolerance: string;
    sizes: { [key: string]: string };
}

export interface OrderQuantity {
    colorway: string;
    sizes: { [key: string]: number };
    total: number;
}

export interface ColorCode {
    id: number;
    code: string;
    tcx: string;
}

export interface AssortiPack {
    colorway: string;
    sizes: { [key: string]: number };
}

export interface TechpackData {
    // Header
    brand: string;
    category: string;
    garmentType: string;
    garmentFabric: string;
    modelCode: string;
    sizes: string;
    colors: string;

    // Images
    productPhoto: string | null;
    technicalDrawingFront: string | null;
    technicalDrawingBack: string | null;
    fabricSample: string | null;
    wovenLabel: string | null;
    washCareLabel: string | null;
    cardLabel: string | null;
    printApliqueInfo: string | null;
    packagingInfo: string | null;
    
    // Text sections
    description: string;
    fabricInfo: string;
    sewingMaps: string;

    // Tables
    colorCodes: ColorCode[];
    measurements: Measurement[];
    assortiPack: AssortiPack[];
    orderQuantities: OrderQuantity[];
}

export interface TechpackPagesProps {
    data: TechpackData;
    updateData: <K extends keyof TechpackData>(key: K, value: TechpackData[K]) => void;
    updateNestedData: <T>(key: keyof TechpackData, index: number, field: keyof T, value: string) => void;
    updateSizeData: <T extends { sizes: Record<string, any> }>(key: keyof TechpackData, index: number, size: string, value: string) => void;
    updateColorCode: (index: number, field: keyof ColorCode, value: string) => void;
}
