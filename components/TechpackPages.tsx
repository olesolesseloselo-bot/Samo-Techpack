
import React from 'react';
import { TechpackPagesProps, Measurement, OrderQuantity, ColorCode, AssortiPack } from '../types';
import { ImageUploader } from './ImageUploader';

interface EditableFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    className?: string;
    as?: 'input' | 'textarea';
    [x: string]: any; // for other props like rows
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onChange, className, as = 'input', ...props }) => {
    const commonProps = {
        value: value,
        onChange: onChange,
        className: `w-full bg-transparent p-1 border border-transparent hover:border-gray-300 focus:border-blue-400 focus:outline-none focus:bg-white rounded transition-colors ${className}`
    };
    if (as === 'textarea') {
        const rows = value ? value.split('\n').length : 1;
        return <textarea {...commonProps} {...props} style={{ height: `${Math.max(1, rows) * 1.5}em` }} />;
    }
    return <input type="text" {...commonProps} {...props} />;
};

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string; titleClassName?: string; contentClassName?: string;}> = ({ title, children, className = '', titleClassName = '', contentClassName = '' }) => (
    <div className={`border border-black flex flex-col ${className}`}>
        <h3 className={`font-bold bg-gray-100 px-2 py-0.5 border-b border-black text-center text-[10px] uppercase tracking-wider ${titleClassName}`}>{title}</h3>
        <div className={`p-1 flex-grow ${contentClassName}`}>
            {children}
        </div>
    </div>
);

const PageWrapper: React.FC<{ children: React.ReactNode; pageNumber: string }> = ({ children, pageNumber }) => (
    <div className="techpack-page bg-white shadow-lg mx-auto w-[842px] h-[1191px] p-6 box-border font-sans text-xs relative">
        {children}
        <div className="absolute bottom-4 right-6 text-gray-400 text-[10px] font-semibold">PAGE {pageNumber}</div>
        <div className="absolute bottom-4 left-6 text-gray-400 text-[10px]">ALL THE DESIGN ARE THE PROPERTY OF SAMO UNLESS OTHERWISE STATED COPYRIGHT © 2023-2033</div>
    </div>
);

export const TechpackPages = ({ data, updateData, updateNestedData, updateSizeData, updateColorCode }: TechpackPagesProps) => {
    
    const measurementSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
    const assortiSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    const orderSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
    
    const TechpackHeader: React.FC = () => (
        <header className="flex justify-between items-start border-b-2 border-black pb-2 mb-4">
            <h1 className="text-5xl font-black tracking-wider text-black pt-2">
                <EditableField value={data.brand} onChange={(e) => updateData('brand', e.target.value)} className="w-48" />
            </h1>
            <table className="border-collapse text-xs w-1/2 border border-black">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-black p-1 font-bold">CATEGORY:</th>
                        <th className="border border-black p-1 font-bold">GARMENT TYPE:</th>
                        <th className="border border-black p-1 font-bold">GARMENT FABRIC:</th>
                        <th className="border border-black p-1 font-bold">MODEL CODE:</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-black p-0"><EditableField value={data.category} onChange={(e) => updateData('category', e.target.value)} className="text-center"/></td>
                        <td className="border border-black p-0"><EditableField value={data.garmentType} onChange={(e) => updateData('garmentType', e.target.value)} className="text-center"/></td>
                        <td className="border border-black p-0"><EditableField value={data.garmentFabric} onChange={(e) => updateData('garmentFabric', e.target.value)} className="text-center"/></td>
                        <td className="border border-black p-0"><EditableField value={data.modelCode} onChange={(e) => updateData('modelCode', e.target.value)} className="text-center"/></td>
                    </tr>
                    <tr className="bg-gray-100">
                        <th colSpan={2} className="border border-black p-1 font-bold">SIZES:</th>
                        <th colSpan={2} className="border border-black p-1 font-bold">COLORS:</th>
                    </tr>
                    <tr>
                        <td colSpan={2} className="border border-black p-0"><EditableField value={data.sizes} onChange={(e) => updateData('sizes', e.target.value)} className="text-center"/></td>
                        <td colSpan={2} className="border border-black p-0"><EditableField value={data.colors} onChange={(e) => updateData('colors', e.target.value)} className="text-center"/></td>
                    </tr>
                </tbody>
            </table>
        </header>
    );

    return (
        <>
            {/* Page 1: Main Sheet */}
            <PageWrapper pageNumber="1">
                <TechpackHeader />
                <main className="grid grid-cols-12 gap-x-4 h-[calc(100%-7rem)]">
                    <div className="col-span-6 border border-black">
                         <ImageUploader imageUrl={data.technicalDrawingFront} onImageUpload={(val) => updateData('technicalDrawingFront', val)} className="h-full" aspectRatio='aspect-[1/1.414]'/>
                    </div>
                    <div className="col-span-3 flex flex-col gap-y-2">
                        <div className="border border-black flex-grow">
                             <ImageUploader imageUrl={data.productPhoto} onImageUpload={(val) => updateData('productPhoto', val)} className="h-full" aspectRatio='aspect-[3/4]'/>
                        </div>
                        <div className="h-1/3 grid grid-cols-2 gap-2">
                             <Section title="BRAND" className="h-full"><EditableField as="textarea" value={data.brand} onChange={e => updateData('brand', e.target.value)}/></Section>
                             <Section title="DESCRIPTION" className="h-full"><EditableField as="textarea" value={data.description} onChange={e => updateData('description', e.target.value)}/></Section>
                             <Section title="FABRIC" className="h-full"><EditableField as="textarea" value={data.fabricInfo} onChange={e => updateData('fabricInfo', e.target.value)}/></Section>
                             <Section title="FABRIC SAMPLE" className="h-full" contentClassName="p-0"><ImageUploader imageUrl={data.fabricSample} onImageUpload={(val) => updateData('fabricSample', val)} className="h-full" /></Section>
                        </div>
                    </div>
                    <div className="col-span-3 flex flex-col gap-y-2">
                        <div className="grid grid-cols-3 gap-1 border border-black p-1">
                            {data.colorCodes.map((color, index) => (
                                <div key={color.id} className="border border-black text-center">
                                    <div className="bg-gray-100 font-bold border-b border-black">{color.id}</div>
                                    <EditableField value={color.code} onChange={(e) => updateColorCode(index, 'code', e.target.value)} className="text-[9px] text-center" />
                                    <EditableField value={color.tcx} onChange={(e) => updateColorCode(index, 'tcx', e.target.value)} className="text-[9px] text-center" />
                                </div>
                            ))}
                        </div>
                        <Section title="SEWING MAPS:" className="flex-grow">
                           <EditableField as="textarea" value={data.sewingMaps} onChange={e => updateData('sewingMaps', e.target.value)} className="!p-0 text-[10px] h-full" />
                        </Section>
                    </div>
                </main>
            </PageWrapper>
            
            {/* Page 2: Trims & Packaging */}
            <PageWrapper pageNumber="2">
                <TechpackHeader />
                <main className="grid grid-cols-3 gap-4 h-[calc(100%-7rem)]">
                    <Section title="WOVEN LABEL/ TRANSFER NECK PRINT"><ImageUploader imageUrl={data.wovenLabel} onImageUpload={(val) => updateData('wovenLabel', val)} className="h-full"/></Section>
                    <Section title="WASH CARE LABEL"><ImageUploader imageUrl={data.washCareLabel} onImageUpload={(val) => updateData('washCareLabel', val)} className="h-full"/></Section>
                    <Section title="CARD LABEL"><ImageUploader imageUrl={data.cardLabel} onImageUpload={(val) => updateData('cardLabel', val)} className="h-full"/></Section>
                    <Section title="PRINT&APLIQUE INFO"><ImageUploader imageUrl={data.printApliqueInfo} onImageUpload={(val) => updateData('printApliqueInfo', val)} className="h-full"/></Section>
                    <Section title="PACKAGING INFO"><ImageUploader imageUrl={data.packagingInfo} onImageUpload={(val) => updateData('packagingInfo', val)} className="h-full"/></Section>
                    <Section title="ASSORTI PACK TYPE">
                        <table className="w-full border-collapse border border-black text-center">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-black p-1">COLORWAYS</th>
                                    {assortiSizes.map(size => <th key={size} className="border border-black p-1">{size}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {data.assortiPack.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td className="border border-black p-0"><EditableField value={row.colorway} onChange={(e) => updateNestedData<AssortiPack>('assortiPack', rowIndex, 'colorway', e.target.value)} /></td>
                                        {assortiSizes.map(size => (
                                            <td key={size} className="border border-black p-0">
                                                <EditableField value={(row.sizes[size] || '').toString()} onChange={(e) => updateSizeData<AssortiPack>('assortiPack', rowIndex, size, e.target.value)} className="text-center"/>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Section>
                </main>
            </PageWrapper>

            {/* Page 3: Measurements */}
            <PageWrapper pageNumber="3">
                <TechpackHeader />
                <h2 className="text-xl font-bold my-2 text-center uppercase">MEASUREMENTS CHART</h2>
                <p className="text-right my-1 font-medium text-[10px]">ALL MEASUREMENTS ARE IN CM</p>
                <table className="w-full border-collapse border border-black text-center">
                    <thead className="bg-gray-100">
                        <tr className="font-bold">
                            <th className="border border-black p-1 w-8"></th>
                            <th className="border border-black p-1">POINTS OF MEASUREMENTS</th>
                            <th className="border border-black p-1">TOLERANCE (+/-)</th>
                            {measurementSizes.map(size => <th key={size} className="border border-black p-1 w-12">{size}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.measurements.map((row, rowIndex) => (
                            <tr key={row.point}>
                                <td className="border border-black p-1 font-bold bg-gray-100">{row.point}</td>
                                <td className="border border-black p-0 text-left">
                                    <EditableField value={row.description} onChange={(e) => updateNestedData<Measurement>('measurements', rowIndex, 'description', e.target.value)} className="px-2" />
                                </td>
                                <td className="border border-black p-0">
                                     <EditableField value={row.tolerance} onChange={(e) => updateNestedData<Measurement>('measurements', rowIndex, 'tolerance', e.target.value)} className="text-center" />
                                </td>
                                {measurementSizes.map(size => (
                                    <td key={size} className="border border-black p-0">
                                        <EditableField value={row.sizes[size] || ''} onChange={(e) => updateSizeData<Measurement>('measurements', rowIndex, size, e.target.value)} className="text-center" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </PageWrapper>

            {/* Page 4: Order Quantity */}
            <PageWrapper pageNumber="4">
                <TechpackHeader />
                <h2 className="text-xl font-bold my-8 text-center uppercase">TOTAL ORDER TABLE</h2>
                <div className="flex justify-center">
                    <table className="w-3/4 border-collapse border border-black text-center">
                        <thead className="bg-gray-100">
                            <tr className="font-bold">
                                <th className="border border-black p-2">COLORWAYS</th>
                                {orderSizes.map(size => <th key={size} className="border border-black p-2">{size}</th>)}
                                <th className="border border-black p-2">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.orderQuantities.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="border border-black p-0 font-bold text-left">
                                        <EditableField value={row.colorway} onChange={(e) => updateNestedData<OrderQuantity>('orderQuantities', rowIndex, 'colorway', e.target.value)} className="px-2" />
                                    </td>
                                    {orderSizes.map(size => (
                                        <td key={size} className="border border-black p-0">
                                            <EditableField value={(row.sizes[size] || 0).toString()} onChange={(e) => updateSizeData<OrderQuantity>('orderQuantities', rowIndex, size, e.target.value)} className="text-center" />
                                        </td>
                                    ))}
                                    <td className="border border-black p-2 font-bold">{row.total}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                             <tr className="font-bold bg-gray-100">
                                 <td colSpan={orderSizes.length + 1} className="text-right p-2 border border-black">TOTAL</td>
                                 <td className="border border-black p-2">
                                     {data.orderQuantities.reduce((sum, row) => sum + row.total, 0)}
                                 </td>
                             </tr>
                        </tfoot>
                    </table>
                </div>
            </PageWrapper>
        </>
    );
};
