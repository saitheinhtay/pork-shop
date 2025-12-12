import React, { useState } from 'react';
import { Product, UnitType, CartItem } from '../types';
import { Search, Plus, Trash2, ShoppingBag, CreditCard, RotateCcw } from 'lucide-react';

interface POSProps {
    products: Product[];
    onCheckout: (items: CartItem[]) => void;
}

export const POSView: React.FC<POSProps> = ({ products, onCheckout }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [scaleWeight, setScaleWeight] = useState<number>(1.25); // Simulated scale input
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const addToCart = (product: Product) => {
        const quantity = product.unitType === UnitType.KG ? scaleWeight : 1;
        const newItem: CartItem = {
            id: Date.now().toString(),
            product,
            quantity: parseFloat(quantity.toFixed(3)),
            totalPrice: parseFloat((product.pricePerUnit * quantity).toFixed(2)),
            batchId: product.unitType === UnitType.KG ? 'BATCH-ACTIVE-001' : undefined // Simulated automated batch tracking
        };
        setCart([...cart, newItem]);
    };

    const removeFromCart = (itemId: string) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <div className="flex h-[calc(100vh-64px)] bg-slate-100 overflow-hidden">
            {/* Left: Product Catalog */}
            <div className="flex-1 flex flex-col p-4 border-r border-slate-200 pr-6">
                
                {/* Scale Simulation Bar */}
                <div className="bg-slate-800 text-white p-4 rounded-xl mb-4 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-700 p-2 rounded-lg">
                            <span className="text-xs text-slate-400 block uppercase tracking-wider">Scale Reading</span>
                            <span className="text-3xl font-mono text-green-400 font-bold">{scaleWeight.toFixed(3)} kg</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="5.0" 
                            step="0.05" 
                            value={scaleWeight} 
                            onChange={(e) => setScaleWeight(parseFloat(e.target.value))}
                            className="w-48 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-slate-400 block">Status</span>
                        <span className="text-sm font-bold text-green-400">● STABLE</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                    {filteredProducts.map(product => (
                        <button 
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-start text-left group"
                        >
                            <div className="h-32 w-full bg-slate-100 rounded-lg mb-3 overflow-hidden relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                    {product.unitType === UnitType.KG ? 'Variable' : 'Fixed'}
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                            <div className="mt-auto pt-2 w-full flex justify-between items-end">
                                <span className="text-blue-600 font-bold">฿{product.pricePerUnit.toFixed(2)}<span className="text-xs text-slate-400 font-normal">/{product.unitType}</span></span>
                                <div className="bg-blue-50 p-1.5 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Plus className="w-4 h-4" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Cart */}
            <div className="w-96 bg-white shadow-xl flex flex-col z-10">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" /> Current Order
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Order #POS-{Date.now().toString().slice(-6)}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div>
                                    <h4 className="font-medium text-slate-800">{item.product.name}</h4>
                                    <div className="text-xs text-slate-500 mt-1 space-y-1">
                                        <p>{item.quantity} {item.product.unitType} @ ฿{item.product.pricePerUnit}</p>
                                        {item.batchId && <p className="font-mono text-[10px] bg-slate-200 inline-block px-1 rounded">LOT: {item.batchId}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="font-bold text-slate-800">฿{item.totalPrice.toFixed(2)}</span>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-bold text-slate-800">฿{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setCart([])}
                            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-300 font-bold text-slate-600 hover:bg-white transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                        <button 
                            onClick={() => {
                                onCheckout(cart);
                                setCart([]);
                            }}
                            disabled={cart.length === 0}
                            className="flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CreditCard className="w-4 h-4" /> Pay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};