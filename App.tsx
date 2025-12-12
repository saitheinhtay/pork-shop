import React, { useState } from 'react';
import { POSView } from './components/POSView';
import { BackOfficeView } from './components/BackOfficeView';
import { WebAppView } from './components/WebAppView';
import { MOCK_PRODUCTS, MOCK_BATCHES, STANDARD_PIG_RECIPE, INITIAL_INVENTORY } from './constants';
import { InventoryStock, CartItem, BreakdownResult } from './types';
import { Monitor, ShoppingCart, Settings, LayoutGrid } from 'lucide-react';

enum ViewMode {
    POS = 'POS',
    WEB = 'WEB',
    BACKOFFICE = 'BACKOFFICE'
}

const App: React.FC = () => {
    const [view, setView] = useState<ViewMode>(ViewMode.POS);
    
    // Global State (In a real app, this would be Redux/Context/TanStack Query)
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [batches, setBatches] = useState(MOCK_BATCHES);
    const [inventory, setInventory] = useState(INITIAL_INVENTORY);

    // Core Logic: Carcass Breakdown (Requirement #3)
    const handleCommitBreakdown = (batchId: string, results: BreakdownResult[]) => {
        // 1. Deplete the Batch
        setBatches(prev => prev.map(b => 
            b.id === batchId ? { ...b, status: 'DEPLETED', remainingWeightKg: 0 } : b
        ));

        // 2. Update Inventory (Atomic increment of all cuts)
        setInventory(prev => {
            const next = { ...prev };
            results.forEach(res => {
                const currentStock = next[res.productId] || 0;
                next[res.productId] = currentStock + res.actualWeight;
            });
            return next;
        });

        alert(`Batch ${batchId} processed. Inventory updated successfully.`);
    };

    // Core Logic: POS Checkout (Requirement #2)
    const handlePOSCheckout = (items: CartItem[]) => {
        setInventory(prev => {
            const next = { ...prev };
            items.forEach(item => {
                const currentStock = next[item.product.id] || 0;
                // Decrement stock
                next[item.product.id] = Math.max(0, currentStock - item.quantity);
            });
            return next;
        });
        alert('Transaction Completed. Inventory Decremented.');
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
            {/* Top Navigation / Persona Switcher */}
            <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shadow-md z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-rose-600 p-1.5 rounded-lg">
                        <LayoutGrid className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-wide">PorkPrime System</span>
                </div>

                <div className="flex bg-slate-800 rounded-lg p-1">
                    <button 
                        onClick={() => setView(ViewMode.POS)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === ViewMode.POS ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Monitor className="w-4 h-4" /> POS Terminal
                    </button>
                    <button 
                        onClick={() => setView(ViewMode.WEB)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === ViewMode.WEB ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        <ShoppingCart className="w-4 h-4" /> Web Store
                    </button>
                    <button 
                        onClick={() => setView(ViewMode.BACKOFFICE)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === ViewMode.BACKOFFICE ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Settings className="w-4 h-4" /> Back Office
                    </button>
                </div>

                <div className="text-xs text-slate-400">
                    Unified Database Connection <span className="text-green-400 ml-1">● Active</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto">
                {view === ViewMode.POS && (
                    <POSView 
                        products={products} 
                        onCheckout={handlePOSCheckout} 
                    />
                )}
                
                {view === ViewMode.BACKOFFICE && (
                    <BackOfficeView 
                        products={products} 
                        setProducts={setProducts}
                        batches={batches}
                        recipe={STANDARD_PIG_RECIPE}
                        onCommitBreakdown={handleCommitBreakdown}
                        inventory={inventory}
                        setInventory={setInventory}
                    />
                )}

                {view === ViewMode.WEB && (
                    <WebAppView 
                        products={products} 
                        inventory={inventory} 
                    />
                )}
            </main>
        </div>
    );
};

export default App;