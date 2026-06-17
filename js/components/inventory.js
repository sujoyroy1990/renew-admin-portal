// =========================================================================
// js/components/inventory.js — E-COMMERCE RETAIL ENGINE WITH LOCAL IMAGE UPLOAD
// =========================================================================

let currentInventoryCat = 'all';
let inventorySearchQuery = '';

// ১. সেন্ট্রালাইজড গ্লোবাল ইনভেন্টরি ডাটাবেস (E-commerce Products)
if (!window.MOCK_INVENTORY) {
    window.MOCK_INVENTORY = [
        { id: "PRD-201", name: "Premium Whey Isolate (1kg)", category: "supplements", price: 3500, stock: 15, maxStock: 50, image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=300" },
        { id: "PRD-202", name: "Pro Boxing Leather Gloves", category: "gear", price: 2200, stock: 4, maxStock: 20, image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=300" },
        { id: "PRD-203", name: "RENEW Fighter Stringer/T-Shirt", category: "apparel", price: 650, stock: 32, maxStock: 100, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300" },
        { id: "PRD-204", name: "Pre-Workout Energy Explode", category: "supplements", price: 1800, stock: 0, maxStock: 30, image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300" },
        { id: "PRD-205", name: "Smart Neon Shaker Bottle", category: "gear", price: 450, stock: 8, maxStock: 25, image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300" }
    ];
}

// ২. ই-কমার্স ভিউ লেআউট টেমপ্লেট
function getInventoryView() {
    return `
        <div class="space-y-6">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-darkSurface border border-gray-800 p-4 rounded-xl">
                <div class="relative flex-1 max-w-sm">
                    <i class="ph ph-magnifying-glass absolute left-3 top-3.5 text-gray-500 text-lg"></i>
                    <input type="text" id="inv-search" oninput="window.handleInventorySearch()" placeholder="Search gym store products..." class="w-full bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-brandRed transition-colors">
                </div>
                
                <div class="flex flex-wrap items-center gap-3">
                    <div class="flex bg-black/40 p-1 rounded-lg border border-gray-800 text-[11px] uppercase tracking-wider font-semibold">
                        <button onclick="window.switchInventoryCat('all')" id="btn-cat-all" class="px-3 py-1.5 rounded-md transition-all ${currentInventoryCat === 'all' ? 'bg-brandRed text-white' : 'text-gray-400'}">All Items</button>
                        <button onclick="window.switchInventoryCat('supplements')" id="btn-cat-supplements" class="px-3 py-1.5 rounded-md transition-all ${currentInventoryCat === 'supplements' ? 'bg-brandRed text-white' : 'text-gray-400'}">Supplements</button>
                        <button onclick="window.switchInventoryCat('gear')" id="btn-cat-gear" class="px-3 py-1.5 rounded-md transition-all ${currentInventoryCat === 'gear' ? 'bg-brandRed text-white' : 'text-gray-400'}">Gears</button>
                        <button onclick="window.switchInventoryCat('apparel')" id="btn-cat-apparel" class="px-3 py-1.5 rounded-md transition-all ${currentInventoryCat === 'apparel' ? 'bg-brandRed text-white' : 'text-gray-400'}">Apparel</button>
                    </div>

                    <button onclick="window.openAddProductModal()" class="bg-brandRed hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow">
                        <i class="ph ph-plus-circle text-base"></i>
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" id="inventory-grid"></div>

            <div id="transaction-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"></div>
        </div>
    `;
}

// ৩. ইনভেন্টরি পেজ রেন্ডারার মাস্টার কন্ট্রোলার
function renderInventoryPage() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;

    let filtered = window.MOCK_INVENTORY || [];

    if (currentInventoryCat !== 'all') {
        filtered = filtered.filter(p => p.category === currentInventoryCat);
    }

    if (inventorySearchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(inventorySearchQuery.toLowerCase()));
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center text-gray-600 text-sm italic border border-dashed border-gray-800 rounded-2xl bg-darkSurface/20">No marketplace products found matching criteria.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        let stockBadge = `<span class="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">In Stock (${p.stock})</span>`;
        if (p.stock === 0) {
            stockBadge = `<span class="text-[9px] bg-red-500/10 text-brandRed border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">Out of Stock</span>`;
        } else if (p.stock <= 5) {
            stockBadge = `<span class="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Low Stock (${p.stock})</span>`;
        }

        const stockPct = Math.min(Math.round((p.stock / p.maxStock) * 100), 100);

        return `
            <div class="bg-darkSurface border border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-gray-700 transition-all relative shadow-lg">
                
                <div class="w-full h-44 bg-gray-900 relative overflow-hidden">
                    <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${p.name}">
                    <div class="absolute top-3 left-3">${stockBadge}</div>
                    <div class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-green-400 border border-gray-800">₹${p.price.toLocaleString()}</div>
                </div>

                <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                        <span class="text-[9px] font-mono text-gray-500 uppercase font-bold tracking-wider">${p.category}</span>
                        <h4 class="text-white font-bold text-sm tracking-wide mt-0.5 line-clamp-1 group-hover:text-brandRed transition-colors">${p.name}</h4>
                        <p class="text-[10px] font-mono text-gray-500 mt-1">SKU ID: ${p.id}</p>
                    </div>

                    <div class="space-y-1">
                        <div class="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-gray-800">
                            <div class="h-full rounded-full transition-all duration-300 ${p.stock === 0 ? 'bg-red-500' : p.stock <= 5 ? 'bg-amber-500' : 'bg-green-500'}" style="width: ${stockPct}%"></div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/40">
                        <button onclick="window.sellInventoryItem('${p.id}')" ${p.stock === 0 ? 'disabled' : ''} class="bg-green-500 hover:bg-green-600 disabled:bg-gray-800 text-black disabled:text-gray-600 py-1.5 rounded-lg text-[11px] font-extrabold transition-all flex items-center justify-center space-x-1 shadow">
                            <i class="ph ph-shopping-cart-simple text-xs"></i><span>Sell 1 Unit</span>
                        </button>
                        <button onclick="window.restockInventoryItem('${p.id}')" class="bg-black/50 hover:bg-black border border-gray-700 text-gray-300 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1">
                            <i class="ph ph-arrows-counter-clockwise text-xs"></i><span>Restock</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// =========================================================================
// গ্লোবাল বাইন্ডেড ইনভেন্টরি ফাংশনস (WINDOW BINDING)
// =========================================================================

window.handleInventorySearch = function() {
    const input = document.getElementById('inv-search');
    if (input) { inventorySearchQuery = input.value; renderInventoryPage(); }
};

window.switchInventoryCat = function(cat) {
    currentInventoryCat = cat;
    const btns = document.querySelectorAll('[id^="btn-cat-"]');
    btns.forEach(b => { b.className = b.className.replace('bg-brandRed text-white', 'text-gray-400'); });
    const activeBtn = document.getElementById(`btn-cat-${cat}`);
    if (activeBtn) activeBtn.className += ' bg-brandRed text-white';
    renderInventoryPage();
};

window.sellInventoryItem = function(id) {
    const item = window.MOCK_INVENTORY.find(p => p.id === id);
    if (!item || item.stock <= 0) return;

    item.stock -= 1;

    if (window.MOCK_TRANSACTIONS) {
        window.MOCK_TRANSACTIONS.unshift({
            id: `TXN-${String(window.MOCK_TRANSACTIONS.length + 1).padStart(3, '0')}`,
            type: "income",
            category: "supplement",
            amount: item.price,
            date: new Date().toISOString().slice(0,10),
            status: "paid",
            mode: "Cash",
            description: `Store POS Sale: 1x ${item.name}`,
            trainerId: ""
        });
    }

    alert(`🛒 MARKETPLACE DISPATCH:\n1 unit of "${item.name}" sold successfully!\n\n💸 Ledger Sync: Inflow entry of ₹${item.price.toLocaleString()} registered under SUPPLEMENT sales.`);
    renderInventoryPage();
};

window.restockInventoryItem = function(id) {
    const item = window.MOCK_INVENTORY.find(p => p.id === id);
    if (!item) return;

    const count = parseInt(prompt(`Bulk Restock For: ${item.name}\nEnter incoming item volume count:`));
    if (isNaN(count) || count <= 0) return;

    item.stock = Math.min(item.stock + count, item.maxStock);
    alert(`Authorized!\nMaster Inventory stock updated for "${item.name}". Current count: ${item.stock}/${item.maxStock}.`);
    renderInventoryPage();
};

// লোকাল ডিভাইস থেকে ছবি এনকোড করার ফাংশন (Base64)
window.handleImageUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // হিডেন ইনপুটে Base64 কোডটি স্টোর করা হচ্ছে
            document.getElementById('prd-image-base64').value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

window.openAddProductModal = function() {
    const modal = document.getElementById('transaction-modal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[360px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-5 flex flex-col relative text-xs text-left">
                <button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                
                <div class="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4">
                    <i class="ph ph-shopping-bag-open text-xl text-brandRed"></i>
                    <h3 class="font-bold text-white text-sm tracking-wide">Add Store Product</h3>
                </div>

                <div class="space-y-3">
                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Product Image (Upload Local File)</label>
                        <input type="file" id="prd-image-file" accept="image/*" onchange="window.handleImageUpload(event)" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 text-xs focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-brandRed file:text-white hover:file:bg-red-700 cursor-pointer">
                        <input type="hidden" id="prd-image-base64" value="">
                    </div>

                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Product Title</label>
                        <input type="text" id="prd-name" placeholder="e.g. Creatine Monohydrate (250g)" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-brandRed">
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Market Price (₹)</label>
                            <input type="number" id="prd-price" placeholder="e.g. 1200" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 font-mono">
                        </div>
                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Initial Stock</label>
                            <input type="number" id="prd-stock" placeholder="e.g. 10" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 font-mono">
                        </div>
                    </div>
                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Product Store Category</label>
                        <select id="prd-cat" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none">
                            <option value="supplements">Supplements & Nutrition</option>
                            <option value="gear">Fighting Gear & Kits</option>
                            <option value="apparel">Apparel & Gym Clothing</option>
                        </select>
                    </div>
                </div>

                <button onclick="window.submitNewProduct()" class="w-full bg-brandRed hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-lg mt-5 uppercase tracking-wide">Deploy Item to Storefront</button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.add('scale-100'); }, 10);
    modal.onclick = window.closeTransactionModal;
};

window.submitNewProduct = function() {
    const name = document.getElementById('prd-name').value.trim();
    const price = parseFloat(document.getElementById('prd-price').value);
    const stock = parseInt(document.getElementById('prd-stock').value);
    const category = document.getElementById('prd-cat').value;
    const uploadedImage = document.getElementById('prd-image-base64').value; // Base64 কোড রিড করা হচ্ছে

    if (!name || isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
        alert("Validation Failed:\nPlease fill out all fields with valid numbers!");
        return;
    }

    // ছবি আপলোড না করলে ক্যাটাগরি অনুযায়ী ডামি ইমেজ দেওয়া হবে
    let finalImg = uploadedImage;
    if (!finalImg) {
        finalImg = "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=300";
        if (category === 'gear') finalImg = "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=300";
        if (category === 'apparel') finalImg = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300";
    }

    const newPrd = {
        id: `PRD-${window.MOCK_INVENTORY.length + 201}`,
        name: name,
        category: category,
        price: price,
        stock: stock,
        maxStock: stock * 3 || 50,
        image: finalImg // ডাটাবেসে লোকাল ছবি সেভ করা হলো
    };

    window.MOCK_INVENTORY.unshift(newPrd);
    alert(`Success!\n"${name}" is now live on your gym e-commerce storefront with the uploaded image.`);
    window.closeTransactionModal();
    renderInventoryPage();
};

window.closeTransactionModal = function() {
    const modal = document.getElementById('transaction-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    if (modal.firstElementChild) {
        modal.firstElementChild.classList.remove('scale-100');
        modal.firstElementChild.classList.add('scale-95');
    }
    setTimeout(() => { modal.classList.add('hidden'); }, 200);
};