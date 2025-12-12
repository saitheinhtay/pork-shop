import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, Scale, ArrowRight, Save, List, Edit2, Plus, Trash2, X, Check, Settings } from 'lucide-react';
import { Product, CarcassBatch, CutRecipe, BreakdownResult, UnitType } from '../types';

interface BackOfficeProps {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    batches: CarcassBatch[];
    recipe: CutRecipe;
    onCommitBreakdown: (batchId: string, results: BreakdownResult[]) => void;
    inventory: Record<string, number>;
    setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const BackOfficeView: React.FC<BackOfficeProps> = ({ 
    products, 
    setProducts,
    batches, 
    recipe, 
    onCommitBreakdown, 
    inventory,
    setInventory
}) => {
    const [activeTab, setActiveTab] = useState<'BREAKDOWN' | 'INVENTORY' | 'CATALOG'>('INVENTORY');
    
    // Breakdown State
    const [selectedBatchId, setSelectedBatchId] = useState<string>('');
    const [inputs, setInputs] = useState<Record<string, number>>({});
    const [isReportMode, setIsReportMode] = useState(false);

    // Inventory Edit State
    const [editInventoryMode, setEditInventoryMode] = useState(false);
    const [tempInventory, setTempInventory] = useState<Record<string, number>>({});

    // Catalog Edit State
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [tempProduct, setTempProduct] = useState<Partial<Product>>({});
    const [newProduct, setNewProduct] = useState<Partial<Product>>({ unitType: UnitType.KG, category: 'Raw Meat' });

    const selectedBatch = batches.find(b => b.id === selectedBatchId);

    // --- BREAKDOWN LOGIC ---
    const handleInputChange = (productId: string, val: string) => {
        setInputs(prev => ({ ...prev, [productId]: parseFloat(val) || 0 }));
    };

    const calculatedData = useMemo(() => {
        if (!selectedBatch) return [];
        return recipe.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            const expected = selectedBatch.initialWeightKg * item.expectedYieldPercentage;
            const actual = inputs[item.productId] || 0;
            const variance = actual - expected;
            const variancePercent = expected > 0 ? (variance / expected) * 100 : 0;
            return {
                name: product?.name || 'Unknown',
                productId: item.productId,
                expected: parseFloat(expected.toFixed(2)),
                actual: parseFloat(actual.toFixed(2)),
                variance: parseFloat(variance.toFixed(2)),
                variancePercent: parseFloat(variancePercent.toFixed(1))
            };
        });
    }, [selectedBatch, inputs, products, recipe]);

    const totalActualWeight = calculatedData.reduce((acc, curr) => acc + curr.actual, 0);
    const weightDifference = selectedBatch ? selectedBatch.initialWeightKg - totalActualWeight : 0;

    const handleCommit = () => {
        if (!selectedBatch) return;
        const results: BreakdownResult[] = calculatedData.map(d => ({
            productId: d.productId,
            actualWeight: d.actual,
            expectedWeight: d.expected,
            variance: d.variance
        }));
        onCommitBreakdown(selectedBatch.id, results);
        setSelectedBatchId('');
        setInputs({});
        setIsReportMode(false);
    };

    // --- INVENTORY LOGIC ---
    const totalInventoryValue = products.reduce((acc, product) => {
        const qty = inventory[product.id] || 0;
        return acc + (qty * product.pricePerUnit);
    }, 0);

    const totalInventoryWeight = products.reduce((acc, product) => {
        return acc + (inventory[product.id] || 0);
    }, 0);

    const startInventoryEdit = () => {
        setTempInventory({ ...inventory });
        setEditInventoryMode(true);
    };

    const saveInventoryEdit = () => {
        setInventory(tempInventory);
        setEditInventoryMode(false);
    };

    const handleInventoryChange = (id: string, val: string) => {
        setTempInventory(prev => ({
            ...prev,
            [id]: parseFloat(val) || 0
        }));
    };

    // --- CATALOG LOGIC ---
    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.pricePerUnit) return;
        const p: Product = {
            id: `p-${Date.now()}`,
            name: newProduct.name,
            pricePerUnit: Number(newProduct.pricePerUnit),
            category: newProduct.category || 'Raw Meat',
            unitType: newProduct.unitType || UnitType.KG,
            image: `https://picsum.photos/200/200?random=${Date.now()}`
        };
        setProducts([...products, p]);
        setNewProduct({ unitType: UnitType.KG, category: 'Raw Meat', name: '', pricePerUnit: 0 });
    };

    const startEditProduct = (p: Product) => {
        setEditingProductId(p.id);
        setTempProduct({ ...p });
    };

    const saveEditProduct = () => {
        setProducts(products.map(p => p.id === editingProductId ? { ...p, ...tempProduct } as Product : p));
        setEditingProductId(null);
    };

    const deleteProduct = (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                        <Package className="w-8 h-8 text-blue-600" />
                        Back Office
                    </h1>
                    <p className="text-slate-500 mt-2">Manage inventory, catalog, and processing.</p>
                </div>
                
                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('INVENTORY')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'INVENTORY' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <List className="w-4 h-4" /> Inventory
                    </button>
                    <button 
                        onClick={() => setActiveTab('CATALOG')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'CATALOG' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Settings className="w-4 h-4" /> Catalog
                    </button>
                    <button 
                        onClick={() => setActiveTab('BREAKDOWN')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'BREAKDOWN' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Scale className="w-4 h-4" /> Breakdown
                    </button>
                </div>
            </header>

            {activeTab === 'INVENTORY' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Current Stock Levels</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-6 text-sm">
                                <div className="flex flex-col items-end">
                                    <span className="text-slate-500">Total Weight</span>
                                    <span className="font-bold text-slate-800">{totalInventoryWeight.toFixed(2)} kg</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-slate-500">Total Valuation</span>
                                    <span className="font-bold text-emerald-600">฿{totalInventoryValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                </div>
                            </div>
                            {!editInventoryMode ? (
                                <button onClick={startInventoryEdit} className="ml-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Edit2 className="w-4 h-4" /> Adjust Stock
                                </button>
                            ) : (
                                <div className="flex gap-2 ml-4">
                                    <button onClick={() => setEditInventoryMode(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium text-sm">Cancel</button>
                                    <button onClick={saveInventoryEdit} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 flex items-center gap-2">
                                        <Save className="w-4 h-4" /> Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                    <th className="p-4 font-medium">Product Name</th>
                                    <th className="p-4 font-medium text-right">Price / Unit</th>
                                    <th className="p-4 font-medium text-right w-48">Stock Qty</th>
                                    <th className="p-4 font-medium text-right">Total Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map(product => {
                                    const qty = editInventoryMode ? (tempInventory[product.id] ?? inventory[product.id] ?? 0) : (inventory[product.id] || 0);
                                    const value = qty * product.pricePerUnit;
                                    return (
                                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-slate-800">{product.name}</div>
                                                <div className="text-xs text-slate-400 font-mono">ID: {product.id}</div>
                                            </td>
                                            <td className="p-4 text-right text-slate-600">฿{product.pricePerUnit.toFixed(2)}</td>
                                            <td className="p-4 text-right font-bold text-slate-800">
                                                {editInventoryMode ? (
                                                    <div className="flex justify-end items-center gap-2">
                                                        <input 
                                                            type="number" 
                                                            value={qty} 
                                                            onChange={(e) => handleInventoryChange(product.id, e.target.value)}
                                                            className="w-24 px-2 py-1 border border-slate-300 rounded text-right focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                        <span className="text-xs font-normal text-slate-400">{product.unitType}</span>
                                                    </div>
                                                ) : (
                                                    <>{qty.toFixed(2)} <span className="text-slate-400 font-normal text-xs">{product.unitType}</span></>
                                                )}
                                            </td>
                                            <td className="p-4 text-right text-slate-800">
                                                ฿{value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'CATALOG' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-lg font-bold text-slate-800">Product Catalog</h2>
                        <p className="text-slate-500 text-sm">Manage products, prices, and categories.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                    <th className="p-4 font-medium">Product Name</th>
                                    <th className="p-4 font-medium">Category</th>
                                    <th className="p-4 font-medium">Unit</th>
                                    <th className="p-4 font-medium text-right">Price (฿)</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map(p => {
                                    const isEditing = editingProductId === p.id;
                                    return (
                                        <tr key={p.id} className="group hover:bg-slate-50">
                                            <td className="p-4">
                                                {isEditing ? (
                                                    <input 
                                                        className="w-full px-2 py-1 border rounded"
                                                        value={tempProduct.name}
                                                        onChange={e => setTempProduct({...tempProduct, name: e.target.value})}
                                                    />
                                                ) : (
                                                    <span className="font-medium text-slate-800">{p.name}</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {isEditing ? (
                                                    <input 
                                                        className="w-full px-2 py-1 border rounded"
                                                        value={tempProduct.category}
                                                        onChange={e => setTempProduct({...tempProduct, category: e.target.value})}
                                                    />
                                                ) : (
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">{p.category}</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-slate-500">{p.unitType}</td>
                                            <td className="p-4 text-right">
                                                {isEditing ? (
                                                    <input 
                                                        type="number"
                                                        className="w-24 px-2 py-1 border rounded text-right"
                                                        value={tempProduct.pricePerUnit}
                                                        onChange={e => setTempProduct({...tempProduct, pricePerUnit: parseFloat(e.target.value)})}
                                                    />
                                                ) : (
                                                    <span className="font-mono text-slate-700">฿{p.pricePerUnit.toFixed(2)}</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button onClick={saveEditProduct} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                                                        <button onClick={() => setEditingProductId(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded"><X className="w-4 h-4" /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => startEditProduct(p)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                                        <button onClick={() => deleteProduct(p.id)} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {/* Add Row */}
                                <tr className="bg-blue-50/50">
                                    <td className="p-4">
                                        <input 
                                            placeholder="New Product Name"
                                            className="w-full px-2 py-1 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <input 
                                            placeholder="Category"
                                            className="w-full px-2 py-1 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <select 
                                            className="px-2 py-1 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                            value={newProduct.unitType}
                                            onChange={e => setNewProduct({...newProduct, unitType: e.target.value as UnitType})}
                                        >
                                            <option value={UnitType.KG}>KG</option>
                                            <option value={UnitType.UNIT}>Unit</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right">
                                        <input 
                                            type="number"
                                            placeholder="0.00"
                                            className="w-24 px-2 py-1 border border-blue-200 rounded text-right focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={newProduct.pricePerUnit || ''}
                                            onChange={e => setNewProduct({...newProduct, pricePerUnit: parseFloat(e.target.value)})}
                                        />
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={handleAddProduct}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 flex items-center gap-1 ml-auto"
                                        >
                                            <Plus className="w-4 h-4" /> Add
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'BREAKDOWN' && (
                <>
                    {!selectedBatchId ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {batches.filter(b => b.status === 'ACTIVE').map(batch => (
                                <div key={batch.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 cursor-pointer transition-colors" onClick={() => setSelectedBatchId(batch.id)}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-400">{batch.dateReceived}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">{batch.id}</h3>
                                    <p className="text-slate-600">{batch.sourceFarm}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-sm text-slate-500">Initial Weight</span>
                                        <span className="text-lg font-bold text-slate-800">{batch.initialWeightKg} kg</span>
                                    </div>
                                </div>
                            ))}
                            {batches.filter(b => b.status === 'ACTIVE').length === 0 && (
                                <div className="col-span-3 text-center py-12 text-slate-400">
                                    No active carcass batches available.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Processing: {selectedBatch.id}</h2>
                                    <p className="text-slate-500">Total Weight: {selectedBatch.initialWeightKg}kg • Recipe: {recipe.name}</p>
                                </div>
                                <button onClick={() => setSelectedBatchId('')} className="text-sm text-blue-600 hover:underline">Change Batch</button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                {/* Input Form */}
                                <div className="p-6 lg:col-span-1 border-r border-slate-200 overflow-y-auto max-h-[600px]">
                                    <h3 className="font-semibold mb-4 text-slate-700 flex items-center gap-2">
                                        <Scale className="w-5 h-5" /> Yield Inputs
                                    </h3>
                                    <div className="space-y-4">
                                        {recipe.items.map(item => {
                                            const product = products.find(p => p.id === item.productId);
                                            if (!product) return null;
                                            return (
                                                <div key={item.productId}>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">{product.name}</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="number" 
                                                            step="0.1"
                                                            value={inputs[item.productId] || ''}
                                                            onChange={(e) => handleInputChange(item.productId, e.target.value)}
                                                            className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                            placeholder="0.00"
                                                        />
                                                        <span className="absolute right-3 top-2 text-slate-400 text-sm">kg</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        Expected: {(selectedBatch.initialWeightKg * item.expectedYieldPercentage).toFixed(2)} kg
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    <div className={`mt-6 p-4 rounded-lg border ${Math.abs(weightDifference) > 1 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Total Input:</span>
                                            <span className="font-bold">{totalActualWeight.toFixed(2)} kg</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Unaccounted:</span>
                                            <span className={`font-bold ${weightDifference < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                                {weightDifference.toFixed(2)} kg
                                            </span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setIsReportMode(true)}
                                        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                                    >
                                        Generate Report <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Visualization / Report */}
                                <div className="p-6 lg:col-span-2 bg-slate-50 flex flex-col justify-center">
                                    {!isReportMode ? (
                                        <div className="text-center text-slate-400 py-20">
                                            <Scale className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                            <p>Enter yield weights to visualize efficiency.</p>
                                        </div>
                                    ) : (
                                        <div className="animate-fade-in">
                                            <h3 className="font-semibold mb-6 text-slate-700">Yield Efficiency Report</h3>
                                            <div className="h-80 w-full mb-8">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={calculatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="name" fontSize={12} tick={{fill: '#64748b'}} interval={0} />
                                                        <YAxis fontSize={12} tick={{fill: '#64748b'}} label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                                                        <Tooltip 
                                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                        />
                                                        <Legend />
                                                        <Bar dataKey="expected" fill="#94a3b8" name="Expected (kg)" radius={[4, 4, 0, 0]} />
                                                        <Bar dataKey="actual" fill="#3b82f6" name="Actual (kg)" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                    <h4 className="font-bold text-slate-800 mb-2">Variance Analysis</h4>
                                                    <ul className="space-y-2 text-sm">
                                                        {calculatedData.map(d => (
                                                            <li key={d.productId} className="flex justify-between">
                                                                <span>{d.name}</span>
                                                                <span className={d.variance < -0.5 ? 'text-red-500 font-bold' : d.variance > 0.5 ? 'text-green-600 font-bold' : 'text-slate-500'}>
                                                                    {d.variance > 0 ? '+' : ''}{d.variance} kg ({d.variancePercent > 0 ? '+' : ''}{d.variancePercent}%)
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 mb-2">Action Required</h4>
                                                        <p className="text-sm text-slate-600 mb-4">
                                                            Committing this breakdown will deplete <strong>{selectedBatch.id}</strong> and increment inventory for <strong>{calculatedData.length}</strong> SKUs.
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={handleCommit}
                                                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2"
                                                    >
                                                        <Save className="w-4 h-4" /> Commit to Inventory
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};