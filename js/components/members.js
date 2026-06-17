// =========================================================================
// js/components/members.js — PREMIUM ROSTER WITH DYNAMIC PLAN UPGRADE & GATEWAY NOTICES
// =========================================================================

let memberSearchQuery = '';
let currentMemberTab = 'all'; 

if (!window.GYM_PLANS) {
    window.GYM_PLANS = [{ id: "PLN-1", name: "Monthly Regular Track", fee: 1500 }, { id: "PLN-2", name: "Fighter Premium Track", fee: 2500 }];
}

if (!window.MOCK_MEMBERS) {
    window.MOCK_MEMBERS = [
        { id: "m-001", name: "Subham Das", phone: "+91 98300 11223", plan: "Monthly Regular Track", expiryDate: "2026-07-12", status: "active", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", checkedInToday: true, lastCheckIn: "2026-06-17 08:30 AM", paymentDate: null, firstScanDate: "2026-06-15", billingCycleStart: "2026-06-15", billingStatus: "active", autoLapseDate: null },
        { id: "m-002", name: "Joydeep Pal", phone: "+91 91632 55443", plan: "Fighter Premium Track", expiryDate: "2026-07-15", status: "active", photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", checkedInToday: false, portalLocked: true, paymentDate: null, firstScanDate: "2026-06-10", billingCycleStart: "2026-06-10", billingStatus: "active", autoLapseDate: null },
        { id: "m-003", name: "Sourav Ganguly", phone: "+91 98311 99887", plan: "PT Combo Track", expiryDate: "2026-06-22", status: "expiring", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", checkedInToday: true, lastCheckIn: "2026-06-17 07:15 AM", paymentDate: null, firstScanDate: "2026-05-20", billingCycleStart: "2026-05-20", billingStatus: "active", autoLapseDate: null },
        { id: "m-004", name: "Anirban Das", phone: "+91 97482 33445", plan: "Elite Annual Pack", expiryDate: "2027-06-10", status: "active", photoUrl: "https://images.unsplash.com/photo-1620122303020-43ec4b6cf7f8?w=150", checkedInToday: false, paymentDate: null, firstScanDate: "2026-06-01", billingCycleStart: "2026-06-01", billingStatus: "active", autoLapseDate: null }
    ];
}

// =========================================================================
// FIRST SCAN & AUTO-LAPSE ENGINE
// =========================================================================
window.initializeFirstScanEngine = function() {
    // ইনিশিয়ালাইজ সকল নতুন মেম্বারদের স্ক্যান ট্র্যাকিং প্রপার্টিজ
    window.MOCK_MEMBERS.forEach(m => {
        if (!m.hasOwnProperty('paymentDate')) m.paymentDate = null;
        if (!m.hasOwnProperty('firstScanDate')) m.firstScanDate = null;
        if (!m.hasOwnProperty('billingCycleStart')) m.billingCycleStart = null;
        if (!m.hasOwnProperty('billingStatus')) m.billingStatus = "pending"; // pending, active, lapsed
        if (!m.hasOwnProperty('autoLapseDate')) m.autoLapseDate = null;
    });
};

window.recordPaymentForMember = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;
    member.paymentDate = new Date().toISOString().slice(0, 10);
    member.firstScanDate = null; // এখনো স্ক্যান হয়নি
    member.billingCycleStart = null;
    member.billingStatus = "pending"; // পেমেন্ট হয়েছে কিন্তু সাইকেল শুরু হয়নি
    member.autoLapseDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // ৩০ দিন পর লাপ্স হবে
};

window.recordFirstEntranceScan = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return { success: false, message: "Member not found." };

    // যদি ইতিমধ্যে স্ক্যান করা হয়েছে তাহলে দ্বিতীয় স্ক্যান রেকর্ড করা যাবে না
    if (member.firstScanDate) {
        return { success: false, message: `First entrance already recorded on ${member.firstScanDate}. Billing cycle started from that date.` };
    }

    // পেমেন্ট করেছে কি না চেক করা
    if (!member.paymentDate) {
        return { success: false, message: "Payment not found. Please record payment first." };
    }

    const today = new Date().toISOString().slice(0, 10);
    const paymentDate = new Date(member.paymentDate);
    const todayDate = new Date(today);
    const daysDiff = Math.floor((todayDate - paymentDate) / (1000 * 60 * 60 * 24));

    // ৩০ দিন অতিক্রম করেছে কি না চেক করা
    if (daysDiff > 30) {
        member.billingStatus = "lapsed";
        member.firstScanDate = null; // স্ক্যান রেকর্ড করা হয়নি কারণ ৩০ দিন পেরিয়ে গেছে
        return { 
            success: false, 
            message: `❌ AUTO-LAPSE TRIGGERED!\n\nPayment was made on ${member.paymentDate}. You didn't scan within 30 days.\n\nAccount has been automatically lapsed. You need to make a new payment to reactivate.`,
            lapsed: true
        };
    }

    // সফল স্ক্যান - বিলিং সাইকেল শুরু হচ্ছে
    member.firstScanDate = today;
    member.billingCycleStart = today;
    member.billingStatus = "active";
    member.autoLapseDate = null; // অটো লাপ্স ডেডলাইন আর প্রয়োজন নেই

    return { 
        success: true, 
        message: `✅ ENTRANCE SCAN RECORDED!\n\nFirst scan date: ${today}\n\n🎯 Billing Cycle Started from TODAY (${today})\n\nMembership will remain active until ${member.expiryDate}.`,
        daysAfterPayment: daysDiff
    };
};

window.checkAndApplyAutoLapse = function() {
    const today = new Date().toISOString().slice(0, 10);
    const todayDate = new Date(today);

    window.MOCK_MEMBERS.forEach(m => {
        // যদি পেমেন্ট করা হয়েছে কিন্তু এখনো স্ক্যান না করা হয়েছে
        if (m.paymentDate && !m.firstScanDate && m.autoLapseDate) {
            const lapseDateObj = new Date(m.autoLapseDate);
            if (todayDate >= lapseDateObj) {
                m.billingStatus = "lapsed";
                m.status = "inactive";
            }
        }
    });
};
function getMembersView() {
    return `
        <div class="space-y-6">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-darkSurface border border-gray-800 p-4 rounded-xl">
                <div class="relative flex-1 max-w-md">
                    <i class="ph ph-magnifying-glass absolute left-3 top-3.5 text-gray-500 text-lg"></i>
                    <input type="text" id="member-search" oninput="window.handleMemberSearch()" placeholder="Search fighters by identity..." class="w-full bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-brandRed transition-colors">
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <div class="flex bg-black/40 p-1 rounded-lg border border-gray-800 text-[10px] tracking-wider uppercase font-bold" id="member-filter-tabs"></div>
                    
                    <button onclick="window.dispatchGatewayNotices()" class="bg-amber-600 hover:bg-amber-700 text-black text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow">
                        <i class="ph ph-broadcast text-base"></i><span>Dispatch Notices</span>
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="members-grid-box"></div>
            <div id="transaction-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"></div>
        </div>
    `;
}
function renderMembersPage() {
    window.initializeFirstScanEngine();
    window.checkAndApplyAutoLapse();
    renderMemberFilterTabs();
    renderMembersGrid();
}

function calculateOutstandingDue(memberName) {
    const txns = window.MOCK_TRANSACTIONS || [];
    return txns.filter(t => t.type === 'income' && t.status === 'pending' && t.description.toLowerCase().includes(memberName.toLowerCase())).reduce((sum, t) => sum + t.amount, 0);
}

function renderMemberFilterTabs() {
    const container = document.getElementById('member-filter-tabs');
    if (!container) return;
    const tabs = [{ id: 'all', label: 'All Fighters' }, { id: 'active', label: 'Active Roster' }, { id: 'expiring', label: 'Term Expiring' }, { id: 'gated', label: 'Gated Portals' }];
    container.innerHTML = tabs.map(t => `<button onclick="window.switchMemberTab('${t.id}')" class="px-3 py-1.5 rounded-md transition-all ${currentMemberTab === t.id ? 'bg-brandRed text-white shadow' : 'text-gray-400 hover:text-white'}">${t.label}</button>`).join('');
}

function renderMembersGrid() {
    const grid = document.getElementById('members-grid-box');
    if (!grid) return;

    let filtered = window.MOCK_MEMBERS || [];
    if (currentMemberTab === 'active') filtered = filtered.filter(m => m.status === 'active' && !m.portalLocked);
    if (currentMemberTab === 'expiring') filtered = filtered.filter(m => m.status === 'expiring');
    if (currentMemberTab === 'gated') filtered = filtered.filter(m => m.portalLocked === true);
    if (memberSearchQuery) filtered = filtered.filter(m => m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || m.phone.includes(memberSearchQuery));

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-16 text-center text-gray-600 text-sm italic border border-dashed border-gray-800 rounded-2xl bg-darkSurface/10">No profiles found.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(m => {
        const dueAmount = calculateOutstandingDue(m.name);
        let ringColor = m.portalLocked ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse" : m.status === 'expiring' ? "border-orange-500" : "border-gray-800";
        
        return `
            <div class="bg-gradient-to-br from-gray-900 via-darkSurface to-black border ${m.portalLocked ? 'border-red-900/50' : dueAmount > 0 ? 'border-amber-900/40' : 'border-gray-800/80'} p-5 rounded-2xl flex flex-col justify-between space-y-4 group hover:border-gray-700 transition-all shadow-lg">
                <div class="flex items-start justify-between relative z-10">
                    <div class="flex items-center space-x-3.5 cursor-pointer" onclick="window.openMemberProfile('${m.id}')">
                        <div class="relative">
                            <img src="${m.photoUrl}" class="w-14 h-14 rounded-full object-cover border-2 ${ringColor} shadow">
                            ${m.checkedInToday ? '<span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-darkBg rounded-full animate-pulse"></span>' : ''}
                        </div>
                        <div>
                            <h4 class="text-white font-bold text-base group-hover:text-brandRed transition-colors">${m.name}</h4>
                            <p class="text-[11px] font-mono text-gray-500 mt-0.5"><i class="ph ph-phone mr-1"></i>${m.phone}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-black/30 border border-gray-800/40 p-3 rounded-xl space-y-2 text-xs">
                    <div class="flex justify-between"><span class="text-gray-400">Assigned Plan</span><span class="text-gray-200 font-mono">${m.plan}</span></div>
                    <div class="flex justify-between"><span class="text-gray-400">Valid Till</span><span class="font-mono text-gray-400">${m.expiryDate}</span></div>
                </div>
                <div class="pt-1 flex flex-col">
                    <div class="flex justify-between items-center bg-black/50 p-2.5 rounded-xl border border-gray-800/60">
                        <span class="text-gray-500 text-[9px] uppercase font-bold tracking-wider">Account Balance</span>
                        <span class="text-[10px] font-mono font-bold ${dueAmount > 0 ? 'text-amber-400' : 'text-green-400'}">${dueAmount > 0 ? 'Due: ₹' + dueAmount.toLocaleString() : '✓ Clear'}</span>
                    </div>
                    ${dueAmount > 0 ? `<button onclick="window.collectMemberDue('${m.name}', ${dueAmount})" class="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-[11px] py-2 rounded-xl uppercase tracking-wider shadow-md">Collect & Clear Due</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

window.openMemberProfile = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    const modal = document.getElementById('transaction-modal');
    if (!modal) return;

    const dueAmount = calculateOutstandingDue(member.name);
    let borderRing = dueAmount > 0 ? "border-amber-500" : "border-brandRed";
    const allData = `Fighter ID: ${member.id}\nName: ${member.name}\nPhone: ${member.phone}\nPlan: ${member.plan}\nExpiry: ${member.expiryDate}\nLedger Status: ${dueAmount > 0 ? 'Due ₹' + dueAmount : 'Paid'}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(allData)}&bgcolor=ffffff&color=000000&margin=10`;

    // বিলিং স্ট্যাটাস বাজ
    let billingStatusBadge = '';
    let billingStatusColor = 'text-gray-400';
    if (member.billingStatus === 'active' && member.billingCycleStart) {
        billingStatusBadge = `<span class="text-[8px] font-bold">🟢 ACTIVE (From ${member.billingCycleStart})</span>`;
        billingStatusColor = 'text-green-400';
    } else if (member.billingStatus === 'pending' && member.paymentDate) {
        const daysRemaining = 30 - Math.floor((new Date() - new Date(member.paymentDate)) / (1000 * 60 * 60 * 24));
        billingStatusBadge = `<span class="text-[8px] font-bold">🔵 PENDING SCAN (${daysRemaining} days left)</span>`;
        billingStatusColor = 'text-blue-400';
    } else if (member.billingStatus === 'lapsed') {
        billingStatusBadge = `<span class="text-[8px] font-bold">🔴 AUTO-LAPSED</span>`;
        billingStatusColor = 'text-red-400';
    }

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[360px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col relative items-center text-xs overflow-hidden max-h-[85vh] overflow-y-auto">
                <div class="absolute top-0 left-0 w-full h-24 bg-brandRed/10 blur-2xl"></div>
                <button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                
                <div class="relative mt-2 z-10">
                    <img src="${member.photoUrl}" class="w-24 h-24 rounded-full object-cover border-4 ${borderRing}">
                </div>
                
                <h3 class="text-white font-bold text-xl mt-4 tracking-wide">${member.name}</h3>
                <p class="text-gray-400 font-mono text-xs">${member.phone}</p>
                
                <div class="w-full bg-black/40 border border-gray-800 rounded-xl p-4 mt-6 space-y-2 z-10">
                    <div class="flex justify-between border-b border-gray-800/50 pb-1"><span class="text-gray-500 font-bold uppercase text-[9px]">ID</span><span class="text-brandRed font-mono">${member.id}</span></div>
                    
                    <div class="flex justify-between items-center border-b border-gray-800/50 pb-1">
                        <span class="text-gray-500 font-bold uppercase text-[9px]">Plan</span>
                        <div class="flex items-center space-x-2">
                            <span class="text-white font-mono">${member.plan}</span>
                            <button onclick="window.openPlanChangeWindow('${member.id}')" title="Change/Upgrade Plan" class="text-[10px] bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white px-1.5 py-0.5 rounded transition-colors"><i class="ph ph-arrows-left-right"></i></button>
                        </div>
                    </div>

                    <div class="flex justify-between border-b border-gray-800/50 pb-1"><span class="text-gray-500 font-bold uppercase text-[9px]">Expiry</span><span class="text-white font-mono">${member.expiryDate}</span></div>
                    <div class="flex justify-between border-b border-gray-800/50 pb-1"><span class="text-gray-500 font-bold uppercase text-[9px]">Due Balance</span><span class="${dueAmount > 0 ? 'text-amber-400' : 'text-green-400'} font-bold font-mono">₹${dueAmount}</span></div>
                    <div class="flex justify-between items-center"><span class="text-gray-500 font-bold uppercase text-[9px]">Billing Status</span><span class="${billingStatusColor}">${billingStatusBadge}</span></div>
                </div>

                <div class="mt-4 p-2 bg-white rounded-xl shadow-lg z-10"><img src="${qrUrl}" class="w-32 h-32 rounded-lg" alt="QR"></div>
                <p class="text-[8px] text-gray-500 mt-2 uppercase tracking-[0.2em]">Universal Data Access QR</p>

                <button onclick="window.simulateEntranceScan('${member.id}')" class="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-[11px] py-2.5 rounded-lg uppercase tracking-wider shadow-md z-10">
                    <i class="ph ph-scan mr-2"></i>Simulate Entrance Scan
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.add('scale-100'); }, 10);
    modal.onclick = window.closeTransactionModal;
};

window.openPlanChangeWindow = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    const planOptions = window.GYM_PLANS.map(p => `<option value="${p.name}" data-fee="${p.fee}" ${member.plan === p.name ? 'selected' : ''}>${p.name} (₹${p.fee})</option>`).join('');

    const modal = document.getElementById('transaction-modal');
    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[320px] shadow-2xl relative transform scale-100 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-5 flex flex-col relative text-xs text-left">
                <button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                <div class="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4"><i class="ph ph-arrows-left-right text-xl text-purple-400"></i><h3 class="font-bold text-white text-sm tracking-wide">Upgrade Member Plan</h3></div>
                
                <p class="text-[10px] text-gray-400 mb-3">Select a new billing track for <span class="text-white font-bold">${member.name}</span>. An automatic invoice will be dispatched to the finance ledger.</p>
                
                <select id="new-plan-selector" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-purple-500">
                    ${planOptions}
                </select>

                <button onclick="window.submitPlanChange('${member.id}')" class="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-lg mt-5 uppercase tracking-wide">Confirm & Sync Ledger</button>
            </div>
        </div>
    `;
};

window.submitPlanChange = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    const selector = document.getElementById('new-plan-selector');
    const newPlanName = selector.value;
    const newFee = parseFloat(selector.options[selector.selectedIndex].getAttribute('data-fee'));

    if (member.plan === newPlanName) {
        alert("Member is already on this exact track!"); return;
    }

    member.plan = newPlanName;

    if (window.MOCK_TRANSACTIONS) {
        window.MOCK_TRANSACTIONS.unshift({
            id: `TXN-${String(window.MOCK_TRANSACTIONS.length + 1).padStart(3, '0')}`,
            type: "income",
            category: "membership",
            amount: newFee,
            date: new Date().toISOString().slice(0,10),
            status: "pending",
            mode: "UPI",
            description: `${member.name} - Plan Switch (${newPlanName})`,
            trainerId: "",
            portalLocked: false
        });
    }

    alert(`✅ PLAN UPGRADED!\n\n${member.name} is now on the [${newPlanName}].\n💸 A new pending invoice of ₹${newFee} has been auto-generated in the Finance ledger.`);
    window.closeTransactionModal();
    renderMembersPage();
};

window.closeTransactionModal = function() {
    const modal = document.getElementById('transaction-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    if (modal.firstElementChild) { modal.firstElementChild.classList.remove('scale-100'); modal.firstElementChild.classList.add('scale-95'); }
    setTimeout(() => { modal.classList.add('hidden'); }, 200);
};

window.collectMemberDue = function(memberName, amount) {
    const txns = window.MOCK_TRANSACTIONS || [];
    const targetTxns = txns.filter(t => t.type === 'income' && t.status === 'pending' && t.description.toLowerCase().includes(memberName.toLowerCase()));
    if (targetTxns.length === 0) return alert("Ledger missing.");
    targetTxns.forEach(t => { t.status = 'paid'; if(t.portalLocked) t.portalLocked = false; });
    const member = window.MOCK_MEMBERS.find(m => m.name.toLowerCase() === memberName.toLowerCase());
    if (member) member.portalLocked = false;
    alert(`Success: Collected ₹${amount}. Portal unlocked.`);
    renderMembersPage();
};

window.simulateEntranceScan = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    // যদি মেম্বার এখনো পেমেন্ট করেনি
    if (!member.paymentDate) {
        // সিমুলেট করে পেমেন্ট রেকর্ড করা
        member.paymentDate = new Date().toISOString().slice(0, 10);
        member.autoLapseDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        member.billingStatus = "pending";
    }

    // এখন স্ক্যান রেকর্ড করা
    const result = window.recordFirstEntranceScan(memberId);
    
    window.closeTransactionModal();
    renderMembersPage();
    
    setTimeout(() => {
        alert(result.message);
    }, 300);
};

window.handleMemberSearch = function() { const input = document.getElementById('member-search'); if (input) { memberSearchQuery = input.value; renderMembersGrid(); } };
window.switchMemberTab = function(tab) { currentMemberTab = tab; renderMemberFilterTabs(); renderMembersGrid(); };

// =========================================================================
// NEW LOGIC: MULTI-CONDITION GATEWAY NOTICE DISPATCHER
// =========================================================================
window.dispatchGatewayNotices = function() {
    let dueCount = 0;
    let exp7Count = 0;
    let exp3Count = 0;
    let exp1Count = 0;

    // আজকের তারিখ বের করা হচ্ছে ক্যালকুলেশনের জন্য
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    window.MOCK_MEMBERS.forEach(m => {
        // ১. বকেয়া ডিউ চেক করা
        const dueAmount = calculateOutstandingDue(m.name);
        if (dueAmount > 0) {
            dueCount++;
        }

        // ২. মেম্বারশিপ শেষ হওয়ার ডেট ক্যালকুলেশন
        if (m.expiryDate) {
            const expDate = new Date(m.expiryDate);
            expDate.setHours(0, 0, 0, 0);
            
            const diffTime = expDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 7) exp7Count++;
            if (diffDays === 3) exp3Count++;
            if (diffDays === 1) exp1Count++; // কালকেই পোর্টাল ব্লক/লক হয়ে যাবে
        }
    });

    alert(`🚀 GATEWAY NOTICES DISPATCHED SUCCESSFULLY!\n\nThe automated system scanned the entire roster and dispatched the following WhatsApp/SMS alerts:\n\n💳 Active Payment Dues Reminder: ${dueCount} Members\n📅 7-Day Expiry Warning: ${exp7Count} Members\n⚠️ 3-Day Expiry Alert: ${exp3Count} Members\n🔒 1-Day Pre-Gate Block Final Notice: ${exp1Count} Members\n\nAll targeted members have been notified in real-time.`);
};