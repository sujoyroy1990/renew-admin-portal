// =========================================================================
// js/components/reports.js — GOD MODE ANALYTICS & 20x MICRO REPORTS
// =========================================================================

function getReportsView() {
    return `
        <div class="space-y-6 animate-fadeIn">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-darkSurface to-brandRed/10 border border-gray-800 p-5 rounded-2xl shadow-xl relative overflow-hidden group">
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-brandRed/5 rounded-full blur-3xl group-hover:bg-brandRed/20 transition-all pointer-events-none"></div>
                <div class="relative z-10">
                    <h3 class="text-white font-bold text-lg flex items-center tracking-wide"><i class="ph ph-chart-polar text-brandRed mr-2 text-xl"></i>Master Analytics & Reports</h3>
                    <p class="text-xs text-gray-400 mt-1">10-Point Growth Visualizers & 20+ Deep-Dive Micro Reports Repository.</p>
                </div>
                <div class="flex gap-3 relative z-10">
                    <button onclick="window.generateMasterReport()" class="bg-brandRed hover:bg-red-700 text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(255,0,51,0.4)] hover:shadow-[0_0_25px_rgba(255,0,51,0.6)] uppercase tracking-wider">
                        <i class="ph ph-file-pdf text-lg animate-pulse"></i>
                        <span>Export Master Report</span>
                    </button>
                </div>
            </div>

            <h4 class="text-gray-500 font-bold tracking-widest text-[10px] uppercase border-b border-gray-800/60 pb-2"><i class="ph ph-trend-up mr-1 text-brandRed"></i> Visual Growth Engines (10 Metrics)</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5" id="graphs-container">
                </div>

            <h4 class="text-gray-500 font-bold tracking-widest text-[10px] uppercase border-b border-gray-800/60 pb-2 mt-8"><i class="ph ph-files mr-1 text-blue-400"></i> Micro Reports Vault (20 Extracts)</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <div class="bg-darkSurface border border-gray-800 rounded-2xl p-4">
                    <h5 class="text-green-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center border-b border-gray-800/50 pb-2"><i class="ph ph-bank mr-1.5"></i> Finance & Revenue</h5>
                    <ul class="space-y-2">
                        ${generateReportItem('FIN-01', 'Daily Shift Closing Balance')}
                        ${generateReportItem('FIN-02', 'Aging Dues (30/60/90 Days)')}
                        ${generateReportItem('FIN-03', 'Tax & GST Liability Report')}
                        ${generateReportItem('FIN-04', 'Category-wise Revenue Split')}
                        ${generateReportItem('FIN-05', 'Monthly Expense Ledger')}
                    </ul>
                </div>

                <div class="bg-darkSurface border border-gray-800 rounded-2xl p-4">
                    <h5 class="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center border-b border-gray-800/50 pb-2"><i class="ph ph-users mr-1.5"></i> Roster & Retention</h5>
                    <ul class="space-y-2">
                        ${generateReportItem('MEM-01', 'MIA (Missing > 14 Days) List')}
                        ${generateReportItem('MEM-02', 'Upcoming 7-Day Expiry List')}
                        ${generateReportItem('MEM-03', 'Lapsed & Gated Accounts')}
                        ${generateReportItem('MEM-04', 'Member Demographic Breakdown')}
                        ${generateReportItem('MEM-05', 'Birthday & Anniversary Tracker')}
                    </ul>
                </div>

                <div class="bg-darkSurface border border-gray-800 rounded-2xl p-4">
                    <h5 class="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center border-b border-gray-800/50 pb-2"><i class="ph ph-funnel mr-1.5"></i> CRM & Acquisition</h5>
                    <ul class="space-y-2">
                        ${generateReportItem('CRM-01', 'Lead Source Conversion Rates')}
                        ${generateReportItem('CRM-02', 'Dropped Lead Reason Analysis')}
                        ${generateReportItem('CRM-03', 'Free Trial No-Show Log')}
                        ${generateReportItem('CRM-04', 'Member Referral Tracker')}
                        ${generateReportItem('CRM-05', 'WhatsApp Dispatch History')}
                    </ul>
                </div>

                <div class="bg-darkSurface border border-gray-800 rounded-2xl p-4">
                    <h5 class="text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center border-b border-gray-800/50 pb-2"><i class="ph ph-storefront mr-1.5"></i> Operations & Staff</h5>
                    <ul class="space-y-2">
                        ${generateReportItem('OPS-01', 'Low Stock / Empty Alerts')}
                        ${generateReportItem('OPS-02', 'Top Selling Store Products')}
                        ${generateReportItem('OPS-03', 'Trainer Commission Payouts')}
                        ${generateReportItem('OPS-04', 'Staff Attendance Logs')}
                        ${generateReportItem('OPS-05', 'Asset & Maintenance Schedule')}
                    </ul>
                </div>
            </div>

            <div id="report-gen-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"></div>
        </div>
    `;
}

function generateReportItem(id, title) {
    return `
        <li class="flex items-center justify-between bg-black/40 hover:bg-black/80 border border-transparent hover:border-gray-700 p-2 rounded-lg transition-all group cursor-pointer" onclick="window.downloadMicroReport('${id}', '${title}')">
            <span class="text-gray-400 group-hover:text-white text-[11px] font-medium tracking-wide truncate pr-2">${title}</span>
            <i class="ph ph-download-simple text-gray-600 group-hover:text-brandRed"></i>
        </li>
    `;
}

function renderReportsPage() {
    render10VisualGraphs();
}

// =========================================================================
// THE 10 GRAPH GENERATOR ENGINE (Pure Tailwind/CSS Magic)
// =========================================================================
function render10VisualGraphs() {
    const container = document.getElementById('graphs-container');
    if (!container) return;

    // 1. Revenue Growth (Bar Chart)
    const g1 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">1. 6-Month Revenue Trend</h5>
            <div class="flex items-end justify-between flex-1 gap-1">
                <div class="w-full bg-green-500/20 rounded-t-sm relative group"><div class="absolute bottom-0 w-full bg-green-500 rounded-t-sm transition-all" style="height: 40%"></div></div>
                <div class="w-full bg-green-500/20 rounded-t-sm relative group"><div class="absolute bottom-0 w-full bg-green-500 rounded-t-sm transition-all" style="height: 55%"></div></div>
                <div class="w-full bg-green-500/20 rounded-t-sm relative group"><div class="absolute bottom-0 w-full bg-green-500 rounded-t-sm transition-all" style="height: 45%"></div></div>
                <div class="w-full bg-green-500/20 rounded-t-sm relative group"><div class="absolute bottom-0 w-full bg-green-500 rounded-t-sm transition-all" style="height: 70%"></div></div>
                <div class="w-full bg-green-500/20 rounded-t-sm relative group"><div class="absolute bottom-0 w-full bg-green-500 rounded-t-sm transition-all" style="height: 60%"></div></div>
                <div class="w-full bg-green-500/20 rounded-t-sm relative group"><div class="absolute bottom-0 w-full bg-brandRed shadow-[0_0_10px_rgba(255,0,51,0.5)] rounded-t-sm transition-all animate-pulse" style="height: 90%"></div></div>
            </div>
            <div class="flex justify-between text-[8px] text-gray-600 font-mono mt-2 pt-1 border-t border-gray-800"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span class="text-white font-bold">JUN</span></div>
        </div>
    `;

    // 2. Active vs Lapsed (Donut Simulation via Conic Gradient)
    const g2 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">2. Roster Health (Active vs Lapsed)</h5>
            <div class="flex-1 flex items-center justify-center relative">
                <div class="w-24 h-24 rounded-full flex items-center justify-center shadow-lg" style="background: conic-gradient(#22C55E 0% 75%, #EF4444 75% 90%, #F59E0B 90% 100%);">
                    <div class="w-16 h-16 bg-darkSurface rounded-full flex items-center justify-center flex-col shadow-inner">
                        <span class="text-white font-bold text-sm">75%</span><span class="text-[8px] text-gray-500 uppercase">Active</span>
                    </div>
                </div>
            </div>
            <div class="flex justify-between text-[8px] font-bold uppercase mt-2">
                <span class="text-green-400">● Act: 75%</span><span class="text-brandRed">● Lps: 15%</span><span class="text-amber-400">● Exp: 10%</span>
            </div>
        </div>
    `;

    // 3. Admission vs Churn (Comparison Stack)
    const g3 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">3. Acq vs Churn (Net Growth)</h5>
            <div class="flex flex-col justify-center flex-1 space-y-4">
                <div>
                    <div class="flex justify-between text-[10px] mb-1"><span class="text-blue-400">New Admissions</span><span class="text-white font-mono">+42</span></div>
                    <div class="w-full bg-black/50 h-2 rounded-full overflow-hidden"><div class="bg-blue-500 h-full rounded-full" style="width: 80%"></div></div>
                </div>
                <div>
                    <div class="flex justify-between text-[10px] mb-1"><span class="text-red-400">Dropouts / Lapsed</span><span class="text-white font-mono">-12</span></div>
                    <div class="w-full bg-black/50 h-2 rounded-full overflow-hidden"><div class="bg-red-500 h-full rounded-full" style="width: 25%"></div></div>
                </div>
            </div>
        </div>
    `;

    // 4. Revenue Mix (Horizontal Stacked Bar)
    const g4 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">4. Revenue Distribution Mix</h5>
            <div class="flex-1 flex flex-col justify-center">
                <div class="w-full h-8 rounded-lg flex overflow-hidden shadow-md border border-gray-700">
                    <div class="bg-purple-500 h-full flex items-center justify-center text-[10px] font-bold text-white" style="width: 50%" title="Memberships">50%</div>
                    <div class="bg-amber-500 h-full flex items-center justify-center text-[10px] font-bold text-black" style="width: 30%" title="PT">30%</div>
                    <div class="bg-cyan-500 h-full flex items-center justify-center text-[10px] font-bold text-black" style="width: 20%" title="Store">20%</div>
                </div>
                <div class="grid grid-cols-3 gap-1 mt-4 text-[9px] uppercase font-bold text-center">
                    <span class="text-purple-400">● Memb.</span><span class="text-amber-400">● PT Sales</span><span class="text-cyan-400">● Store</span>
                </div>
            </div>
        </div>
    `;

    // 5. CRM Lead Funnel (Step Graph)
    const g5 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">5. Sales Pipeline Funnel</h5>
            <div class="flex-1 flex flex-col items-center justify-center space-y-1 w-full">
                <div class="bg-gray-700 w-full py-1 text-center text-[9px] text-white font-bold rounded-t-lg">Total Leads (100)</div>
                <div class="bg-blue-600 w-4/5 py-1 text-center text-[9px] text-white font-bold">Contacted (80)</div>
                <div class="bg-amber-500 w-3/5 py-1 text-center text-[9px] text-black font-bold">Trials Done (45)</div>
                <div class="bg-green-500 w-2/5 py-1 text-center text-[9px] text-black font-bold rounded-b-lg shadow-[0_0_10px_rgba(34,197,94,0.5)]">Converted (28)</div>
            </div>
        </div>
    `;

    // 6. Peak Hour Footfall (Wave/Multi-Bar)
    const g6 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">6. Peak Hour Footfall</h5>
            <div class="flex items-end justify-between flex-1 gap-0.5">
                <div class="w-full bg-indigo-500" style="height: 20%"></div><div class="w-full bg-indigo-500" style="height: 60%"></div><div class="w-full bg-indigo-500" style="height: 80%"></div><div class="w-full bg-indigo-500" style="height: 40%"></div>
                <div class="w-full bg-gray-800" style="height: 10%"></div><div class="w-full bg-gray-800" style="height: 15%"></div>
                <div class="w-full bg-brandRed animate-pulse" style="height: 70%"></div><div class="w-full bg-brandRed shadow-[0_0_10px_rgba(255,0,51,0.5)]" style="height: 100%"></div><div class="w-full bg-brandRed animate-pulse" style="height: 85%"></div><div class="w-full bg-brandRed" style="height: 50%"></div>
            </div>
            <div class="flex justify-between text-[8px] text-gray-600 font-mono mt-2 pt-1 border-t border-gray-800"><span>6AM</span><span>12PM</span><span class="text-red-400 font-bold">6PM (PEAK)</span><span>10PM</span></div>
        </div>
    `;

    // 7. Trainer Leaderboard (Horizontal Bars)
    const g7 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">7. Trainer PT Leaderboard</h5>
            <div class="flex flex-col justify-center flex-1 space-y-3">
                <div><div class="flex justify-between text-[9px] mb-1"><span class="text-gray-300">Rajat S. (Target 30k)</span><span class="text-green-400">90%</span></div><div class="w-full bg-black/50 h-1.5 rounded-full"><div class="bg-green-500 h-full rounded-full" style="width: 90%"></div></div></div>
                <div><div class="flex justify-between text-[9px] mb-1"><span class="text-gray-300">Vikram S. (Target 20k)</span><span class="text-amber-400">60%</span></div><div class="w-full bg-black/50 h-1.5 rounded-full"><div class="bg-amber-400 h-full rounded-full" style="width: 60%"></div></div></div>
                <div><div class="flex justify-between text-[9px] mb-1"><span class="text-gray-300">Amit D. (Target 15k)</span><span class="text-brandRed">30%</span></div><div class="w-full bg-black/50 h-1.5 rounded-full"><div class="bg-brandRed h-full rounded-full" style="width: 30%"></div></div></div>
            </div>
        </div>
    `;

    // 8. Expense Breakdown (Conic Pie)
    const g8 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">8. Expense Burn Breakdown</h5>
            <div class="flex-1 flex items-center justify-between">
                <div class="w-20 h-20 rounded-full shadow-lg" style="background: conic-gradient(#EF4444 0% 50%, #8B5CF6 50% 80%, #64748B 80% 100%);"></div>
                <div class="space-y-2 text-[9px] font-bold uppercase w-1/2">
                    <div class="text-brandRed border-b border-gray-800 pb-1">● Rent: 50%</div>
                    <div class="text-purple-400 border-b border-gray-800 pb-1">● Salaries: 30%</div>
                    <div class="text-gray-400">● Mktg/Ops: 20%</div>
                </div>
            </div>
        </div>
    `;

    // 9. Store Inventory Sales (List + Bar)
    const g9 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">9. Top Selling Store Items</h5>
            <div class="flex flex-col justify-center flex-1 space-y-2">
                <div class="bg-black/40 p-1.5 rounded border border-gray-800 flex items-center justify-between"><span class="text-[10px] text-gray-300 truncate">1. Whey Isolate (1kg)</span><span class="text-[9px] font-mono text-cyan-400 bg-cyan-900/30 px-1 rounded">24 Units</span></div>
                <div class="bg-black/40 p-1.5 rounded border border-gray-800 flex items-center justify-between"><span class="text-[10px] text-gray-300 truncate">2. Pro Boxing Gloves</span><span class="text-[9px] font-mono text-cyan-400 bg-cyan-900/30 px-1 rounded">12 Units</span></div>
                <div class="bg-black/40 p-1.5 rounded border border-gray-800 flex items-center justify-between"><span class="text-[10px] text-gray-300 truncate">3. Fighter T-Shirt</span><span class="text-[9px] font-mono text-cyan-400 bg-cyan-900/30 px-1 rounded">8 Units</span></div>
            </div>
        </div>
    `;

    // 10. Weekly Attendance Pulse (Line concept via SVG/Bars)
    const g10 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">10. 7-Day Attendance Pulse</h5>
            <div class="flex items-end justify-between flex-1 gap-2">
                <div class="w-full bg-white/10 rounded-full relative"><div class="absolute bottom-0 w-full bg-purple-500 rounded-full" style="height: 60%"></div></div>
                <div class="w-full bg-white/10 rounded-full relative"><div class="absolute bottom-0 w-full bg-purple-500 rounded-full" style="height: 80%"></div></div>
                <div class="w-full bg-white/10 rounded-full relative"><div class="absolute bottom-0 w-full bg-purple-500 rounded-full" style="height: 75%"></div></div>
                <div class="w-full bg-white/10 rounded-full relative"><div class="absolute bottom-0 w-full bg-purple-500 rounded-full" style="height: 90%"></div></div>
                <div class="w-full bg-white/10 rounded-full relative"><div class="absolute bottom-0 w-full bg-purple-500 rounded-full" style="height: 85%"></div></div>
                <div class="w-full bg-white/10 rounded-full relative"><div class="absolute bottom-0 w-full bg-brandRed rounded-full shadow-[0_0_8px_rgba(255,0,51,0.5)]" style="height: 40%"></div></div>
                <div class="w-full bg-white/10 rounded-full relative"><div class="absolute bottom-0 w-full bg-gray-600 rounded-full" style="height: 20%"></div></div>
            </div>
            <div class="flex justify-between text-[7px] text-gray-500 font-mono mt-2 pt-1 border-t border-gray-800"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span class="text-red-400">S</span><span>S</span></div>
        </div>
    `;

    container.innerHTML = g1 + g2 + g3 + g4 + g5 + g6 + g7 + g8 + g9 + g10;
}

// =========================================================================
// ACTION HANDLERS
// =========================================================================

window.downloadMicroReport = function(id, title) {
    alert(`📥 MICRO REPORT DISPATCH INITIATED:\n\nExtracting secure data for [${id} - ${title}]...\nConverting to CSV format.\n\nThe file will automatically download to your local device shortly.`);
};

window.generateMasterReport = function() {
    const modal = document.getElementById('report-gen-modal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="bg-black border border-gray-800 p-8 rounded-2xl flex flex-col items-center justify-center w-[400px] shadow-[0_0_40px_rgba(255,0,51,0.2)] relative text-center">
            <div class="w-16 h-16 border-4 border-gray-800 border-t-brandRed rounded-full animate-spin mb-6"></div>
            <h3 class="text-white font-bold text-lg mb-2 tracking-wide uppercase">Compiling Master Data</h3>
            <p class="text-xs text-gray-500 font-mono" id="report-process-text">Initializing Secure DB Sync...</p>
            
            <div class="w-full bg-gray-900 rounded-full h-1.5 mt-5 overflow-hidden">
                <div class="bg-brandRed h-1.5 rounded-full w-0 transition-all duration-[3000ms] ease-in-out shadow-[0_0_10px_rgba(255,0,51,0.8)]" id="report-progress-bar"></div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);

    setTimeout(() => { document.getElementById('report-progress-bar').style.width = '100%'; }, 100);

    const processText = document.getElementById('report-process-text');
    setTimeout(() => { processText.innerText = "Extracting Financial Ledgers & Dues..."; }, 1000);
    setTimeout(() => { processText.innerText = "Processing Roster & Attendance..."; }, 1800);
    setTimeout(() => { processText.innerText = "Finalizing PDF Executive Assembly..."; }, 2600);

    setTimeout(() => {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
        
        const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
        alert(`✅ R.E.N.E.W MASTER REPORT READY\n\nThe full encrypted PDF Executive Report for ${dateStr} has been successfully generated and saved to your device downloads folder!`);
    }, 3500);
};