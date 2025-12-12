import React, { useState } from 'react';
import { Product, InventoryStock } from '../types';
import { ShoppingCart, Star, Clock, Info } from 'lucide-react';

interface WebAppProps {
    products: Product[];
    inventory: Record<string, number>;
}

export const WebAppView: React.FC<WebAppProps> = ({ products, inventory }) => {
    const [cartCount, setCartCount] = useState(0);

    const handleAddToCart = () => {
        setCartCount(prev => prev + 1);
        // In a real app, this would sync to the same backend
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Nav */}
            <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold">P</div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">PorkPrime<span className="text-rose-600">.</span></span>
                    </div>
                    <div className="flex gap-8 text-sm font-medium text-slate-600">
                        <a href="#" className="text-rose-600">Shop</a>
                        <a href="#" className="hover:text-slate-900">Our Source</a>
                        <a href="#" className="hover:text-slate-900">Recipes</a>
                    </div>
                    <div className="relative cursor-pointer">
                        <ShoppingCart className="w-6 h-6 text-slate-800" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <div className="bg-slate-900 text-white py-20 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="text-rose-400 font-bold tracking-wider text-xs uppercase mb-2 block">Farm to Table Traceability</span>
                    <h1 className="text-5xl font-extrabold mb-6">Premium Cuts, <br/>Transparent Sourcing.</h1>
                    <p className="text-slate-300 max-w-xl mx-auto mb-8 text-lg">Order online for Click & Collect. Real-time inventory from our butchery to your kitchen.</p>
                    <button className="bg-rose-600 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-700 transition-colors">
                        Start Order
                    </button>
                </div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1602498456745-e9503b30470b?auto=format&fit=crop&q=80')] bg-cover opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Fresh from the Counter</h2>
                        <p className="text-slate-500 mt-1">Available for pickup today.</p>
                    </div>
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.filter(p => p.category !== 'Waste').map(product => {
                        const stock = inventory[product.id] || 0;
                        const isOutOfStock = stock <= 0;

                        return (
                            <div key={product.id} className="group">
                                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-100">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                            <span className="bg-slate-900 text-white px-3 py-1 text-xs font-bold rounded uppercase">Sold Out</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{product.name}</h3>
                                        <p className="text-slate-500 text-sm mt-1 mb-2">฿{product.pricePerUnit.toFixed(2)} / {product.unitType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium mb-4 bg-emerald-50 w-fit px-2 py-1 rounded">
                                    <Clock className="w-3 h-3" />
                                    Live Stock: {stock.toFixed(1)} {product.unitType}
                                </div>
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className="w-full py-3 rounded-lg border-2 border-slate-900 font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:border-slate-200 disabled:text-slate-300 disabled:bg-transparent"
                                >
                                    {isOutOfStock ? 'Unavailable' : 'Add to Order'}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Traceability Info */}
            <div className="bg-slate-50 py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <Star className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Total Transparency</h2>
                    <p className="text-slate-600 mb-8">Every cut we sell is linked to a specific Batch ID. Scan the QR code on your receipt to see the farm source, date of processing, and grading details.</p>
                    <div className="flex justify-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow-sm">
                            <Info className="w-4 h-4 text-blue-500" />
                            Batch #2023-001 (Sunny Valley)
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow-sm">
                            <Info className="w-4 h-4 text-blue-500" />
                            Batch #2023-002 (Green Pastures)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};