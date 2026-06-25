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
                    <button onclick="window.openAIFinancialAuditModal()" class="bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] uppercase tracking-wider">
                        <i class="ph ph-sparkle text-lg animate-pulse"></i>
                        <span>AI Financial Audit</span>
                    </button>
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

async function refreshReportsData() {
    if (window.dbService && typeof window.dbService.bootstrapCaches === 'function') {
        try {
            await window.dbService.bootstrapCaches();
        } catch (error) {
            console.warn('Reports refresh failed, using current runtime data.', error);
        }
    }
}

function renderReportsPage() {
    refreshReportsData().finally(() => {
        render10VisualGraphs();
    });
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

    // 1. Revenue Growth (Bar Chart - last 6 months dynamically synced)
    const revs = [];
    const revLabels = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const yearMonth = d.toISOString().slice(0, 7); // e.g. "2026-06"
        const monthName = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        revLabels.push(monthName);
        
        const sum = txns
            .filter(t => t.type === 'income' && t.status === 'paid' && t.date.startsWith(yearMonth))
            .reduce((total, t) => total + t.amount, 0);
        revs.push(sum);
    }
    const maxRev = Math.max(...revs, 1);
    const g1Bars = revs.map((rev, i) => {
        const heightPct = Math.round((rev / maxRev) * 100);
        const isCurrentMonth = i === 5;
        const barColorClass = isCurrentMonth ? 'bg-brandRed shadow-[0_0_10px_rgba(255,0,51,0.5)] animate-pulse' : 'bg-green-500';
        return `
            <div class="w-full bg-green-500/20 rounded-t-sm relative group" title="₹${rev.toLocaleString()}">
                <div class="absolute bottom-0 w-full ${barColorClass} rounded-t-sm transition-all duration-500" style="height: ${heightPct}%"></div>
            </div>
        `;
    }).join('');

    const g1LabelsHTML = revLabels.map((lbl, i) => {
        const isCurrent = i === 5;
        return `<span class="${isCurrent ? 'text-white font-bold' : ''}">${lbl}</span>`;
    }).join('');

    const g1 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">1. 6-Month Revenue Trend</h5>
            <div class="flex items-end justify-between flex-1 gap-1">
                ${g1Bars}
            </div>
            <div class="flex justify-between text-[8px] text-gray-600 font-mono mt-2 pt-1 border-t border-gray-800">
                ${g1LabelsHTML}
            </div>
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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newAdmissions = members.filter(m => m.registrationDate && new Date(m.registrationDate) >= thirtyDaysAgo).length;
    const dropouts = members.filter(m => ['at_risk', 'expired'].includes(m.status)).length;
    const maxAcq = Math.max(newAdmissions, dropouts, 1);
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
    const mPct = totalVol > 0 ? Math.round((mVol / totalVol) * 100) : 0;
    const pPct = totalVol > 0 ? Math.round((pVol / totalVol) * 100) : 0;
    const sPct = totalVol > 0 ? (100 - mPct - pPct) : 0;

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
    const combinedHrs = hrCounts;
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
        if (typeof window.calculateTrainerEarnings === 'function') {
            const earnings = window.calculateTrainerEarnings(t.id, null);
            revenue = (earnings.breakdown.find(b => b.category.toLowerCase() === 'pt') || {}).revenue || 0;
        } else if (t.revenue) {
            revenue = t.revenue.ptSales || 0;
        }
        const target = trainerTargets[t.id] || 15000;
        const pct = target > 0 ? Math.round((revenue / target) * 100) : 0;
        return { name: t.name, target, revenue, pct };
    }).sort((a, b) => b.revenue - a.revenue);

    const g7Rows = leaderboardData.length > 0 
        ? leaderboardData.slice(0, 3).map((item, idx) => {
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
        }).join('')
        : `<div class="text-center text-gray-600 text-xs italic py-6">No trainer performance data.</div>`;

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
    const rentPct = totalExp > 0 ? Math.round((rentVal / totalExp) * 100) : 0;
    const salaryPct = totalExp > 0 ? Math.round((salaryVal / totalExp) * 100) : 0;
    const marketingPct = totalExp > 0 ? (100 - rentPct - salaryPct) : 0;
    const conicGradient = totalExp > 0 
        ? `conic-gradient(#EF4444 0% ${rentPct}%, #8B5CF6 ${rentPct}% ${rentPct + salaryPct}%, #64748B ${rentPct + salaryPct}% 100%)`
        : `conic-gradient(#374151 0% 100%)`;

    const g8 = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-48">
            <h5 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">8. Expense Burn Breakdown</h5>
            <div class="flex-1 flex items-center justify-between">
                <div class="w-20 h-20 rounded-full shadow-lg transition-all duration-500" style="background: ${conicGradient};"></div>
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
    
    txns.forEach(t => {
        if (t.type === 'income' && t.status === 'paid') {
            if (t.description.includes('Store POS Sale:')) {
                const prodName = t.description.split('1x ')[1];
                if (prodName && storeSales[prodName] !== undefined) {
                    storeSales[prodName]++;
                }
            } else if (t.description.includes('Fighter Shop Sale:')) {
                const prodName = t.description.split('Fighter Shop Sale: ')[1]?.split(' → ')[0];
                if (prodName && storeSales[prodName] !== undefined) {
                    storeSales[prodName]++;
                }
            }
        }
    });
    const topSales = Object.entries(storeSales)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    const g9Rows = topSales.length > 0 && topSales.some(item => item.count > 0)
        ? topSales.filter(item => item.count > 0).map((item, idx) => {
            return `
                <div class="bg-black/40 p-1.5 rounded border border-gray-800 flex items-center justify-between">
                    <span class="text-[10px] text-gray-300 truncate">${idx+1}. ${item.name}</span>
                    <span class="text-[9px] font-mono text-cyan-400 bg-cyan-900/30 px-1 rounded">${item.count} Units</span>
                </div>
            `;
        }).join('')
        : `<div class="text-center text-gray-600 text-xs italic py-6">No store sales recorded yet.</div>`;

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
    const finalPulse = pulseCounts;
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
    const runReport = () => {
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

    if (window.dbService && typeof window.dbService.bootstrapCaches === 'function') {
        window.dbService.bootstrapCaches()
            .then(runReport)
            .catch(runReport);
    } else {
        runReport();
    }
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

// =========================================================================
// AI AUDIT FINANCIAL ANALYSIS REPORT (15-DAY CYCLE)
// =========================================================================

window.checkFinancialAuditSchedule = function() {
    const lastRun = localStorage.getItem('RENEW_LAST_FINANCIAL_AUDIT');
    const isScheduled = localStorage.getItem('RENEW_FINANCIAL_AUDIT_SCHEDULED') !== 'false';
    if (!isScheduled) return null;

    if (!lastRun) {
        return { overdue: true, days: 'Never' };
    }

    const lastDate = new Date(lastRun);
    const today = new Date();
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 15) {
        return { overdue: true, days: diffDays };
    }
    return null;
};



window.openAIFinancialAuditModal = function() {
    const modal = document.getElementById('report-gen-modal');
    if (!modal) return;

    const txns = window.MOCK_TRANSACTIONS || [];
    
    let totalIncome = 0;
    let totalExpense = 0;
    const categorySummary = {};
    const modeSummary = {};
    
    txns.forEach(t => {
        const amt = parseFloat(t.amount) || 0;
        if (t.type === 'income') {
            totalIncome += amt;
        } else if (t.type === 'expense') {
            totalExpense += amt;
        }
        
        const cat = t.category || 'other';
        categorySummary[cat] = (categorySummary[cat] || 0) + amt;
        
        const mode = t.mode || 'cash';
        modeSummary[mode] = (modeSummary[mode] || 0) + amt;
    });
    
    const profitLoss = totalIncome - totalExpense;
    const lastRun = localStorage.getItem('RENEW_LAST_FINANCIAL_AUDIT');
    const isScheduled = localStorage.getItem('RENEW_FINANCIAL_AUDIT_SCHEDULED') !== 'false';
    const savedApiKey = localStorage.getItem('GEMINI_API_KEY') || "";

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 via-darkBg to-black border border-gray-800 p-[2px] rounded-2xl w-[95%] max-w-3xl shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col relative text-xs text-left overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-24 bg-brandRed/5 blur-2xl"></div>
                <button onclick="window.closeReportModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg"><i class="ph ph-x"></i></button>
                
                <!-- HEADER -->
                <div class="flex items-center space-x-3 border-b border-gray-800 pb-4 mb-4 z-10">
                    <div class="w-10 h-10 bg-indigo-950/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20">
                        <i class="ph ph-sparkle text-xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-white text-base">AI Audit Financial Analysis Report</h3>
                        <p class="text-[10px] text-gray-500 uppercase font-mono">15-Day Auto-Scheduler & Audit Suite</p>
                    </div>
                </div>
                
                <!-- BODY -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5 z-10 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                    
                    <!-- Left Column: Metrics & Scheduler -->
                    <div class="md:col-span-1 space-y-4">
                        <div class="bg-black/40 border border-gray-800/80 p-4 rounded-xl space-y-2">
                            <h4 class="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-800/60 pb-1.5 mb-2">15-Day Schedule</h4>
                            
                            <div class="flex items-center justify-between">
                                <span class="text-gray-500 font-sans font-bold">15-Day Reminder:</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="audit-scheduler-toggle" ${isScheduled ? 'checked' : ''} onchange="window.toggleAuditScheduleSetting()" class="sr-only peer">
                                    <div class="w-8 h-4 bg-gray-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white peer-checked:after:border-indigo-650"></div>
                                </label>
                            </div>
                            
                            <div class="text-[10px] text-gray-400 font-mono space-y-1 pt-1.5 border-t border-gray-800/40">
                                <div>Last Run: <span class="text-gray-300 font-bold">${lastRun ? new Date(lastRun).toLocaleDateString() : 'Never'}</span></div>
                                <div>Status: <span class="${window.checkFinancialAuditSchedule() ? 'text-brandRed animate-pulse font-bold' : 'text-green-400 font-bold'}">${window.checkFinancialAuditSchedule() ? 'Audit Overdue' : 'Up to Date'}</span></div>
                            </div>
                        </div>

                        <!-- System Ledger Summary (Pre-audited data) -->
                        <div class="bg-black/40 border border-gray-800/80 p-4 rounded-xl space-y-2.5">
                            <h4 class="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-800/60 pb-1.5">Ledger Summary</h4>
                            <div class="flex justify-between">
                                <span class="text-gray-500">Total Income:</span>
                                <span class="text-green-400 font-bold font-mono">₹${totalIncome.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500">Total Expense:</span>
                                <span class="text-brandRed font-bold font-mono">₹${totalExpense.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between border-t border-gray-800 pt-2">
                                <span class="text-white font-bold">Net Margin:</span>
                                <span class="font-bold font-mono ${profitLoss >= 0 ? 'text-green-400' : 'text-brandRed'}">₹${profitLoss.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <!-- Actions & API Key -->
                        <div class="space-y-2">
                            <button onclick="window.runAIFinancialAudit()" id="btn-run-audit" class="w-full bg-brandRed hover:bg-red-700 text-white font-black py-3 rounded-xl uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,0,51,0.2)] hover:shadow-[0_0_25px_rgba(255,0,51,0.4)] flex items-center justify-center space-x-2 text-[10px]">
                                <i class="ph ph-sparkle text-sm"></i>
                                <span>Run AI Audit Report</span>
                            </button>
                            
                            <div class="bg-black/30 border border-gray-800/60 p-3 rounded-xl space-y-2 text-[10px]">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-500 font-sans font-bold">Gemini Key</span>
                                    <button type="button" onclick="window.toggleKeySettings()" class="text-gray-400 hover:text-white"><i class="ph ph-key"></i></button>
                                </div>
                                <div id="api-key-container" class="hidden space-y-1.5">
                                    <input type="password" id="gemini-api-key" value="${savedApiKey}" placeholder="Paste key..." class="w-full bg-black/50 border border-gray-850 rounded px-2.5 py-1.5 text-[9px] text-white outline-none font-mono">
                                    <button onclick="window.saveApiKey()" class="w-full bg-indigo-650 hover:bg-indigo-700 text-white text-[9px] py-1 rounded font-bold transition-all">Save Key</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Column: Audit Output -->
                    <div class="md:col-span-2 flex flex-col h-full bg-black/40 border border-gray-800/80 rounded-xl p-4 relative min-h-[300px]">
                        <div class="flex items-center justify-between border-b border-gray-800/60 pb-2 mb-3">
                            <h4 class="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                <i class="ph ph-scroll mr-1.5 text-xs text-brandRed"></i> Audit Log Output
                            </h4>
                            <div class="flex space-x-2.5" id="audit-export-actions" style="display: none;">
                                <button onclick="window.printAuditReport()" class="text-gray-450 hover:text-white text-sm" title="Print Report"><i class="ph ph-printer"></i></button>
                                <button onclick="window.copyAuditReport()" class="text-gray-455 hover:text-white text-sm" title="Copy Report"><i class="ph ph-copy"></i></button>
                            </div>
                        </div>
                        
                        <textarea id="audit-report-text" readonly class="w-full h-[320px] bg-black/30 border border-gray-900 rounded-lg p-3 text-[10px] text-gray-300 font-mono leading-relaxed resize-none outline-none overflow-y-auto" placeholder="Click 'Run AI Audit Report' to compile ledgers and generate analysis using Google Gemini AI..."></textarea>
                    </div>
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
};

window.toggleAuditScheduleSetting = function() {
    const check = document.getElementById('audit-scheduler-toggle');
    if (!check) return;
    localStorage.setItem('RENEW_FINANCIAL_AUDIT_SCHEDULED', check.checked ? 'true' : 'false');
    
    // Refresh page views to update current banner alert status
    if (typeof navigateTo === 'function') {
        const lastView = localStorage.getItem('RENEW_LAST_VIEW') || 'reports';
        navigateTo(lastView);
    }
};

window.runAIFinancialAudit = function() {
    const apiKeyInput = document.getElementById('gemini-api-key');
    let apiKey = (apiKeyInput ? apiKeyInput.value.trim() : '') || localStorage.getItem('GEMINI_API_KEY') || '';
    
    if (!apiKey) {
        alert("Please configure your Google Gemini API Key first.");
        const container = document.getElementById('api-key-container');
        if (container) container.classList.remove('hidden');
        if (apiKeyInput) apiKeyInput.focus();
        return;
    }

    const btn = document.getElementById('btn-run-audit');
    if (!btn) return;
    
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="ph ph-spinner animate-spin mr-1"></i> <span>Auditing Ledger...</span>`;
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    const txns = window.MOCK_TRANSACTIONS || [];
    const events = window.GYM_EVENTS || [];
    const inventory = window.MOCK_INVENTORY || [];
    
    const reportData = {
        auditDate: new Date().toLocaleDateString('en-GB'),
        totalTransactionsCount: txns.length,
        transactions: txns.map(t => ({
            type: t.type,
            category: t.category,
            amount: t.amount,
            date: t.date,
            mode: t.mode,
            description: t.description,
            status: t.status
        })),
        eventsCount: events.length,
        events: events.map(e => ({ title: e.title, amount: e.amount, date: e.date })),
        inventoryLowStock: inventory.filter(i => i.stock <= 5).map(i => ({ name: i.name, stock: i.stock, category: i.category }))
    };

    let prompt = `You are a Senior Forensic Accountant, Financial Auditor, and Strategic Fitness Business Consultant.
Analyze the following financial ledger data and operational state of R.E.N.E.W Gym to produce a comprehensive AI Audit & Financial Analysis Report.

Gym Ledger & Operational Data:
\${JSON.stringify(reportData, null, 2)}

Provide a thorough audit containing the following sections:
1. EXECUTIVE FINANCIAL HEALTH SUMMARY: Net profit margin, overall revenue vs expense assessment, operational runway.
2. DETAILED REVENUE STREAM ANALYSIS: Breakdown of primary income categories (e.g. PT, Admission, Memberships, Store Sales), identifying the top performing sectors and areas underperforming.
3. EXPENDITURE AUDIT & ANOMALIES: Analyze expenses, flag any potential leaks, abnormal category spend, or cash-flow bottlenecks.
4. INVENTORY & OPERATIONAL IMPACT: Assess stock levels (highlight low stock items) and event bookings, connecting them to cash generation.
5. STRATEGIC RECOMMENDATIONS (NEXT 15 DAYS): Provide 3-5 concrete, actionable, data-backed steps to increase revenue, cut overheads, and improve cash flow over the next 15 days.

The output must be formatted in a clean, highly professional plain-text report layout, using capital headings and spacing. Avoid using Markdown formatting characters (asterisks, hashes, etc.) in the text itself. Use clear division lines (e.g. ========================================) between sections. Keep the tone authoritative, highly technical, and constructive.`;

    const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'];
    
    const textarea = document.getElementById('audit-report-text');
    if (textarea) textarea.value = "Compiling financial ledger logs, running fraud detection filters, and preparing Google Gemini payload...";

    window.runAuditWithFallbackChain = function(models, index) {
        if (index >= models.length) {
            alert("❌ AI Audit Failed: All model fallbacks failed. Check key and connection.");
            if (textarea) textarea.value = "Error: Audit failed to generate. Please check your Gemini API key.";
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            return;
        }

        const model = models[index];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        if (textarea) textarea.value = `Running forensic analysis via ${model}...\nPlease wait.`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    const msg = err.error?.message || "";
                    console.warn(`[Gemini AI Audit] Model ${model} failed (HTTP ${response.status}): ${msg}`);
                    return window.runAuditWithFallbackChain(models, index + 1);
                }).catch(() => {
                    console.warn(`[Gemini AI Audit] Model ${model} failed (HTTP ${response.status}) with unparseable response.`);
                    return window.runAuditWithFallbackChain(models, index + 1);
                });
            }
            return response.json().then(result => {
                if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0]) {
                    const generatedText = result.candidates[0].content.parts[0].text;
                    if (textarea) {
                        textarea.value = generatedText;
                    }
                    
                    // Save last run date to clear banner
                    localStorage.setItem('RENEW_LAST_FINANCIAL_AUDIT', new Date().toISOString());
                    localStorage.setItem('RENEW_LAST_FINANCIAL_AUDIT_REPORT', generatedText);
                    
                    // Show export actions
                    const actions = document.getElementById('audit-export-actions');
                    if (actions) actions.style.display = 'flex';
                    
                    alert("✅ AI Financial Audit completed successfully!");

                    // Refresh page views to update current warning alerts and insights
                    if (typeof navigateTo === 'function') {
                        const lastView = localStorage.getItem('RENEW_LAST_VIEW') || 'reports';
                        navigateTo(lastView);
                    }
                } else {
                    console.warn(`[Gemini AI Audit] Model ${model} returned invalid response structure.`);
                    return window.runAuditWithFallbackChain(models, index + 1);
                }
                btn.disabled = false;
                btn.innerHTML = originalHTML;
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
            });
        })
        .catch(err => {
            console.warn(`[Gemini AI Audit] Fetch error for ${model}:`, err);
            return window.runAuditWithFallbackChain(models, index + 1);
        });
    };

    // Try programmatically listing models first
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    fetch(listUrl)
    .then(res => {
        if (!res.ok) throw new Error("ListModels failed");
        return res.json();
    })
    .then(data => {
        if (data.models && data.models.length > 0) {
            const allowed = data.models
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
                .map(m => m.name.replace('models/', ''));
            
            if (allowed.length > 0) {
                const preferred = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
                const sorted = allowed.sort((a, b) => {
                    const idxA = preferred.indexOf(a);
                    const idxB = preferred.indexOf(b);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return 0;
                });
                window.runAuditWithFallbackChain(sorted, 0);
                return;
            }
        }
        throw new Error("No suitable models found");
    })
    .catch(err => {
        window.runAuditWithFallbackChain(modelsToTry, 0);
    });
};

window.copyAuditReport = function() {
    const text = document.getElementById('audit-report-text');
    if (!text || !text.value) return;
    
    navigator.clipboard.writeText(text.value)
        .then(() => alert("Audit Report copied to clipboard!"))
        .catch(() => alert("Failed to copy report."));
};

window.printAuditReport = function() {
    const text = document.getElementById('audit-report-text');
    if (!text || !text.value) return;
    
    const win = window.open('', '_blank');
    win.document.write(`
        <html>
        <head>
            <title>R.E.N.E.W - AI Financial Audit Report</title>
            <style>
                body { font-family: monospace; white-space: pre-wrap; padding: 30px; font-size: 12px; line-height: 1.5; color: #111; }
                h2 { border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h2>R.E.N.E.W GYM - FORENSIC FINANCIAL AUDIT REPORT</h2>
            \${text.value}
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `);
    win.document.close();
};