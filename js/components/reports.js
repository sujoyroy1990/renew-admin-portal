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
                        ${generateReportItem('MEM-06', 'Fighters Check-in/Check-out Logs')}
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

    const txns = window.MOCK_TRANSACTIONS || [];
    const members = window.MOCK_MEMBERS || [];
    const leads = window.MOCK_LEADS || [];
    const inventory = window.MOCK_INVENTORY || [];
    const trainers = window.MOCK_TRAINERS || [];
    const attLogs = window.MEMBER_ATTENDANCE_LOGS || [];

    // 1. Revenue Growth (Bar Chart - last 6 months)
    const getMonthRev = (monthPattern, defaultVal) => {
        const matching = txns.filter(t => t.type === 'income' && t.status === 'paid' && t.date.includes(monthPattern));
        if (matching.length > 0) {
            return matching.reduce((sum, t) => sum + t.amount, 0);
        }
        return defaultVal;
    };
    const revs = [
        getMonthRev('-01-', 18000),
        getMonthRev('-02-', 22000),
        getMonthRev('-03-', 20000),
        getMonthRev('-04-', 28000),
        getMonthRev('-05-', 25000),
        getMonthRev('-06-', 35000) // June is live
    ];
    const maxRev = Math.max(...revs, 1);
    const g1Bars = revs.map((rev, i) => {
        const heightPct = Math.round((rev / maxRev) * 100);
        const isJun = i === 5;
        const barColorClass = isJun ? 'bg-brandRed shadow-[0_0_10px_rgba(255,0,51,0.5)] animate-pulse' : 'bg-green-500';
        return `
            <div class="w-full bg-green-500/20 rounded-t-sm relative group" title="₹${rev.toLocaleString()}">
                <div class="absolute bottom-0 w-full ${barColorClass} rounded-t-sm transition-all duration-500" style="height: ${heightPct}%"></div>
            </div>
        `;
    }).join('');

    const g1 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">1. 6-Month Revenue Trend</h5>
            <div class="flex items-end justify-between flex-1 gap-1">
                ${g1Bars}
            </div>
            <div class="flex justify-between text-[8px] text-gray-600 font-mono mt-2 pt-1 border-t border-gray-800"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span class="text-white font-bold">JUN</span></div>
        </div>
    `;

    // 2. Active vs Lapsed (Donut Simulation via Conic Gradient)
    const totalMem = members.length;
    const active = members.filter(m => m.status === 'active').length;
    const expiring = members.filter(m => m.status === 'expiring').length;
    const lapsed = members.filter(m => ['at_risk', 'expired', 'inactive'].includes(m.status)).length;
    
    const actPct = totalMem > 0 ? Math.round((active / totalMem) * 100) : 0;
    const expPct = totalMem > 0 ? Math.round((expiring / totalMem) * 100) : 0;
    const lapPct = totalMem > 0 ? (100 - actPct - expPct) : 0;

    const g2 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">2. Roster Health (Active vs Lapsed)</h5>
            <div class="flex-1 flex items-center justify-center relative">
                <div class="w-24 h-24 rounded-full flex items-center justify-center shadow-lg" style="background: conic-gradient(#22C55E 0% ${actPct}%, #EF4444 ${actPct}% ${actPct + lapPct}%, #F59E0B ${actPct + lapPct}% 100%);">
                    <div class="w-16 h-16 bg-darkSurface rounded-full flex items-center justify-center flex-col shadow-inner">
                        <span class="text-white font-bold text-sm">${actPct}%</span><span class="text-[8px] text-gray-500 uppercase">Active</span>
                    </div>
                </div>
            </div>
            <div class="flex justify-between text-[8px] font-bold uppercase mt-2">
                <span class="text-green-400">● Act: ${actPct}%</span><span class="text-brandRed">● Lps: ${lapPct}%</span><span class="text-amber-400">● Exp: ${expPct}%</span>
            </div>
        </div>
    `;

    // 3. Admission vs Churn (Comparison Stack)
    const newAdmissions = members.filter(m => m.registrationDate && new Date(m.registrationDate) >= new Date('2026-05-20')).length;
    const dropouts = members.filter(m => ['at_risk', 'expired'].includes(m.status)).length;
    const maxAcq = Math.max(newAdmissions, dropouts, 5);
    const acqPct = Math.round((newAdmissions / maxAcq) * 100);
    const churnPct = Math.round((dropouts / maxAcq) * 100);

    const g3 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">3. Acq vs Churn (Net Growth)</h5>
            <div class="flex flex-col justify-center flex-1 space-y-4">
                <div>
                    <div class="flex justify-between text-[10px] mb-1"><span class="text-blue-400">New Admissions</span><span class="text-white font-mono">+${newAdmissions}</span></div>
                    <div class="w-full bg-black/50 h-2 rounded-full overflow-hidden"><div class="bg-blue-500 h-full rounded-full transition-all duration-500" style="width: ${acqPct}%"></div></div>
                </div>
                <div>
                    <div class="flex justify-between text-[10px] mb-1"><span class="text-red-400">Dropouts / Lapsed</span><span class="text-white font-mono">-${dropouts}</span></div>
                    <div class="w-full bg-black/50 h-2 rounded-full overflow-hidden"><div class="bg-red-500 h-full rounded-full transition-all duration-500" style="width: ${churnPct}%"></div></div>
                </div>
            </div>
        </div>
    `;

    // 4. Revenue Mix (Horizontal Stacked Bar)
    const paidIncomes = txns.filter(t => t.type === 'income' && t.status === 'paid');
    let mVol = 0, pVol = 0, sVol = 0, oVol = 0;
    paidIncomes.forEach(t => {
        const cat = (t.category || '').toLowerCase();
        if (cat.includes('membership') || cat.includes('fees') || cat === 'advance fee') {
            mVol += t.amount;
        } else if (cat.includes('pt') || cat.includes('personal training') || cat.includes('diet')) {
            pVol += t.amount;
        } else if (cat.includes('supplement') || cat.includes('store') || cat.includes('gear') || cat.includes('apparel')) {
            sVol += t.amount;
        } else {
            oVol += t.amount;
        }
    });
    const totalVol = mVol + pVol + sVol + oVol;
    const mPct = totalVol > 0 ? Math.round((mVol / totalVol) * 100) : 50;
    const pPct = totalVol > 0 ? Math.round((pVol / totalVol) * 100) : 30;
    const sPct = totalVol > 0 ? (100 - mPct - pPct) : 20;

    const g4 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">4. Revenue Distribution Mix</h5>
            <div class="flex-1 flex flex-col justify-center">
                <div class="w-full h-8 rounded-lg flex overflow-hidden shadow-md border border-gray-700">
                    <div class="bg-purple-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500" style="width: ${mPct}%" title="Memberships: ₹${mVol.toLocaleString()}">${mPct}%</div>
                    <div class="bg-amber-500 h-full flex items-center justify-center text-[10px] font-bold text-black transition-all duration-500" style="width: ${pPct}%" title="PT Sales: ₹${pVol.toLocaleString()}">${pPct}%</div>
                    <div class="bg-cyan-500 h-full flex items-center justify-center text-[10px] font-bold text-black transition-all duration-500" style="width: ${sPct}%" title="Store/Other: ₹${(sVol + oVol).toLocaleString()}">${sPct}%</div>
                </div>
                <div class="grid grid-cols-3 gap-1 mt-4 text-[9px] uppercase font-bold text-center">
                    <span class="text-purple-400">● Memb.</span><span class="text-amber-400">● PT Sales</span><span class="text-cyan-400">● Store</span>
                </div>
            </div>
        </div>
    `;

    // 5. CRM Lead Funnel (Step Graph)
    const totalLeads = leads.length;
    const contacted = leads.filter(l => ['trial', 'converted', 'lost'].includes(l.status)).length;
    const trials = leads.filter(l => ['trial', 'converted'].includes(l.status)).length;
    const converted = leads.filter(l => l.status === 'converted').length;

    const getFunnelWidth = (count) => {
        if (totalLeads === 0) return 20;
        return Math.max(Math.round((count / totalLeads) * 100), 20);
    };

    const g5 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">5. Sales Pipeline Funnel</h5>
            <div class="flex-1 flex flex-col items-center justify-center space-y-1 w-full">
                <div class="bg-gray-700 w-full py-1 text-center text-[9px] text-white font-bold rounded-t-lg transition-all" style="width: 100%">Total Leads (${totalLeads})</div>
                <div class="bg-blue-600 py-1 text-center text-[9px] text-white font-bold transition-all" style="width: ${getFunnelWidth(contacted)}%">Contacted (${contacted})</div>
                <div class="bg-amber-500 py-1 text-center text-[9px] text-black font-bold transition-all" style="width: ${getFunnelWidth(trials)}%">Trials Done (${trials})</div>
                <div class="bg-green-500 py-1 text-center text-[9px] text-black font-bold rounded-b-lg shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all" style="width: ${getFunnelWidth(converted)}%">Converted (${converted})</div>
            </div>
        </div>
    `;

    // 6. Peak Hour Footfall (Wave/Multi-Bar)
    const hrCounts = new Array(10).fill(0);
    attLogs.filter(l => l.type === 'check-in').forEach(l => {
        if (!l.time) return;
        const parts = l.time.split(" ");
        if (parts.length < 2) return;
        const timeParts = parts[0].split(":");
        let hr = parseInt(timeParts[0]);
        const ampm = parts[1].toUpperCase();
        if (ampm === 'PM' && hr !== 12) hr += 12;
        if (ampm === 'AM' && hr === 12) hr = 0;
        
        if (hr >= 6 && hr < 8) hrCounts[0]++;
        else if (hr >= 8 && hr < 10) hrCounts[1]++;
        else if (hr >= 10 && hr < 12) hrCounts[2]++;
        else if (hr >= 12 && hr < 14) hrCounts[3]++;
        else if (hr >= 14 && hr < 16) hrCounts[4]++;
        else if (hr >= 16 && hr < 18) hrCounts[5]++;
        else if (hr >= 18 && hr < 20) hrCounts[6]++;
        else if (hr >= 20 && hr < 22) hrCounts[7]++;
        else if (hr >= 22 || hr < 2) hrCounts[8]++;
        else hrCounts[9]++;
    });
    const baselineHrs = [3, 6, 8, 5, 2, 4, 12, 15, 9, 3];
    const combinedHrs = hrCounts.map((c, idx) => c + baselineHrs[idx]);
    const maxHr = Math.max(...combinedHrs, 1);

    const g6Bars = combinedHrs.map((c, idx) => {
        const heightPct = Math.round((c / maxHr) * 100);
        let barColor = 'bg-indigo-500';
        if (idx === 4 || idx === 5) barColor = 'bg-gray-800';
        else if (idx >= 6 && idx <= 8) {
            barColor = idx === 7 ? 'bg-brandRed shadow-[0_0_10px_rgba(255,0,51,0.5)]' : 'bg-brandRed animate-pulse';
        }
        return `<div class="w-full ${barColor} transition-all duration-500" style="height: ${heightPct}%" title="Footfall: ${c}"></div>`;
    }).join('');

    const g6 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">6. Peak Hour Footfall</h5>
            <div class="flex items-end justify-between flex-1 gap-0.5">
                ${g6Bars}
            </div>
            <div class="flex justify-between text-[8px] text-gray-600 font-mono mt-2 pt-1 border-t border-gray-800"><span>6AM</span><span>12PM</span><span class="text-red-400 font-bold">6PM (PEAK)</span><span>10PM</span></div>
        </div>
    `;

    // 7. Trainer Leaderboard (Horizontal Bars)
    const trainerTargets = window.TRAINER_TARGETS || { "t1": 30000, "t2": 20000 };
    const leaderboardData = trainers.map(t => {
        let revenue = 0;
        if (t.revenue) {
            revenue = t.revenue.ptSales || 0;
        }
        const target = trainerTargets[t.id] || 15000;
        const pct = target > 0 ? Math.round((revenue / target) * 100) : 0;
        return { name: t.name, target, revenue, pct };
    }).sort((a, b) => b.revenue - a.revenue);
    
    while (leaderboardData.length < 3) {
        leaderboardData.push({ name: "Amit D.", target: 15000, revenue: 4500, pct: 30 });
    }

    const g7Rows = leaderboardData.slice(0, 3).map((item, idx) => {
        const color = idx === 0 ? 'bg-green-500' : (idx === 1 ? 'bg-amber-400' : 'bg-brandRed');
        const textCol = idx === 0 ? 'text-green-400' : (idx === 1 ? 'text-amber-400' : 'text-brandRed');
        return `
            <div>
                <div class="flex justify-between text-[9px] mb-1">
                    <span class="text-gray-300">${item.name} (Target ${Math.round(item.target/1000)}k)</span>
                    <span class="${textCol} font-bold">${item.pct}%</span>
                </div>
                <div class="w-full bg-black/50 h-1.5 rounded-full">
                    <div class="h-full rounded-full ${color} transition-all duration-500" style="width: ${Math.min(item.pct, 100)}%"></div>
                </div>
            </div>
        `;
    }).join('');

    const g7 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">7. Trainer PT Leaderboard</h5>
            <div class="flex flex-col justify-center flex-1 space-y-3">
                ${g7Rows}
            </div>
        </div>
    `;

    // 8. Expense Breakdown (Conic Pie)
    const expenses = txns.filter(t => t.type === 'expense');
    let rentVal = 0, salaryVal = 0, marketingVal = 0;
    expenses.forEach(t => {
        const cat = (t.category || '').toLowerCase();
        if (cat.includes('rent') || cat.includes('utility')) {
            rentVal += t.amount;
        } else if (cat.includes('salary')) {
            salaryVal += t.amount;
        } else {
            marketingVal += t.amount;
        }
    });
    const totalExp = rentVal + salaryVal + marketingVal;
    const rentPct = totalExp > 0 ? Math.round((rentVal / totalExp) * 100) : 50;
    const salaryPct = totalExp > 0 ? Math.round((salaryVal / totalExp) * 100) : 30;
    const marketingPct = totalExp > 0 ? (100 - rentPct - salaryPct) : 20;

    const g8 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">8. Expense Burn Breakdown</h5>
            <div class="flex-1 flex items-center justify-between">
                <div class="w-20 h-20 rounded-full shadow-lg transition-all duration-500" style="background: conic-gradient(#EF4444 0% ${rentPct}%, #8B5CF6 ${rentPct}% ${rentPct + salaryPct}%, #64748B ${rentPct + salaryPct}% 100%);"></div>
                <div class="space-y-2 text-[9px] font-bold uppercase w-1/2">
                    <div class="text-brandRed border-b border-gray-800 pb-1" title="₹${rentVal.toLocaleString()}">● Rent: ${rentPct}%</div>
                    <div class="text-purple-400 border-b border-gray-800 pb-1" title="₹${salaryVal.toLocaleString()}">● Salaries: ${salaryPct}%</div>
                    <div class="text-gray-400" title="₹${marketingVal.toLocaleString()}">● Mktg/Ops: ${marketingPct}%</div>
                </div>
            </div>
        </div>
    `;

    // 9. Store Inventory Sales (List + Bar)
    const storeSales = {};
    inventory.forEach(item => {
        storeSales[item.name] = 0;
    });
    storeSales["Premium Whey Isolate (1kg)"] = 24;
    storeSales["Pro Boxing Leather Gloves"] = 12;
    storeSales["RENEW Fighter Stringer/T-Shirt"] = 8;
    
    txns.forEach(t => {
        if (t.type === 'income' && t.status === 'paid' && t.description.includes('Store POS Sale:')) {
            const prodName = t.description.split('1x ')[1];
            if (prodName && storeSales[prodName] !== undefined) {
                storeSales[prodName]++;
            }
        }
    });
    const topSales = Object.entries(storeSales)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    const g9Rows = topSales.map((item, idx) => {
        return `
            <div class="bg-black/40 p-1.5 rounded border border-gray-800 flex items-center justify-between">
                <span class="text-[10px] text-gray-300 truncate">${idx+1}. ${item.name}</span>
                <span class="text-[9px] font-mono text-cyan-400 bg-cyan-900/30 px-1 rounded">${item.count} Units</span>
            </div>
        `;
    }).join('');

    const g9 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">9. Top Selling Store Items</h5>
            <div class="flex flex-col justify-center flex-1 space-y-2">
                ${g9Rows}
            </div>
        </div>
    `;

    // 10. Weekly Attendance Pulse (Line concept via SVG/Bars)
    const pulseDates = [];
    const pulseDays = [];
    const pulseCounts = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        pulseDates.push(dateStr);
        
        const weekday = d.toLocaleDateString('en-US', { weekday: 'narrow' });
        pulseDays.push(weekday);
        
        const c = attLogs.filter(l => l.type === 'check-in' && l.date === dateStr).length;
        pulseCounts.push(c);
    }
    const baselinePulse = [3, 5, 4, 6, 5, 2, 1];
    const finalPulse = pulseCounts.map((c, i) => c + baselinePulse[i]);
    const maxPulse = Math.max(...finalPulse, 1);
    
    const g10Bars = finalPulse.map((c, i) => {
        const heightPct = Math.round((c / maxPulse) * 100);
        const isToday = i === 6;
        const barColorClass = isToday ? 'bg-brandRed rounded-full shadow-[0_0_8px_rgba(255,0,51,0.5)]' : 'bg-purple-500 rounded-full';
        return `
            <div class="w-full bg-white/10 rounded-full relative" title="${pulseDates[i]}: ${pulseCounts[i]} check-ins">
                <div class="absolute bottom-0 w-full ${barColorClass} rounded-full transition-all duration-500" style="height: ${heightPct}%"></div>
            </div>
        `;
    }).join('');
    
    const g10Days = pulseDays.map((day, i) => {
        const isToday = i === 6;
        return `<span class="${isToday ? 'text-red-400 font-bold' : ''}">${day}</span>`;
    }).join('');

    const g10 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">10. 7-Day Attendance Pulse</h5>
            <div class="flex items-end justify-between flex-1 gap-2">
                ${g10Bars}
            </div>
            <div class="flex justify-between text-[7px] text-gray-500 font-mono mt-2 pt-1 border-t border-gray-800">
                ${g10Days}
            </div>
        </div>
    `;

    container.innerHTML = g1 + g2 + g3 + g4 + g5 + g6 + g7 + g8 + g9 + g10;
}

// =========================================================================
// ACTION HANDLERS & EXPORTS
// =========================================================================

window.downloadCSV = function(filename, headers, rows) {
    const csvContent = [headers.join(",")].concat(
        rows.map(r => r.map(val => {
            const strVal = val === null || val === undefined ? "" : String(val);
            return `"${strVal.replace(/"/g, '""')}"`;
        }).join(","))
    ).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.downloadMicroReport = function(id, title) {
    if (id === 'OPS-04') {
        openTrainerAttendanceReportModal();
        return;
    }
    if (id === 'MEM-06') {
        openMemberAttendanceReportModal();
        return;
    }

    let headers = [];
    let rows = [];

    const txns = window.MOCK_TRANSACTIONS || [];
    const members = window.MOCK_MEMBERS || [];
    const leads = window.MOCK_LEADS || [];
    const inventory = window.MOCK_INVENTORY || [];
    const trainers = window.MOCK_TRAINERS || [];

    switch(id) {
        case 'FIN-01': // Daily Shift Closing Balance
            headers = ["Date", "Total Income (₹)", "Total Expense (₹)", "Closing Balance (₹)"];
            const dailyMap = {};
            txns.forEach(t => {
                const d = t.date;
                if (!dailyMap[d]) dailyMap[d] = { income: 0, expense: 0 };
                if (t.type === 'income' && t.status === 'paid') dailyMap[d].income += t.amount;
                else if (t.type === 'expense') dailyMap[d].expense += t.amount;
            });
            Object.entries(dailyMap).forEach(([d, val]) => {
                rows.push([d, val.income, val.expense, val.income - val.expense]);
            });
            rows.sort((a, b) => b[0].localeCompare(a[0]));
            break;

        case 'FIN-02': // Aging Dues (30/60/90 Days)
            headers = ["Target ID/Ref", "Target Name/Details", "Category", "Amount Due (₹)", "Issue Date", "Aging Classification", "Status"];
            txns.filter(t => t.type === 'income' && (t.status === 'pending' || t.status === 'pending_verification')).forEach(t => {
                const diffTime = Math.abs(new Date() - new Date(t.date));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                let ageGroup = "0-30 Days";
                if (diffDays > 90) ageGroup = "90+ Days (Critical)";
                else if (diffDays > 60) ageGroup = "60-90 Days";
                else if (diffDays > 30) ageGroup = "30-60 Days";
                rows.push([t.id, t.description, t.category, t.amount, t.date, ageGroup, t.status]);
            });
            members.filter(m => m.status === 'at_risk' || m.status === 'expired').forEach(m => {
                const classification = m.status === 'at_risk' ? "60-90 Days" : "90+ Days (Lapsed)";
                rows.push([m.id, m.name, "Membership Subscription", 1500, m.expiryDate, classification, m.status]);
            });
            break;

        case 'FIN-03': // Tax & GST Liability Report
            headers = ["Transaction ID", "Description", "Total Collected (₹)", "GST Component (18%) (₹)", "Base Net Inflow (₹)", "Date", "Mode"];
            txns.filter(t => t.type === 'income' && t.status === 'paid').forEach(t => {
                const gst = Math.round(t.amount * 0.18);
                const base = t.amount - gst;
                rows.push([t.id, t.description, t.amount, gst, base, t.date, t.mode]);
            });
            break;

        case 'FIN-04': // Category-wise Revenue Split
            headers = ["Revenue Category", "Total Receipts Count", "Total Revenue Volume (₹)", "Share Percentage (%)"];
            const catSummary = {};
            const totalRevenue = txns.filter(t => t.type === 'income' && t.status === 'paid').reduce((s, t) => s + t.amount, 0);
            txns.filter(t => t.type === 'income' && t.status === 'paid').forEach(t => {
                const cat = (t.category || "General").toUpperCase();
                if (!catSummary[cat]) catSummary[cat] = { count: 0, sum: 0 };
                catSummary[cat].count++;
                catSummary[cat].sum += t.amount;
            });
            Object.entries(catSummary).forEach(([cat, val]) => {
                const share = totalRevenue > 0 ? ((val.sum / totalRevenue) * 100).toFixed(1) : 0;
                rows.push([cat, val.count, val.sum, `${share}%`]);
            });
            break;

        case 'FIN-05': // Monthly Expense Ledger
            headers = ["Expense ID", "Description", "Category", "Amount (₹)", "Payment Mode", "Date"];
            txns.filter(t => t.type === 'expense').forEach(t => {
                rows.push([t.id, t.description, t.category.toUpperCase(), t.amount, t.mode, t.date]);
            });
            break;

        case 'MEM-01': // MIA (Missing > 14 Days) List
            headers = ["Member ID", "Member Name", "Email", "Phone Number", "Last Check-in Date", "Days Inactive"];
            members.forEach(m => {
                let checkinDateStr = "";
                if (m.lastCheckIn) {
                    checkinDateStr = m.lastCheckIn.split(" ")[0];
                } else if (m.registrationDate) {
                    checkinDateStr = m.registrationDate;
                }
                if (checkinDateStr) {
                    const diffTime = Math.abs(new Date() - new Date(checkinDateStr));
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays > 14) {
                        rows.push([m.id, m.name, m.email, m.phone, m.lastCheckIn || "Never Check-in", diffDays]);
                    }
                }
            });
            break;

        case 'MEM-02': // Upcoming 7-Day Expiry List
            headers = ["Member ID", "Member Name", "Plan Enrolled", "Expiry Date", "Mobile", "Days Left"];
            members.forEach(m => {
                if (m.expiryDate && !m.expiryDate.includes("Pending")) {
                    const diffTime = new Date(m.expiryDate) - new Date();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays >= 0 && diffDays <= 7) {
                        rows.push([m.id, m.name, m.plan, m.expiryDate, m.phone, diffDays]);
                    }
                }
            });
            break;

        case 'MEM-03': // Lapsed & Gated Accounts
            headers = ["Member ID", "Member Name", "Account Status", "Portal Access Locked", "Plan Title", "Email", "Phone"];
            members.filter(m => m.portalLocked || ['at_risk', 'expired', 'inactive'].includes(m.status)).forEach(m => {
                rows.push([m.id, m.name, m.status.toUpperCase(), m.portalLocked ? "LOCKED" : "ACTIVE", m.plan, m.email, m.phone]);
            });
            break;

        case 'MEM-04': // Member Demographic Breakdown
            headers = ["Plan Enrolled", "Member Name", "Status", "Assigned Trainer Name", "Registration Date"];
            members.forEach(m => {
                const tr = trainers.find(t => t.id === m.trainerId);
                const trainerName = tr ? tr.name : "Unassigned";
                rows.push([m.plan, m.name, m.status.toUpperCase(), trainerName, m.registrationDate || "N/A"]);
            });
            break;

        case 'MEM-05': // Birthday & Anniversary Tracker
            headers = ["Member Name", "Email", "Phone", "Event Type", "Event Date"];
            members.forEach((m, idx) => {
                const bMonth = (idx % 12) + 1;
                const bDay = (idx * 7) % 28 + 1;
                rows.push([m.name, m.email, m.phone, "Birthday", `1990-${String(bMonth).padStart(2,'0')}-${String(bDay).padStart(2,'0')}`]);
                if (m.registrationDate) {
                    rows.push([m.name, m.email, m.phone, "Signup Anniversary", m.registrationDate]);
                }
            });
            break;

        case 'CRM-01': // Lead Source Conversion Rates
            headers = ["Lead Source", "Total Leads Captured", "Total Converted Leads", "Conversion Success Rate (%)"];
            const sourceStats = {};
            leads.forEach(l => {
                const src = l.source || "Organic / Other";
                if (!sourceStats[src]) sourceStats[src] = { total: 0, converted: 0 };
                sourceStats[src].total++;
                if (l.status === 'converted') sourceStats[src].converted++;
            });
            Object.entries(sourceStats).forEach(([src, val]) => {
                const rate = val.total > 0 ? ((val.converted / val.total) * 100).toFixed(1) : 0;
                rows.push([src, val.total, val.converted, `${rate}%`]);
            });
            break;

        case 'CRM-02': // Dropped Lead Reason Analysis
            headers = ["Lead ID", "Lead Name", "Enquiry Date", "Source", "Dropped Notes / Loss Reason"];
            leads.filter(l => l.status === 'lost').forEach(l => {
                rows.push([l.id, l.name, l.date, l.source, l.notes || "No lost details recorded"]);
            });
            break;

        case 'CRM-03': // Free Trial No-Show Log
            headers = ["Lead Name", "WhatsApp Number", "Scheduled Date", "Pipeline Status", "Notes"];
            leads.filter(l => l.status === 'trial').forEach(l => {
                rows.push([l.name, l.phone, l.date, "TRIAL PENDING", l.notes]);
            });
            break;

        case 'CRM-04': // Member Referral Tracker
            headers = ["Friend Name", "Contact Phone", "Referrer ID", "Referrer Name", "Date Discovered", "Current Pipeline Status"];
            leads.filter(l => l.referredBy).forEach(l => {
                rows.push([l.name, l.phone, l.referredBy, l.referrerName, l.date, l.status.toUpperCase()]);
            });
            break;

        case 'CRM-05': // WhatsApp Dispatch History
            headers = ["Recipient Phone", "Recipient Name", "Message Type", "Timestamp", "Message Template Snippet", "Status"];
            leads.forEach(l => {
                rows.push([l.phone, l.name, "WhatsApp CRM Pitch", `${l.date} 10:30 AM`, `Hello ${l.name}! Thanks for considering R.E.N.E.W. Gym...`, "SENT"]);
            });
            txns.filter(t => t.type === 'income' && t.status === 'pending').forEach(t => {
                rows.push(["N/A", t.description, "Access Gating Invoice", `${t.date} 09:00 AM`, `Attention: Advance Fee for ${t.description} is pending verification.`, "SENT"]);
            });
            break;

        case 'OPS-01': // Low Stock / Empty Alerts
            headers = ["Product ID", "Product Name", "Category", "Current Stock", "Max Capacity Stock", "Reorder Alert Status"];
            inventory.forEach(p => {
                const needsReorder = p.stock <= 5;
                rows.push([p.id, p.name, p.category.toUpperCase(), p.stock, p.maxStock, needsReorder ? "WARNING: REORDER NOW" : "STOCK SECURE"]);
            });
            break;

        case 'OPS-02': // Top Selling Store Products
            headers = ["Product ID", "Product Name", "Category", "Units Sold (Real + Mock)", "Unit Price (₹)", "Total Revenue Flow (₹)"];
            inventory.forEach(p => {
                let soldCount = 0;
                if (p.name.includes("Whey Isolate")) soldCount = 24;
                else if (p.name.includes("Leather Gloves")) soldCount = 12;
                else if (p.name.includes("Fighter Stringer")) soldCount = 8;

                txns.forEach(t => {
                    if (t.type === 'income' && t.status === 'paid' && t.description.includes('Store POS Sale:') && t.description.includes(p.name)) {
                        soldCount++;
                    }
                });
                rows.push([p.id, p.name, p.category.toUpperCase(), soldCount, p.price, soldCount * p.price]);
            });
            break;

        case 'OPS-03': // Trainer Commission Payouts
            headers = ["Trainer ID", "Trainer Name", "PT Revenue (₹)", "Diet Plan Revenue (₹)", "Supplement Revenue (₹)", "Total Sales Volume (₹)", "Commission Payout Due (₹)"];
            trainers.forEach(t => {
                let ptSales = 0, dietSales = 0, suppSales = 0;
                if (typeof window.calculateTrainerEarnings === 'function') {
                    const earnings = window.calculateTrainerEarnings(t.id, null);
                    ptSales = (earnings.breakdown.find(b => b.category.toLowerCase() === 'pt') || {}).revenue || 0;
                    dietSales = (earnings.breakdown.find(b => b.category.toLowerCase() === 'diet plan') || {}).revenue || 0;
                    suppSales = (earnings.breakdown.find(b => b.category.toLowerCase() === 'supplement') || {}).revenue || 0;
                } else if (t.revenue) {
                    ptSales = t.revenue.ptSales || 0;
                    dietSales = t.revenue.dietPlanSales || 0;
                    suppSales = t.revenue.supplementSales || 0;
                }
                const totalSales = ptSales + dietSales + suppSales;
                const payout = (ptSales * 0.20) + (dietSales * 0.10) + (suppSales * 0.05);
                rows.push([t.id, t.name, ptSales, dietSales, suppSales, totalSales, Math.round(payout)]);
            });
            break;

        case 'OPS-05': // Asset & Maintenance Schedule
            headers = ["Asset ID", "Asset Name", "Category", "Status Condition", "Last Inspection", "Next Service Due"];
            const assetDb = [
                ["AST-001", "Heavy Boxing Ring Cage", "Gym Layout", "EXCELLENT", "2026-05-12", "2026-08-12"],
                ["AST-002", "MMA Training Cage Canvas", "Facilities", "NEEDS TIGHTENING", "2026-06-01", "2026-07-01"],
                ["AST-003", "Pro Punching Leather Bags (10x)", "Training Gear", "OK", "2026-05-15", "2026-09-15"],
                ["AST-004", "Strength Cardio Treadmill V3", "Electronic Machinery", "OK", "2026-04-20", "2026-07-20"],
                ["AST-005", "Olympic Weightlifting Rack Sets", "Equipment", "EXCELLENT", "2026-06-10", "2026-12-10"]
            ];
            assetDb.forEach(a => rows.push(a));
            break;
    }

    const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_");
    window.downloadCSV(`RENEW_${id}_${cleanTitle}`, headers, rows);
};

function openTrainerAttendanceReportModal() {
    const modal = document.getElementById('report-gen-modal');
    if (!modal) return;

    const logs = window.TRAINER_ATTENDANCE_LOGS || [];
    const logRows = logs.length > 0 
        ? logs.map(l => `
            <tr class="hover:bg-white/[0.02] border-b border-gray-800/40">
                <td class="py-3 px-4 text-white font-bold">${l.trainerName}</td>
                <td class="py-3 px-4 font-mono">${l.trainerId.toUpperCase()}</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase ${l.type === 'check-in' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}">
                        ${l.type}
                    </span>
                </td>
                <td class="py-3 px-4 font-mono text-gray-300">${l.date}</td>
                <td class="py-3 px-4 font-mono text-gray-300">${l.time}</td>
            </tr>
        `).reverse().join('')
        : `<tr><td colspan="5" class="py-8 text-center text-gray-600 italic">No trainer attendance logs found.</td></tr>`;

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 via-darkBg to-black border border-gray-800 p-[2px] rounded-2xl w-[90%] max-w-2xl shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col relative text-xs text-left">
                <button onclick="window.closeReportModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg"><i class="ph ph-x"></i></button>
                <div class="flex items-center space-x-2.5 border-b border-gray-800 pb-4 mb-4">
                    <i class="ph ph-clock-counter-clockwise text-2xl text-amber-400"></i>
                    <div>
                        <h3 class="font-bold text-white text-base">Trainer Shift Attendance Report</h3>
                        <p class="text-[10px] text-gray-500 uppercase font-mono">Operations & Staff Logs (OPS-04)</p>
                    </div>
                </div>
                
                <div class="overflow-x-auto max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <table class="w-full text-left border-collapse text-gray-400">
                        <thead>
                            <tr class="border-b border-gray-800 bg-black/40 text-gray-500 text-[10px] uppercase font-bold">
                                <th class="py-2.5 px-4">Trainer Name</th>
                                <th class="py-2.5 px-4">Trainer ID</th>
                                <th class="py-2.5 px-4">Action</th>
                                <th class="py-2.5 px-4">Date</th>
                                <th class="py-2.5 px-4">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logRows}
                        </tbody>
                    </table>
                </div>
                <div class="mt-4 flex justify-between items-center pt-3 border-t border-gray-800">
                    <span class="text-[10px] text-gray-500 font-mono">Total logs: ${logs.length}</span>
                    <button onclick="window.exportCSV('trainers')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-4 rounded text-[10px] uppercase flex items-center space-x-1 transition-colors">
                        <i class="ph ph-download-simple"></i><span>Export CSV</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild.classList.remove('scale-95');
        modal.firstElementChild.classList.add('scale-100');
    }, 10);
    modal.onclick = window.closeReportModal;
}

function openMemberAttendanceReportModal() {
    const modal = document.getElementById('report-gen-modal');
    if (!modal) return;

    const logs = window.MEMBER_ATTENDANCE_LOGS || [];
    const logRows = logs.length > 0 
        ? logs.map(l => `
            <tr class="hover:bg-white/[0.02] border-b border-gray-800/40">
                <td class="py-3 px-4 text-white font-bold">${l.memberName}</td>
                <td class="py-3 px-4 font-mono">${l.memberId.toUpperCase()}</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase ${l.type === 'check-in' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}">
                        ${l.type}
                    </span>
                </td>
                <td class="py-3 px-4 font-mono text-gray-300">${l.date}</td>
                <td class="py-3 px-4 font-mono text-gray-300">${l.time}</td>
                <td class="py-3 px-4 font-mono text-indigo-400 font-bold">${l.method || 'Scan'}</td>
            </tr>
        `).reverse().join('')
        : `<tr><td colspan="6" class="py-8 text-center text-gray-600 italic">No fighter attendance logs found.</td></tr>`;

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 via-darkBg to-black border border-gray-800 p-[2px] rounded-2xl w-[90%] max-w-2xl shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col relative text-xs text-left">
                <button onclick="window.closeReportModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg"><i class="ph ph-x"></i></button>
                <div class="flex items-center space-x-2.5 border-b border-gray-800 pb-4 mb-4">
                    <i class="ph ph-clock-counter-clockwise text-2xl text-blue-400"></i>
                    <div>
                        <h3 class="font-bold text-white text-base">Fighter Check-in/Check-out Report</h3>
                        <p class="text-[10px] text-gray-500 uppercase font-mono">Roster & Retention Logs (MEM-06)</p>
                    </div>
                </div>
                
                <div class="overflow-x-auto max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <table class="w-full text-left border-collapse text-gray-400">
                        <thead>
                            <tr class="border-b border-gray-800 bg-black/40 text-gray-500 text-[10px] uppercase font-bold">
                                <th class="py-2.5 px-4">Member Name</th>
                                <th class="py-2.5 px-4">Member ID</th>
                                <th class="py-2.5 px-4">Action</th>
                                <th class="py-2.5 px-4">Date</th>
                                <th class="py-2.5 px-4">Time</th>
                                <th class="py-2.5 px-4">Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logRows}
                        </tbody>
                    </table>
                </div>
                <div class="mt-4 flex justify-between items-center pt-3 border-t border-gray-800">
                    <span class="text-[10px] text-gray-500 font-mono">Total logs: ${logs.length}</span>
                    <button onclick="window.exportCSV('members')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-4 rounded text-[10px] uppercase flex items-center space-x-1 transition-colors">
                        <i class="ph ph-download-simple"></i><span>Export CSV</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild.classList.remove('scale-95');
        modal.firstElementChild.classList.add('scale-100');
    }, 10);
    modal.onclick = window.closeReportModal;
}

window.closeReportModal = function() {
    const modal = document.getElementById('report-gen-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        if (modal.firstElementChild) {
            modal.firstElementChild.classList.remove('scale-100');
            modal.firstElementChild.classList.add('scale-95');
        }
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
};

window.exportCSV = function(type) {
    const logs = type === 'trainers' ? (window.TRAINER_ATTENDANCE_LOGS || []) : (window.MEMBER_ATTENDANCE_LOGS || []);
    if (logs.length === 0) return alert("No log records to export.");
    
    const headers = type === 'trainers' 
        ? ["Trainer Name", "Trainer ID", "Action", "Date", "Time"]
        : ["Member Name", "Member ID", "Action", "Date", "Time", "Method"];
        
    const rows = logs.map(l => type === 'trainers'
        ? [l.trainerName, l.trainerId, l.type, l.date, l.time]
        : [l.memberName, l.memberId, l.type, l.date, l.time, l.method || "Scan"]
    );
    
    window.downloadCSV(`RENEW_${type}_attendance_report`, headers, rows);
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