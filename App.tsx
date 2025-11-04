
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { TechpackData, Measurement, OrderQuantity, ColorCode, AssortiPack } from './types';
import { TechpackPages } from './components/TechpackPages';
import { ImageEditor } from './components/ImageEditor';
import { PrintIcon, EditIcon, TechpackIcon, ShareIcon } from './components/Icons';

// @ts-ignore
const { jsPDF } = window.jspdf;
// FIX: Declare html2canvas to resolve missing name error.
declare const html2canvas: any;

const initialColorCodes: ColorCode[] = [
    { id: 1, code: '16-5820 TCX', tcx: '00-0000 TCX' },
    { id: 2, code: '00-0000 TCX', tcx: '00-0000 TCX' },
    { id: 3, code: '', tcx: '' },
    { id: 4, code: '', tcx: '' },
    { id: 5, code: '', tcx: '' },
    { id: 6, code: '', tcx: '' },
    { id: 7, code: '', tcx: '' },
    { id: 8, code: '', tcx: '' },
    { id: 9, code: '', tcx: '' },
];

const initialMeasurements: Measurement[] = Array.from({ length: 17 }, (_, i) => ({
    point: String.fromCharCode(65 + i),
    description: '',
    tolerance: '',
    sizes: {},
}));

const initialAssortiPack: AssortiPack[] = [
    { colorway: 'A Green', sizes: { S: 2, M: 2, L: 2, XL: 2, '2XL': 2, '3XL': 2 } },
    { colorway: 'B', sizes: { S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 } },
    { colorway: 'C', sizes: { S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 } },
    { colorway: 'D', sizes: { S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 } },
];

const initialOrderQuantities: OrderQuantity[] = [
    { colorway: 'A Green', sizes: { XS: 240, S: 240, M: 240, L: 240, XL: 240, '2XL': 240, '3XL': 0 }, total: 1440 },
    { colorway: 'B', sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 }, total: 0 },
    { colorway: 'C', sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 }, total: 0 },
    { colorway: 'D', sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 }, total: 0 },
];

const initialSewingMaps = `Style: Slim Fit Jogger – Elastic Waist & Cuffs – Welt Back Pocket - Drawcord
Category: Women
Fabric: Knit – Fleece / Ponte (final fabric to be confirmed)
Sizes: XXS-5XL

Key Features:
Elastic waistband with functional drawcord
Front functional pockets
Single welt pocket at back
Rib cuffs at ankle
Clean silhouette, soft hand feel

Manufacturing Overview (Short)
Standard jogger assembly (front + back + waistband + cuffs)
Waistband includes inside elastic + drawcord exit holes
Welt pocket on back (decorative or functional depending on order)
Rib cuffs provide fitted ankle shape
All main seams sewn on overlock + coverstitch for stretch comfort

Quality Expectations
Flat, smooth waistband – no twisting or rolling
Pocket bags clean inside, not visible from outside
Rib cuffs stretch evenly and recover well
No wavy seams, no needle marks, no skipped stitches
Fabric + drawcord + thread color must match approved swatch

Production Notes (Client-facing)
Can be produced in single color or seasonal color range
Optional branded metal tip on drawcord
Optional "fake welt pocket" version for cost reduction
Works for loungewear, athleisure, travel comfort line

Labeling & Packaging
Standard woven brand label at waistband
Size label inside back waist
Care label option: inside welt pocket or side seam
Folded + polybag packed, barcode on size sticker`;

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'techpack' | 'editor'>('techpack');
    const [actionLoading, setActionLoading] = useState<null | 'download' | 'share'>(null);
    const techpackRef = useRef<HTMLDivElement>(null);
    const [shareApiSupported, setShareApiSupported] = useState(false);

    useEffect(() => {
        if (navigator.share) {
            setShareApiSupported(true);
        }
    }, []);

    const [techpackData, setTechpackData] = useState<TechpackData>({
        brand: 'samo',
        category: 'WOMEN',
        garmentType: 'TROUSERS',
        garmentFabric: 'FRENCH TERRY COTTON',
        modelCode: 'WT44255',
        sizes: 'XXS-XS-S-M-L-XL-2XL-3XL',
        colors: '',
        productPhoto: null,
        technicalDrawingFront: null,
        technicalDrawingBack: null,
        fabricSample: null,
        wovenLabel: null,
        washCareLabel: null,
        cardLabel: null,
        printApliqueInfo: null,
        packagingInfo: null,
        description: 'WOMEN TROUSERS',
        fabricInfo: '30/1 2 Thread\nCompact penye\nGSM\n%92 Cotton-% 8 EA',
        sewingMaps: initialSewingMaps,
        colorCodes: initialColorCodes,
        measurements: initialMeasurements,
        assortiPack: initialAssortiPack,
        orderQuantities: initialOrderQuantities,
    });
    
    const generatePdf = useCallback(async () => {
        const techpackElement = techpackRef.current;
        if (!techpackElement) return null;

        const pages = techpackElement.querySelectorAll('.techpack-page');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [842, 1191] // A3 size in pixels at 72 DPI
        });

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i] as HTMLElement;
            const canvas = await html2canvas(page, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');

            if (i > 0) {
                pdf.addPage([842, 1191], 'p');
            }
            pdf.addImage(imgData, 'PNG', 0, 0, 842, 1191);
        }
        return pdf;
    }, []);

    const handleDownload = useCallback(async () => {
        setActionLoading('download');
        const pdf = await generatePdf();
        if(pdf) {
            pdf.save('Techpack.pdf');
        }
        setActionLoading(null);
    }, [generatePdf]);
    
    const handleShare = useCallback(async () => {
        setActionLoading('share');
        const pdf = await generatePdf();
        if (pdf) {
            try {
                const pdfBlob = pdf.output('blob');
                const pdfFile = new File([pdfBlob], 'Techpack.pdf', { type: 'application/pdf' });

                if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
                    await navigator.share({
                        files: [pdfFile],
                        title: 'Fashion Techpack',
                        text: 'Created with Fashion Techpack Generator',
                    });
                } else {
                    console.error("File sharing not supported. Falling back to download.");
                    pdf.save('Techpack.pdf'); // Fallback to download
                }
            } catch (error) {
                console.error('Error sharing:', error);
            }
        }
        setActionLoading(null);
    }, [generatePdf]);

    const updateData = <K extends keyof TechpackData>(key: K, value: TechpackData[K]) => {
        setTechpackData(prev => ({ ...prev, [key]: value }));
    };

    const updateNestedData = <T,>(
        key: keyof TechpackData,
        index: number,
        field: keyof T,
        value: string
    ) => {
        setTechpackData(prev => {
            const list = (prev[key] as unknown as T[]).slice();
            const item = { ...list[index], [field]: value };
            list[index] = item;
            
            if(key === 'orderQuantities'){
                // FIX: Cast through 'unknown' to perform a type assertion to OrderQuantity.
                const sizes = (item as unknown as OrderQuantity).sizes;
                // FIX: Cast through 'unknown' to perform a type assertion to OrderQuantity.
                (item as unknown as OrderQuantity).total = Object.values(sizes).reduce((sum, qty) => sum + Number(qty || 0), 0);
            }

            return { ...prev, [key]: list };
        });
    };

    const updateSizeData = <T extends { sizes: Record<string, any> }>(
        key: keyof TechpackData,
        index: number,
        size: string,
        value: string
    ) => {
         setTechpackData(prev => {
            const list = (prev[key] as unknown as T[]).slice();
            const item = { ...list[index] };
            item.sizes = { ...item.sizes, [size]: value };
            list[index] = item;

            if(key === 'orderQuantities'){
                const sizes = item.sizes;
                // FIX: Cast through 'unknown' to perform a type assertion to OrderQuantity.
                (item as unknown as OrderQuantity).total = Object.values(sizes).reduce((sum, qty) => sum + Number(qty || 0), 0);
            }

            return { ...prev, [key]: list };
        });
    }

    const updateColorCode = (index: number, field: keyof ColorCode, value: string) => {
        setTechpackData(prev => {
            const newColorCodes = [...prev.colorCodes];
            const item = { ...newColorCodes[index] };
            if (field !== 'id') {
                (item as any)[field] = value;
            }
            newColorCodes[index] = item;
            return { ...prev, colorCodes: newColorCodes };
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                         <h1 className="text-2xl font-bold text-gray-800">Fashion Techpack Generator</h1>
                         <div className="flex items-center space-x-4">
                            <nav className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
                                {/* FIX: Corrected typo from activeTAb to activeTab */}
                                <button onClick={() => setActiveTab('techpack')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'techpack' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                                    <TechpackIcon className="w-5 h-5 inline mr-2" />
                                    Techpack
                                </button>
                                <button onClick={() => setActiveTab('editor')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'editor' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                                    <EditIcon className="w-5 h-5 inline mr-2"/>
                                    AI Image Editor
                                </button>
                            </nav>
                            {activeTab === 'techpack' && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleDownload}
                                        disabled={actionLoading !== null}
                                        className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    >
                                        <PrintIcon className="w-5 h-5 mr-2" />
                                        {actionLoading === 'download' ? 'Generating...' : 'Download PDF'}
                                    </button>
                                    {shareApiSupported && (
                                        <button
                                            onClick={handleShare}
                                            disabled={actionLoading !== null}
                                            className="flex items-center justify-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 disabled:bg-green-300 disabled:cursor-not-allowed"
                                        >
                                            <ShareIcon className="w-5 h-5 mr-2" />
                                            {actionLoading === 'share' ? 'Preparing...' : 'Share'}
                                        </button>
                                    )}
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            </header>

            <main className="py-8">
                 {activeTab === 'techpack' ? (
                     <div ref={techpackRef} className="space-y-8">
                         <TechpackPages
                             data={techpackData}
                             updateData={updateData}
                             updateNestedData={updateNestedData}
                             updateSizeData={updateSizeData}
                             updateColorCode={updateColorCode}
                         />
                     </div>
                 ) : (
                     <ImageEditor />
                 )}
            </main>
        </div>
    );
};

export default App;
