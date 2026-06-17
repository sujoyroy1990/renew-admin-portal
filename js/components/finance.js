// =========================================================================
// js/components/finance.js — FULL ERP WITH SECURITY PURGE, EVENT LINK & PLAN CONFIG
// =========================================================================

let currentFinanceTab = 'all'; 
let financeSearchQuery = '';
let pulseTimeframe = 'monthly'; 
let showAIReport = false;
let selectedFormType = 'income';

const ADMIN_SECURE_PASSWORD = "admin123";

// ১. গ্লোবাল প্ল্যান ডাটাবেস (NEW LOGIC: For Members Plan Switching)
if (!window.GYM_PLANS) {
    window.GYM_PLANS = [
        { id: "PLN-1", name: "Monthly Regular Track", fee: 1500 },
        { id: "PLN-2", name: "Fighter Premium Track", fee: 2500 },
        { id: "PLN-3", name: "PT Combo Track", fee: 4000 },
        { id: "PLN-4", name: "Elite Annual Pack", fee: 15000 }
    ];
}

// ২. গ্লোবাল ফিজ ডাটাবেস
if (!window.GYM_FEES) {
    window.GYM_FEES = { "advance fee": 5000, "membership fee": 2500, "PT": 15000, "diet plan": 2000, "supplement": 3500, "Events booking": 4500, "other": 1000 };
}

// ৩. গ্লোবাল ট্রানজেকশন খাতা
if (!window.MOCK_TRANSACTIONS) {
    window.MOCK_TRANSACTIONS = [
        { id: "TXN-001", type: "income", category: "PT", amount: 15000, date: "2026-06-01", status: "paid", mode: "UPI", description: "PT Combo - Sourav Ganguly", trainerId: "t1" },
        { id: "TXN-002", type: "income", category: "diet plan", amount: 2000, date: "2026-06-02", status: "paid", mode: "Cash", description: "Keto Diet Chart - Sourav", trainerId: "t1" },
        { id: "TXN-003", type: "expense", category: "rent", amount: 25000, date: "2026-06-05", status: "paid", mode: "Bank", description: "Main Floor Gym Rent" },
        { id: "TXN-004", type: "income", category: "supplement", amount: 3500, date: "2026-06-10", status: "paid", mode: "Card", description: "Isolate Whey Protein - Anirban", trainerId: "t2" },
        { id: "TXN-005", type: "expense", category: "salaries", amount: 15000, date: "2026-06-11", status: "paid", mode: "UPI", description: "Trainer Basic Salary - Rahul" },
        { id: "TXN-006", type: "income", category: "membership fee", amount: 2500, date: "2026-06-12", status: "pending", mode: "UPI", description: "Monthly Renew - Subham Das", trainerId: "" },
        { id: "TXN-007", type: "expense", category: "marketing", amount: 5000, date: "2026-06-13", status: "paid", mode: "UPI", description: "Facebook Local Hyper-Targeted Ads" },
        { id: "TXN-008", type: "income", category: "Events booking", amount: 1500, date: "2026-06-14", status: "paid", mode: "UPI", description: "MMA Workshop Booking [EVT-101]", trainerId: "t1" },
        { id: "TXN-009", type: "income", category: "advance fee", amount: 5000, date: "2026-06-15", status: "pending", mode: "UPI", description: "Advance Fee (Fighter Gated) - Joydeep Pal", trainerId: "", portalLocked: true }
    ];
}

function getFinanceView() {
    return `
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-darkSurface border border-gray-800 p-4 rounded-xl">
                <div>
                    <h3 class="text-white font-semibold">Financial Command Center</h3>
                    <p class="text-xs text-gray-500">Manage security clearances, core configurations & active cash ledger flow.</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="window.openPlanManagerModal()" class="border border-indigo-500/30 hover:border-indigo-500 bg-indigo-950/20 hover:bg-indigo-900 text-indigo-300 text-xs font-bold px-3 py-2.5 rounded-lg transition-all flex items-center space-x-1.5 shadow">
                        <i class="ph ph-list-numbers"></i><span>Plan Config</span>
                    </button>
                    <button onclick="window.openFeesConfigModal()" class="border border-purple-500/30 hover:border-purple-500 bg-purple-950/20 hover:bg-purple-900 text-purple-300 text-xs font-bold px-3 py-2.5 rounded-lg transition-all flex items-center space-x-1.5 shadow">
                        <i class="ph ph-sliders"></i><span>Manage Base Fees</span>
                    </button>
                    <button onclick="window.simulateFighterRegistration()" class="border border-gray-800 hover:border-gray-700 bg-black/40 hover:bg-black text-gray-400 hover:text-white text-xs font-bold px-3 py-2.5 rounded-lg transition-all flex items-center space-x-1.5 shadow">
                        <i class="ph ph-sparkle"></i><span>Simulate Fighter Reg</span>
                    </button>
                    <button onclick="window.openTransactionModal()" class="bg-brandRed hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow">
                        <i class="ph ph-plus-circle text-base"></i><span>Add Cash Entry</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="finance-metrics-cards"></div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 bg-darkSurface border border-gray-800 p-5 rounded-2xl flex flex-col space-y-4" id="pulse-cashflow-box"></div>
                <div class="lg:col-span-1 bg-darkSurface border border-gray-800 p-5 rounded-2xl flex flex-col justify-between" id="trainer-targets-box"></div>
            </div>

            <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl" id="pending-dues-reminder-box"></div>
            <div class="bg-gradient-to-r from-purple-950/40 to-black border border-purple-900/40 p-5 rounded-2xl" id="ai-analysis-container"></div>

            <div class="space-y-4">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-darkSurface border border-gray-800 p-4 rounded-xl">
                    <div class="relative flex-1 max-w-md">
                        <i class="ph ph-magnifying-glass absolute left-3 top-3.5 text-gray-500 text-lg"></i>
                        <input type="text" id="finance-search" oninput="window.handleFinanceSearch()" placeholder="Search transactions by description..." class="w-full bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-brandRed transition-colors">
                    </div>
                    <div class="flex bg-black/40 p-1 rounded-lg border border-gray-800" id="txn-filter-tabs"></div>
                </div>

                <div class="bg-darkSurface border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-400">
                            <thead class="text-xs uppercase bg-black/30 text-gray-500 border-b border-gray-800">
                                <tr>
                                    <th class="py-3.5 px-6">TXN ID</th>
                                    <th class="py-3.5 px-6">Description</th>
                                    <th class="py-3.5 px-6">Category</th>
                                    <th class="py-3.5 px-6">Mode</th>
                                    <th class="py-3.5 px-6">Date</th>
                                    <th class="py-3.5 px-6 text-right">Flow Amount</th>
                                    <th class="py-3.5 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-800/50" id="finance-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="transaction-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"></div>
        </div>
    `;
}

function renderFinancePage() {
    renderFinanceMetrics();
    renderPulseCashFlow();
    renderTrainerTargets();
    renderPendingDuesPanel(); 
    renderAIAnalysisReport();
    renderTransactionFilterTabs();
    renderTransactionTable();
}

function renderFinanceMetrics() {
    const container = document.getElementById('finance-metrics-cards');
    if (!container) return;

    const txns = window.MOCK_TRANSACTIONS;
    const totalInflow = txns.filter(t => t.type === 'income' && t.status === 'paid').reduce((sum, t) => sum + t.amount, 0);
    const totalOutflow = txns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netCashBalance = totalInflow - totalOutflow;
    const pendingDues = txns.filter(t => t.type === 'income' && t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
    const overdueBadDebt = txns.filter(t => t.type === 'income' && t.status === 'overdue').reduce((sum, t) => sum + t.amount, 0);

    container.innerHTML = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-xl">
            <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Pending Active Dues</p>
            <h4 class="text-lg font-bold text-amber-400 mt-1">₹${pendingDues.toLocaleString()}</h4>
        </div>
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-xl ${netCashBalance >= 0 ? 'border-l-2 border-l-green-500' : 'border-l-2 border-l-red-500'}">
            <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Net Cash Balance</p>
            <h4 class="text-lg font-bold text-white mt-1">₹${netCashBalance.toLocaleString()}</h4>
        </div>
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-xl">
            <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Total Inflow (Income)</p>
            <h4 class="text-lg font-bold text-green-400 mt-1">₹${totalInflow.toLocaleString()}</h4>
        </div>
        <div class="bg-darkSurface border border-gray-400/10 p-4 rounded-xl">
            <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Total Outflow (Expense)</p>
            <h4 class="text-lg font-bold text-brandRed mt-1">₹${totalOutflow.toLocaleString()}</h4>
        </div>
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-xl">
            <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Overdue Bad Debt</p>
            <h4 class="text-lg font-bold text-red-600 mt-1">₹${overdueBadDebt.toLocaleString()}</h4>
        </div>
    `;
}

function renderPulseCashFlow() {
    const container = document.getElementById('pulse-cashflow-box');
    if (!container) return;

    const txns = window.MOCK_TRANSACTIONS || [];
    const juneIncome = txns.filter(t => t.type === 'income' && t.status === 'paid' && t.date.includes('-06-')).reduce((sum, t) => sum + t.amount, 0);
    const juneExpense = txns.filter(t => t.type === 'expense' && t.date.includes('-06-')).reduce((sum, t) => sum + t.amount, 0);

    const maxVal = 50000;
    const getGraphY = (val) => 120 - Math.min((val / maxVal) * 90, 100);
    const juneIncY = getGraphY(juneIncome);
    const juneExpY = getGraphY(juneExpense);

    const incomePath = `M 50 75 L 170 65 L 290 50 L 410 ${juneIncY}`;
    const expensePath = `M 50 115 L 170 95 L 290 105 L 410 ${juneExpY}`;

    const ptTotal = txns.filter(t => t.type === 'income' && t.status === 'paid' && t.category.toLowerCase() === 'pt').reduce((s,t)=>s+t.amount, 0);
    const membershipTotal = txns.filter(t => t.type === 'income' && t.status === 'paid' && t.category.toLowerCase() === 'membership fee').reduce((s,t)=>s+t.amount, 0);
    const expenseRent = txns.filter(t => t.type === 'expense' && t.category.toLowerCase() === 'rent').reduce((s,t)=>s+t.amount, 0);

    container.innerHTML = `
        <style>
            .pipeline-line { transition: stroke-width 0.3s ease, filter 0.3s ease; cursor: pointer; }
            .income-pipe:hover { stroke-width: 4.5px; filter: drop-shadow(0px 0px 8px rgba(34, 197, 94, 0.8)); }
            .expense-pipe:hover { stroke-width: 4.5px; filter: drop-shadow(0px 0px 8px rgba(255, 0, 51, 0.8)); }
            .pulse-node { transition: r 0.2s ease; cursor: pointer; }
            .pulse-node:hover { r: 7px; }
        </style>

        <div class="flex justify-between items-center border-b border-gray-800/60 pb-2 relative">
            <div class="flex items-center space-x-2">
                <span class="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <h4 class="text-gray-400 font-semibold tracking-wide text-xs uppercase">Pulse Cash Flow Tracking</h4>
            </div>
            <div class="flex items-center space-x-4 text-[10px]">
                <div class="flex items-center space-x-1.5"><span class="w-3 h-0.5 bg-green-500 inline-block rounded"></span><span class="text-gray-400">Inflow</span></div>
                <div class="flex items-center space-x-1.5"><span class="w-3 h-0.5 bg-brandRed inline-block rounded"></span><span class="text-gray-400">Outflow</span></div>
            </div>
        </div>

        <div class="w-full pt-4 relative" id="graph-wrapper-area">
            <div id="graph-glass-box" class="absolute hidden backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 shadow-xl z-30 text-left pointer-events-none"></div>

            <svg viewBox="0 0 460 150" class="w-full h-32 overflow-visible">
                <line x1="30" y1="25" x2="430" y2="25" stroke="#1F2937" stroke-dasharray="4" />
                <line x1="30" y1="65" x2="430" y2="65" stroke="#1F2937" stroke-dasharray="4" />
                <line x1="30" y1="105" x2="430" y2="105" stroke="#1F2937" stroke-dasharray="4" />
                
                <path d="${incomePath}" fill="none" stroke="#22C55E" stroke-width="2.5" class="pipeline-line income-pipe" onclick="window.triggerLineGlow('income')" />
                <path d="${expensePath}" fill="none" stroke="#FF0033" stroke-width="2.5" class="pipeline-line expense-pipe" onclick="window.triggerLineGlow('expense')" />
                
                <circle cx="50" cy="75" r="3.5" fill="#22C55E" class="pulse-node" onclick="window.triggerGlassBox('MAR', 'income', 32000, 50, 75, '#22C55E')" />
                <circle cx="170" cy="65" r="3.5" fill="#22C55E" class="pulse-node" onclick="window.triggerGlassBox('APR', 'income', 35000, 170, 65, '#22C55E')" />
                <circle cx="290" cy="50" r="3.5" fill="#22C55E" class="pulse-node" onclick="window.triggerGlassBox('MAY', 'income', 42000, 290, 50, '#22C55E')" />
                <circle cx="410" cy="${juneIncY}" r="4.5" fill="#22C55E" stroke="#1E1E1E" stroke-width="1.5" class="pulse-node" onclick="window.triggerGlassBox('JUN (LIVE)', 'income', ${juneIncome}, 410, ${juneIncY}, '#22C55E')" />

                <circle cx="50" cy="115" r="3.5" fill="#FF0033" class="pulse-node" onclick="window.triggerGlassBox('MAR', 'expense', 15000, 50, 115, '#FF0033')" />
                <circle cx="170" cy="95" r="3.5" fill="#FF0033" class="pulse-node" onclick="window.triggerGlassBox('APR', 'expense', 22000, 170, 95, '#FF0033')" />
                <circle cx="290" cy="105" r="3.5" fill="#FF0033" class="pulse-node" onclick="window.triggerGlassBox('MAY', 'expense', 18000, 290, 105, '#FF0033')" />
                <circle cx="410" cy="${juneExpY}" r="4.5" fill="#FF0033" stroke="#1E1E1E" stroke-width="1.5" class="pulse-node" onclick="window.triggerGlassBox('JUN (LIVE)', 'expense', ${juneExpense}, 410, ${juneExpY}, '#FF0033')" />

                <text x="50" y="142" fill="#4B5563" font-size="9" text-anchor="middle">MAR</text>
                <text x="170" y="142" fill="#4B5563" font-size="9" text-anchor="middle">APR</text>
                <text x="290" y="142" fill="#4B5563" font-size="9" text-anchor="middle">MAY</text>
                <text x="410" y="142" fill="#FFFFFF" font-size="9" font-weight="bold" text-anchor="middle">JUN (LIVE)</text>
            </svg>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs border-t border-gray-800/40">
            <div>
                <h5 class="text-gray-500 text-[10px] uppercase font-bold mb-2">Income Mix Share</h5>
                <div class="space-y-1.5">
                    <div><div class="flex justify-between text-[10px] text-gray-400"><span>PT Sales</span><span>₹${ptTotal.toLocaleString()}</span></div><div class="w-full bg-black/40 h-1.5 rounded"><div class="bg-green-500 h-1.5 rounded" style="width: 75%"></div></div></div>
                    <div><div class="flex justify-between text-[10px] text-gray-400"><span>Membership</span><span>₹${membershipTotal.toLocaleString()}</span></div><div class="w-full bg-black/40 h-1.5 rounded"><div class="bg-blue-400 h-1.5 rounded" style="width: 20%"></div></div></div>
                </div>
            </div>
            <div>
                <h5 class="text-gray-500 text-[10px] uppercase font-bold mb-2">Expense Mix Share</h5>
                <div class="space-y-1.5">
                    <div><div class="flex justify-between text-[10px] text-gray-400"><span>Rent & Operations</span><span>₹${expenseRent.toLocaleString()}</span></div><div class="w-full bg-black/40 h-1.5 rounded"><div class="bg-brandRed h-1.5 rounded" style="width: 60%"></div></div></div>
                </div>
            </div>
        </div>
    `;
}

function renderTrainerTargets() {
    const container = document.getElementById('trainer-targets-box');
    if (!container) return;

    if (!window.TRAINER_TARGETS) { window.TRAINER_TARGETS = { "t1": 30000, "t2": 20000 }; }
    
    // Fallback if MOCK_TRAINERS is not loaded yet
    const trainersList = typeof MOCK_TRAINERS !== 'undefined' ? MOCK_TRAINERS : [ {id: "t1", name: "Rajat Sharma"}, {id: "t2", name: "Vikram Singh"} ];

    container.innerHTML = `
        <div class="flex justify-between items-center border-b border-gray-800/60 pb-2 mb-3">
            <h4 class="text-gray-400 font-semibold tracking-wide text-xs uppercase flex items-center">
                <i class="ph ph-target text-brandRed text-base mr-1.5"></i>Trainer Target Tracker
            </h4>
            <button onclick="window.openTargetModal()" class="text-[10px] bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white border border-purple-500/20 px-2 py-1 rounded transition-all font-bold flex items-center space-x-1 shadow-sm">
                <i class="ph ph-pencil-simple text-xs"></i><span>Set Targets</span>
            </button>
        </div>
        <div class="space-y-4 py-1 flex-1 flex flex-col justify-center">
            ${trainersList.map(t => {
                const target = window.TRAINER_TARGETS[t.id] || 0;
                const sales = calculateTrainerSales(t.id);
                const pct = target > 0 ? Math.min(Math.round((sales.totalRevenue / target) * 100), 100) : 0;
                return `
                    <div class="space-y-1.5">
                        <div class="flex justify-between text-xs">
                            <span class="text-white font-medium">${t.name}</span>
                            <span class="text-gray-500 font-mono text-[11px]">₹${sales.totalRevenue.toLocaleString()} / ₹${target.toLocaleString()}</span>
                        </div>
                        <div class="w-full bg-black/50 h-2.5 rounded-full border border-gray-800 overflow-hidden relative flex items-center">
                            <div class="bg-gradient-to-r from-orange-500 to-green-500 h-full rounded-full" style="width: ${pct}%"></div>
                            <span class="absolute right-2 text-[9px] font-bold font-mono text-gray-400">${pct}%</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderPendingDuesPanel() {
    const container = document.getElementById('pending-dues-reminder-box');
    if (!container) return;

    const pendingDuesList = window.MOCK_TRANSACTIONS.filter(t => t.type === 'income' && t.status === 'pending');

    if (pendingDuesList.length === 0) {
        container.innerHTML = `
            <div class="flex items-center space-x-2 text-green-400 text-xs font-bold uppercase tracking-wider">
                <i class="ph ph-check-circle text-lg"></i><span>All caught up! Zero active pending dues or gated portals.</span>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <h4 class="text-gray-400 font-semibold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-2 mb-3 flex items-center">
            <i class="ph ph-shield-check text-amber-400 text-base mr-1.5"></i>Admission Access Gating & Active Dues (${pendingDuesList.length})
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            ${pendingDuesList.map(txn => {
                const memberName = txn.description.includes('-') ? txn.description.split('-')[1].trim() : txn.description;
                const purpose = txn.description.includes('-') ? txn.description.split('-')[0].trim() : txn.category;
                const isGated = txn.category.toLowerCase() === 'advance fee' || txn.portalLocked === true;
                
                const statusBadge = isGated 
                    ? `<span class="text-[9px] font-bold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center"><i class="ph ph-lock inline mr-1 animate-pulse"></i>Portal Locked</span>`
                    : `<span class="text-[9px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Pending Due</span>`;

                const actionButton = isGated
                    ? `<button onclick="window.collectAdvanceAndUnlock('${txn.id}')" class="w-full bg-green-500 text-black hover:bg-green-600 text-[11px] font-extrabold py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1 shadow-md"><i class="ph ph-lock-key-open text-sm"></i><span>Collect & Unlock Fighter Portal</span></button>`
                    : `<button onclick="window.sendDueReminder('${txn.id}')" id="btn-remind-${txn.id}" class="w-full bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/20 text-[11px] font-bold py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1"><i class="ph ph-paper-plane-tilt"></i><span>Send Gateway Reminder</span></button>`;

                return `
                    <div class="bg-black/20 border ${isGated ? 'border-red-900/40 bg-red-950/5' : 'border-gray-800/80'} p-3.5 rounded-xl flex flex-col justify-between space-y-3 hover:border-gray-700 transition-colors">
                        <div class="flex justify-between items-start">
                            <div>
                                <h5 class="text-white font-semibold text-sm">${memberName}</h5>
                                <p class="text-[10px] text-gray-500 font-mono mt-0.5">${purpose} | Issued: ${txn.date}</p>
                                <div class="mt-2">${statusBadge}</div>
                            </div>
                            <span class="text-xs font-mono font-bold text-gray-200 bg-black/40 px-2 py-0.5 rounded border border-gray-800">₹${txn.amount.toLocaleString()}</span>
                        </div>
                        <div class="w-full">${actionButton}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function calculateTrainerSales(trainerId) {
    const txns = window.MOCK_TRANSACTIONS || [];
    const trainerIncomes = txns.filter(t => t.trainerId === trainerId && t.type === 'income' && t.status === 'paid');
    const ptSales = trainerIncomes.filter(t => t.category.toLowerCase() === 'pt').reduce((s,t)=>s+t.amount, 0);
    const dietPlanSales = trainerIncomes.filter(t => t.category.toLowerCase() === 'diet plan').reduce((s,t)=>s+t.amount, 0);
    const supplementSales = trainerIncomes.filter(t => t.category.toLowerCase() === 'supplement').reduce((s,t)=>s+t.amount, 0);
    return { ptSales, dietPlanSales, supplementSales, totalRevenue: ptSales + dietPlanSales + supplementSales };
}

function renderAIAnalysisReport() {
    const container = document.getElementById('ai-analysis-container');
    if (!container) return;

    if (!showAIReport) {
        container.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl text-xl"><i class="ph ph-brain"></i></div>
                    <div><h4 class="text-white text-xs font-bold uppercase tracking-wider">AI Audit Financial Analysis Report</h4><p class="text-[11px] text-gray-500 mt-0.5">Let R.E.N.E.W AI run an internal audit check on your revenue health index.</p></div>
                </div>
                <button onclick="window.toggleAIReportView(true)" class="border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900 text-purple-300 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"><i class="ph ph-sparkle"></i><span>Run AI Audit</span></button>
            </div>
        `;
        return;
    }
    container.innerHTML = `
        <div class="flex justify-between items-start border-b border-purple-900/30 pb-3 mb-3">
            <div class="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider"><i class="ph ph-sparkle"></i><span>Live AI Executive Financial Audit Insights</span></div>
            <button onclick="window.toggleAIReportView(false)" class="text-gray-500 hover:text-white text-xs font-mono">Collapse [X]</button>
        </div>
        <div class="text-xs text-gray-300 space-y-2 leading-relaxed">
            <p>💥 <strong class="text-purple-300">Revenue Runway Alert:</strong> Your Net Cash Balance is stable but currently exposed to <span class="text-red-400 font-bold">₹10,000 in Overdue Bad Debt</span>.</p>
        </div>
    `;
}

function renderTransactionFilterTabs() {
    const container = document.getElementById('txn-filter-tabs');
    if (!container) return;
    const tabs = [ { id: 'all', label: 'All Operations' }, { id: 'income', label: 'Income Only' }, { id: 'expense', label: 'Expense Only' } ];
    container.innerHTML = tabs.map(t => {
        const isActive = currentFinanceTab === t.id;
        return `<button onclick="window.switchTransactionTab('${t.id}')" class="px-3 py-1.5 rounded-md transition-all uppercase tracking-wide text-[10px] ${isActive ? 'bg-brandRed text-white shadow' : 'text-gray-400 hover:text-white'}">${t.label}</button>`;
    }).join('');
}

function renderTransactionTable() {
    const tbody = document.getElementById('finance-table-body');
    if (!tbody) return;

    let filtered = window.MOCK_TRANSACTIONS || [];
    if (currentFinanceTab !== 'all') filtered = filtered.filter(t => t.type === currentFinanceTab);
    if (financeSearchQuery) filtered = filtered.filter(t => t.description.toLowerCase().includes(financeSearchQuery.toLowerCase()));

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-gray-600">No accounting ledger entries found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(t => {
        const isIncome = t.type === 'income';
        return `
            <tr class="hover:bg-white/[0.02] transition-colors text-xs">
                <td class="py-3.5 px-6 font-mono text-gray-500">${t.id}</td>
                <td class="py-3.5 px-6 text-white font-medium">${t.description}</td>
                <td class="py-3.5 px-6"><span class="bg-gray-800 text-gray-400 font-mono text-[10px] px-2 py-0.5 rounded uppercase">${t.category}</span></td>
                <td class="py-3.5 px-6 font-mono text-[11px] text-gray-400">${t.mode}</td>
                <td class="py-3.5 px-6 font-mono text-gray-500">${t.date}</td>
                <td class="py-3.5 px-6 text-right font-mono ${isIncome ? 'text-green-400' : 'text-brandRed'}" font-semibold">${isIncome ? '+' : '-'} ₹${t.amount.toLocaleString()}</td>
                <td class="py-3.5 px-6 text-center"><button onclick="window.deleteTransaction('${t.id}')" class="text-gray-500 hover:text-brandRed p-1"><i class="ph ph-trash text-base"></i></button></td>
            </tr>
        `;
    }).join('');
}

// =========================================================================
// গ্লোবাল অ্যাক্টিভেশন লজিক্স (WINDOW OMNI BINDING WITH DYNAMIC EVENT LINK)
// =========================================================================

// নতুন লজিক ৩: ইনকামে ইভেন্ট সিলেক্ট করলে ইউনিক নম্বর চাওয়ার ডাইনামিক হ্যান্ডলার
window.handleCategoryChange = function(val) {
    const wrapper = document.getElementById('form-event-code-wrapper');
    const amountInput = document.getElementById('form-amount');
    if (!wrapper) return;

    if (val === 'Events booking') {
        wrapper.classList.remove('hidden');
        amountInput.placeholder = "Enter event no. to auto-fill rate";
    } else {
        wrapper.classList.add('hidden');
        document.getElementById('form-event-no').value = '';
        document.getElementById('event-match-status').textContent = '';
        amountInput.value = window.GYM_FEES[val] || '';
        amountInput.placeholder = "Leave empty to use base tariff";
    }
};

// নতুন লজিক ৪: ইভেন্ট কোড টাইপ করলে রিয়েল-টাইম ম্যাচ করানোর ইঞ্জিন
window.handleEventNoInput = function(val) {
    const events = window.GYM_EVENTS || [];
    const matched = events.find(e => e.eventNo.trim().toUpperCase() === val.trim().toUpperCase());
    const status = document.getElementById('event-match-status');
    const amountInput = document.getElementById('form-amount');

    if (matched) {
        amountInput.value = matched.amount; 
        if (status) {
            status.className = "text-[10px] text-green-400 mt-1 font-mono font-medium block";
            status.textContent = `✓ Active Event: ${matched.title} (Price: ₹${matched.amount})`;
        }
    } else {
        if (status) {
            status.className = "text-[10px] text-red-400 mt-1 font-mono font-medium block";
            status.textContent = `✗ Unique Event Number not found.`;
        }
    }
};

window.deleteTransaction = function(txnId) {
    const inputPassword = prompt(`⚠️ SECURITY CLEARANCE REQUIRED!\nEnter Admin Secure Password to authorize delete for ${txnId}:`);
    if (inputPassword === ADMIN_SECURE_PASSWORD) {
        const index = window.MOCK_TRANSACTIONS.findIndex(t => t.id === txnId);
        if (index !== -1) { window.MOCK_TRANSACTIONS.splice(index, 1); alert(`Purged successfully.`); renderFinancePage(); }
    } else if (inputPassword !== null) { alert("❌ ACCESS DENIED!"); }
};

window.openFeesConfigModal = function() {
    const modal = document.getElementById('transaction-modal');
    if (!modal) return;
    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[360px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-5 flex flex-col relative text-xs">
                <button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                <div class="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4"><i class="ph ph-sliders text-xl text-purple-400"></i><h3 class="font-bold text-white text-sm">Configure Base Gym Fees</h3></div>
                <div class="space-y-3 text-left max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    ${Object.keys(window.GYM_FEES).map(key => `<div><label class="text-gray-400 text-[10px] uppercase font-bold block mb-1">${key}</label><div class="relative"><span class="absolute left-3 top-2 text-gray-600">₹</span><input type="number" id="fee-config-${key.replace(/\s+/g, '_')}" value="${window.GYM_FEES[key]}" class="w-full bg-black/50 border border-gray-800 rounded-lg pl-7 pr-3 py-1.5 font-mono text-gray-200 focus:outline-none"></div></div>`).join('')}
                </div>
                <button onclick="window.submitFeesConfig()" class="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-lg mt-5 uppercase shadow">Save Configuration</button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.add('scale-100'); }, 10);
    modal.onclick = window.closeTransactionModal;
};

window.submitFeesConfig = function() {
    Object.keys(window.GYM_FEES).forEach(key => {
        const input = document.getElementById(`fee-config-${key.replace(/\s+/g, '_')}`);
        if (input) window.GYM_FEES[key] = parseFloat(input.value) || 0;
    });
    alert("Rates updated."); window.closeTransactionModal(); renderFinancePage();
};

// =========================================================================
// NEW LOGIC: PLAN & PRICING MANAGER (For Member Portal Sync)
// =========================================================================
window.openPlanManagerModal = function() {
    const modal = document.getElementById('transaction-modal');
    if (!modal) return;

    let plansHtml = window.GYM_PLANS.map((p, index) => `
        <div class="flex items-center justify-between bg-black/60 border border-gray-800/80 p-3 rounded-xl mb-2.5 group hover:border-indigo-500/40 transition-colors">
            <input type="text" id="plan-name-${index}" value="${p.name}" class="bg-transparent text-gray-200 text-xs font-bold w-1/2 focus:outline-none border-b border-transparent focus:border-indigo-500 py-0.5">
            <div class="flex items-center space-x-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-gray-800">
                <span class="text-indigo-400 font-mono font-bold text-xs">₹</span>
                <input type="number" id="plan-fee-${index}" value="${p.fee}" class="bg-transparent text-green-400 text-xs font-mono font-bold w-16 text-right focus:outline-none">
            </div>
        </div>
    `).join('');

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[380px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col relative text-xs">
                <button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                <div class="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4">
                    <i class="ph ph-list-numbers text-xl text-indigo-400"></i>
                    <h3 class="font-bold text-white text-sm tracking-wide uppercase">Gym Plans Config</h3>
                </div>
                
                <div class="max-h-[180px] overflow-y-auto pr-1 custom-scrollbar" id="plan-list-container">${plansHtml}</div>
                
                <div class="border-t border-gray-800 mt-4 pt-4 space-y-2.5 text-left">
                    <h4 class="text-[10px] text-indigo-400 uppercase tracking-widest font-black">Deploy New Track</h4>
                    <div class="flex space-x-2">
                        <input type="text" id="new-plan-name" placeholder="Plan Title" class="w-2/3 bg-black/50 border border-gray-800 rounded-xl px-3 py-2 text-gray-300 focus:outline-none focus:border-indigo-500 text-xs">
                        <input type="number" id="new-plan-fee" placeholder="Fee (₹)" class="w-1/3 bg-black/50 border border-gray-800 rounded-xl px-3 py-2 text-green-400 font-mono focus:outline-none focus:border-green-500 text-xs">
                    </div>
                </div>

                <button onclick="window.savePlanConfig()" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold py-2.5 rounded-xl mt-6 uppercase tracking-wider shadow-lg shadow-indigo-950/50">Save & Sync System</button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.add('scale-100'); }, 10);
    modal.onclick = window.closeTransactionModal;
};

window.savePlanConfig = function() {
    window.GYM_PLANS.forEach((p, index) => {
        p.name = document.getElementById(`plan-name-${index}`).value;
        p.fee = parseFloat(document.getElementById(`plan-fee-${index}`).value);
    });

    const newName = document.getElementById('new-plan-name').value.trim();
    const newFee = parseFloat(document.getElementById('new-plan-fee').value);

    if (newName && !isNaN(newFee)) {
        window.GYM_PLANS.push({ id: `PLN-${window.GYM_PLANS.length + 1}`, name: newName, fee: newFee });
    }

    alert("⚡ MASTER ERP SYNC COMPLETE:\nAll gym subscription plans and fee modifications are now dynamically applied across the system.");
    window.closeTransactionModal();
    renderFinancePage();
};
// =========================================================================

window.simulateFighterRegistration = function() {
    const names = ["Arijit Das", "Sayan Mukherjee", "Ritam Chakraborty"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const advanceAmount = window.GYM_FEES["advance fee"];
    window.MOCK_TRANSACTIONS.unshift({ id: `TXN-${window.MOCK_TRANSACTIONS.length + 1}`, type: "income", category: "advance fee", amount: advanceAmount, date: new Date().toISOString().slice(0,10), status: "pending", mode: "UPI", description: `Advance Fee (Fighter Gated) - ${randomName}`, trainerId: "", portalLocked: true });
    alert(`Fighter registered.`); renderFinancePage();
};

window.collectAdvanceAndUnlock = function(txnId) {
    const txn = window.MOCK_TRANSACTIONS.find(t => t.id === txnId);
    if (!txn) return;
    txn.status = 'paid'; txn.portalLocked = false;
    const memberName = txn.description.includes('-') ? txn.description.split('-')[1].trim() : txn.description;
    if (typeof MOCK_MEMBERS !== 'undefined') { MOCK_MEMBERS.push({ id: `m-${Date.now().toString().slice(-4)}`, name: memberName, phone: "+91 98300 55443", plan: "Fighter Premium Track", expiryDate: "16/07/2026", status: "active", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", trainerId: "", portalLocked: false }); }
    alert(`Portal unlocked for ${memberName}.`); renderFinancePage();
};

window.sendDueReminder = function(txnId) {
    const txn = window.MOCK_TRANSACTIONS.find(t => t.id === txnId);
    if (!txn) return;
    const memberName = txn.description.includes('-') ? txn.description.split('-')[1].trim() : txn.description;
    const btn = document.getElementById(`btn-remind-${txnId}`);
    if (btn) { btn.disabled = true; btn.className = "w-full bg-green-500/20 text-green-400 border border-green-500/30 text-[11px] font-bold py-1.5 rounded-lg pointer-events-none"; btn.innerHTML = `<span>Reminder Dispatched!</span>`; }
    setTimeout(() => { alert(`Reminder sent to ${memberName}.`); }, 100);
};

window.handleFinanceSearch = function() {
    const input = document.getElementById('finance-search'); if (input) { financeSearchQuery = input.value; renderTransactionTable(); }
};

window.switchTransactionTab = function(tabName) {
    currentFinanceTab = tabName; renderTransactionFilterTabs(); renderTransactionTable();
};

window.toggleAIReportView = function(status) { showAIReport = status; renderAIAnalysisReport(); };

window.triggerLineGlow = function(type) {
    const selector = type === 'income' ? '.income-pipe' : '.expense-pipe';
    const color = type === 'income' ? 'rgba(34,197,94,1)' : 'rgba(255,0,51,1)';
    const element = document.querySelector(selector);
    if (element) { element.style.strokeWidth = "5px"; element.style.filter = `drop-shadow(0px 0px 15px ${color})`; setTimeout(() => { element.style.strokeWidth = ""; element.style.filter = ""; }, 1500); }
};

window.triggerGlassBox = function(month, type, amount, cx, cy, neonColor) {
    const tooltip = document.getElementById('graph-glass-box'); const wrapper = document.getElementById('graph-wrapper-area'); if (!tooltip || !wrapper) return;
    const posX = (cx / 460) * wrapper.clientWidth;
    tooltip.innerHTML = `<div class="text-[10px] font-mono text-gray-400 uppercase mb-1">${month} Ledger Check</div><div class="text-xs font-semibold ${type === 'income' ? 'text-green-400' : 'text-brandRed'}">${type === 'income' ? 'Cash Inflow' : 'Cash Outflow'}</div><div class="text-sm font-bold font-mono text-white mt-1">₹${amount.toLocaleString()}</div>`;
    tooltip.style.boxShadow = `0 0 20px ${neonColor}50, inset 0 0 10px rgba(255,255,255,0.1)`; tooltip.classList.remove('hidden'); tooltip.style.left = `${posX - 60}px`; tooltip.style.top = `${cy - 65}px`;
    if (window.tooltipTimeout) clearTimeout(window.tooltipTimeout); window.tooltipTimeout = setTimeout(() => { tooltip.classList.add('hidden'); }, 3000);
};

window.closeTransactionModal = function() {
    const modal = document.getElementById('transaction-modal'); if (!modal) return;
    modal.classList.add('opacity-0'); if (modal.firstElementChild) { modal.firstElementChild.classList.remove('scale-100'); modal.firstElementChild.classList.add('scale-95'); }
    setTimeout(() => { modal.classList.add('hidden'); }, 200);
};

window.openTargetModal = function() {
    const modal = document.getElementById('transaction-modal'); if (!modal) return;
    
    // Safety check for MOCK_TRAINERS
    const trainersList = typeof MOCK_TRAINERS !== 'undefined' ? MOCK_TRAINERS : [ {id: "t1", name: "Rajat Sharma"}, {id: "t2", name: "Vikram Singh"} ];

    const inputsHtml = trainersList.map(t => { const currentTarget = window.TRAINER_TARGETS ? window.TRAINER_TARGETS[t.id] || 0 : 0; return `<div><label class="text-gray-400 text-[11px] font-semibold block mb-1 uppercase">${t.name}</label><div class="relative"><span class="absolute left-3 top-2 text-gray-600">₹</span><input type="number" id="target-input-${t.id}" value="${currentTarget}" class="w-full bg-black/50 border border-gray-800 rounded-lg pl-7 pr-3 py-2 text-xs text-gray-300 font-mono"></div></div>`; }).join('');
    modal.innerHTML = `<div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-80 shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()"><div class="bg-darkBg/95 rounded-[14px] p-5 flex flex-col relative text-xs"><button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button><div class="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4"><i class="ph ph-target text-xl text-purple-400"></i><h3 class="font-bold text-white text-sm">Set Monthly Revenue Goals</h3></div><div class="space-y-4 text-left">${inputsHtml}</div><button onclick="window.submitTrainerTargets()" class="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-lg mt-5 shadow">Update Roster Targets</button></div></div>`;
    modal.classList.remove('hidden'); setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.add('scale-100'); }, 10); modal.onclick = window.closeTransactionModal;
};

window.submitTrainerTargets = function() { 
    const trainersList = typeof MOCK_TRAINERS !== 'undefined' ? MOCK_TRAINERS : [ {id: "t1"}, {id: "t2"} ];
    trainersList.forEach(t => { 
        const input = document.getElementById(`target-input-${t.id}`); 
        if (input) { window.TRAINER_TARGETS[t.id] = parseFloat(input.value) || 0; } 
    }); 
    alert("Targets updated."); window.closeTransactionModal(); renderFinancePage(); 
};

window.openTransactionModal = function() {
    const modal = document.getElementById('transaction-modal');
    if (!modal) return;
    
    // Safety check for MOCK_TRAINERS
    const trainersList = typeof MOCK_TRAINERS !== 'undefined' ? MOCK_TRAINERS : [ {id: "t1", name: "Rajat Sharma"}, {id: "t2", name: "Vikram Singh"} ];
    const trainerOptions = trainersList.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[380px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-5 flex flex-col relative text-xs">
                <button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                <div class="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4"><i class="ph ph-currency-circle-dollar text-xl text-brandRed"></i><h3 class="font-bold text-white text-sm">Create New Ledger Entry</h3></div>
                <div class="mb-4">
                    <div class="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-lg border border-gray-800">
                        <button onclick="window.toggleFormType('income')" id="btn-form-income" class="py-1.5 font-bold rounded-md bg-green-500 text-white shadow">INCOME (+)</button>
                        <button onclick="window.toggleFormType('expense')" id="btn-form-expense" class="py-1.5 font-bold rounded-md text-gray-400 hover:text-white">EXPENSE (-)</button>
                    </div>
                </div>
                <div class="space-y-3 text-left">
                    <div><label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Narration / Description</label><input type="text" id="form-desc" placeholder="e.g. Workshop Ticket Booking" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-brandRed"></div>
                    
                    <div><label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Category</label>
                        <select id="form-cat-income" onchange="window.handleCategoryChange(this.value)" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none">
                            <option value="advance fee">Advance Fee</option>
                            <option value="membership fee">Membership Fee</option>
                            <option value="PT">Personal Training (PT)</option>
                            <option value="diet plan">Diet Plan Chart</option>
                            <option value="supplement">Supplement Sales</option>
                            <option value="Events booking">Events Booking</option>
                            <option value="other">Other Income</option>
                        </select>
                        <select id="form-cat-expense" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none hidden">
                            <option value="rent">Gym Property Rent</option><option value="salaries">Staff & Salaries</option><option value="utilities">Utilities (Electric/Water)</option><option value="maintenance">Equipment Maintenance</option><option value="marketing">Marketing & Facebook Ads</option><option value="other">Other Expense</option>
                        </select>
                    </div>

                    <div id="form-event-code-wrapper" class="hidden space-y-1">
                        <label class="text-brandRed text-[10px] uppercase font-bold block">Enter Event Unique Number</label>
                        <input type="text" id="form-event-no" oninput="window.handleEventNoInput(this.value)" placeholder="e.g. EVT-101" class="w-full bg-black/60 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-brandRed font-mono text-xs uppercase font-bold tracking-wider">
                        <p id="event-match-status" class="text-[10px] font-mono mt-1 font-medium"></p>
                    </div>

                    <div id="form-trainer-wrapper"><label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Link to Trainer</label><select id="form-trainer-id" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none"><option value="">No Trainer / Gym Direct Revenue</option>${trainerOptions}</select></div>
                    <div><label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Mode of Payment</label><select id="form-mode" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none"><option value="UPI">UPI</option><option value="Cash">Cash</option><option value="Card">Card</option></select></div>
                    <div><label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Amount (₹)</label><input type="number" id="form-amount" placeholder="Leave empty to use base tariff" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 font-mono text-gray-300 focus:outline-none"></div>
                </div>
                <button onclick="window.submitTransaction()" class="w-full bg-brandRed hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-lg mt-5 uppercase tracking-wide">Authorize Ledger Operation</button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.remove('scale-95'); modal.firstElementChild.classList.add('scale-100'); }, 10);
    modal.onclick = window.closeTransactionModal; selectedFormType = 'income'; 
};

window.toggleFormType = function(type) {
    selectedFormType = type;
    const btnInc = document.getElementById('btn-form-income'); const btnExp = document.getElementById('btn-form-expense');
    const catInc = document.getElementById('form-cat-income'); const catExp = document.getElementById('form-cat-expense');
    const trainerWrapper = document.getElementById('form-trainer-wrapper');
    const eventWrapper = document.getElementById('form-event-code-wrapper');

    if (type === 'income') {
        btnInc.className = "py-1.5 font-bold rounded-md bg-green-500 text-white shadow"; btnExp.className = "py-1.5 font-bold rounded-md text-gray-400 hover:text-white";
        catInc.classList.remove('hidden'); catExp.classList.add('hidden'); trainerWrapper.classList.remove('hidden');
        window.handleCategoryChange(catInc.value);
    } else {
        btnInc.className = "py-1.5 font-bold rounded-md text-gray-400 hover:text-white"; btnExp.className = "py-1.5 font-bold rounded-md bg-brandRed text-white shadow";
        catInc.classList.add('hidden'); catExp.classList.remove('hidden'); trainerWrapper.classList.add('hidden');
        if (eventWrapper) eventWrapper.classList.add('hidden'); 
    }
};

window.submitTransaction = function() {
    const desc = document.getElementById('form-desc').value.trim();
    let amount = parseFloat(document.getElementById('form-amount').value);
    const mode = document.getElementById('form-mode').value;
    const category = selectedFormType === 'income' ? document.getElementById('form-cat-income').value : document.getElementById('form-cat-expense').value;
    const trainerId = selectedFormType === 'income' ? document.getElementById('form-trainer-id').value : "";
    const eventNo = document.getElementById('form-event-no') ? document.getElementById('form-event-no').value.trim().toUpperCase() : "";

    if (!desc) { alert("Please fill the description field!"); return; }

    if (isNaN(amount) || amount <= 0) {
        if (selectedFormType === 'income') {
            amount = window.GYM_FEES[category] || 1000;
        } else {
            alert("Please specify amount!"); return;
        }
    }

    const finalDesc = (category === 'Events booking' && eventNo) ? `${desc} [${eventNo}]` : desc;
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    window.MOCK_TRANSACTIONS.unshift({
        id: `TXN-${String(window.MOCK_TRANSACTIONS.length + 1).padStart(3, '0')}`,
        type: selectedFormType, category: category, amount: amount, date: formattedDate, status: "paid", mode: mode, description: finalDesc, trainerId: trainerId
    });

    currentFinanceTab = 'all'; financeSearchQuery = '';
    const searchInput = document.getElementById('finance-search'); if (searchInput) searchInput.value = '';

    alert(`Authorized successfully! Entry saved.`);
    window.closeTransactionModal(); renderFinancePage(); 
};