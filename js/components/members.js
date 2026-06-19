// =========================================================================
// js/components/members.js — PREMIUM ROSTER WITH FIRST-SCAN BILLING ENGINE
// =========================================================================

let memberSearchQuery = '';
let currentMemberTab = 'all'; 

if (!window.GYM_PLANS) {
    window.GYM_PLANS = [{ id: "PLN-1", name: "Monthly Regular Track", fee: 1500 }, { id: "PLN-2", name: "Fighter Premium Track", fee: 2500 }];
}

// NEW LOGIC: ডাটাবেসে registrationDate এবং expiryDate-এর নতুন ডাইনামিক স্ট্যাটাস অ্যাড করা হলো
if (!window.MOCK_MEMBERS) {
    window.MOCK_MEMBERS = [
        { id: "m-001", name: "Subham Das", phone: "+91 98300 11223", plan: "Monthly Regular Track", expiryDate: "2026-07-12", status: "active", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", checkedInToday: true, lastCheckIn: "2026-06-17 08:30 AM", registrationDate: "2026-05-10" },
        // Joydeep: পেমেন্ট বাকি আছে, তাই Pending First Scan অবস্থায় লক হয়ে আছে।
        { id: "m-002", name: "Joydeep Pal", phone: "+91 91632 55443", plan: "Fighter Premium Track", expiryDate: "Pending First Scan", status: "inactive", photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", checkedInToday: false, portalLocked: true, registrationDate: "2026-06-15" },
        { id: "m-003", name: "Sourav Ganguly", phone: "+91 98311 99887", plan: "PT Combo Track", expiryDate: "2026-06-22", status: "expiring", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", checkedInToday: true, lastCheckIn: "2026-06-17 07:15 AM", registrationDate: "2026-05-22" },
        // Anirban: ৪৫ দিন আগে পেমেন্ট করেছিল কিন্তু স্ক্যান করেনি। সিস্টেম একে অটো-ল্যাপস করে দেবে।
        { id: "m-004", name: "Anirban Das", phone: "+91 97482 33445", plan: "Elite Annual Pack", expiryDate: "Pending First Scan", status: "inactive", photoUrl: "https://images.unsplash.com/photo-1620122303020-43ec4b6cf7f8?w=150", checkedInToday: false, portalLocked: false, registrationDate: "2026-05-01" }
    ];
}

// NEW LOGIC: পেজ লোড হওয়ার সাথে সাথে ৩০ দিনের অটো-ল্যাপস চেক করবে
function checkAndApplyLapseLogic() {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    window.MOCK_MEMBERS.forEach(m => {
        if (m.expiryDate === "Pending First Scan" && m.registrationDate) {
            const regDate = new Date(m.registrationDate);
            const diffTime = Math.abs(today - regDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // যদি পেমেন্ট ডেট থেকে ৩০ দিন পার হয়ে যায় এবং স্ক্যান না করে থাকে
            if (diffDays > 30) {
                m.status = "lapsed";
                m.expiryDate = "Lapsed (No-Show)";
                m.portalLocked = true; // সিকিউরিটি লক
            }
        }
    });
}

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
                    
                    <button onclick="navigateTo('registration')" class="bg-brandRed hover:bg-red-700 px-4 py-2.5 rounded-lg text-white font-bold text-xs flex items-center shadow-lg transition-all">
                        <i class="ph ph-plus-circle mr-1.5 text-base"></i> Add New Member
                    </button>

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
    checkAndApplyLapseLogic(); // গ্রিড রেন্ডার হওয়ার আগে ল্যাপস চেক ইঞ্জিন রান করবে
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
        
        let ringColor = "border-gray-800";
        if (m.status === 'lapsed') ringColor = "border-gray-700 opacity-60 grayscale";
        else if (m.portalLocked) ringColor = "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse";
        else if (m.status === 'expiring') ringColor = "border-orange-500";
        else if (m.expiryDate === "Pending First Scan") ringColor = "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]";
        
        return `
            <div class="bg-gradient-to-br from-gray-900 via-darkSurface to-black border ${m.status === 'lapsed' ? 'border-gray-800 opacity-70' : m.portalLocked ? 'border-red-900/50' : dueAmount > 0 ? 'border-amber-900/40' : 'border-gray-800/80'} p-5 rounded-2xl flex flex-col justify-between space-y-4 group hover:border-gray-700 transition-all shadow-lg">
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
                    <div class="flex justify-between"><span class="text-gray-400">Valid Till</span><span class="font-mono ${m.status === 'lapsed' ? 'text-red-500 font-bold' : m.expiryDate === 'Pending First Scan' ? 'text-blue-400 font-bold' : 'text-gray-400'}">${m.expiryDate}</span></div>
                </div>
                <div class="pt-1 flex flex-col">
                    <div class="flex justify-between items-center bg-black/50 p-2.5 rounded-xl border border-gray-800/60">
                        <span class="text-gray-500 text-[9px] uppercase font-bold tracking-wider">Account Balance</span>
                        <span class="text-[10px] font-mono font-bold ${m.status === 'lapsed' ? 'text-red-500' : dueAmount > 0 ? 'text-amber-400' : 'text-green-400'}">${m.status === 'lapsed' ? 'Account Lapsed' : dueAmount > 0 ? 'Due: ₹' + dueAmount.toLocaleString() : '✓ Clear'}</span>
                    </div>
                    ${dueAmount > 0 && m.status !== 'lapsed' ? `<button onclick="window.collectMemberDue('${m.name}', ${dueAmount})" class="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-[11px] py-2 rounded-xl uppercase tracking-wider shadow-md">Collect & Clear Due</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}
// NEW LOGIC: The First Scan Engine Core Function
window.simulateMemberScan = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    
    // ১. চেক করুন মেম্বার পাওয়া যাচ্ছে কি না
    if (!member) {
        alert("Member not found in database!");
        return;
    }

    // ২. বর্তমান সময় ও তারিখ
    const todayStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // ৩. স্ট্যাটাস আপডেট লজিক
    member.checkedInToday = true; // এটিই মেইন ফ্ল্যাগ যা গ্রিডে সবুজ বাতি জ্বালাবে
    member.lastCheckIn = `${todayStr} ${timeStr}`;

    // ৪. যদি Pending First Scan হয়, তবেই অ্যাক্টিভ করুন
    if (member.expiryDate === "Pending First Scan") {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        member.expiryDate = expiry.toISOString().slice(0, 10);
        member.status = "active";
    }

    // ৫. ডাটা আপডেট হওয়ার পর ইন্টারফেস রিফ্রেশ করা
    alert(`✅ Scan Successful for ${member.name} at ${timeStr}`);
    
    window.closeTransactionModal();
    renderMembersPage(); // এই লাইনটি অত্যন্ত গুরুত্বপূর্ণ, এটি গ্রিড রিফ্রেশ করে
    localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
};
window.simulateMemberScan = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) {
        alert("Member not found!");
        return;
    }

    const todayStr = new Date().toISOString().slice(0,10);
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // ১. এক্সপ্লিকিটলি প্রপার্টি সেট করা (যাতে মিসিং না থাকে)
    member.checkedInToday = true;
    member.lastCheckIn = `${todayStr} ${timeStr}`;

    // ২. যদি প্রথমবার স্ক্যান হয়, তবে স্ট্যাটাস চেঞ্জ
    if (member.expiryDate === "Pending First Scan" || member.status === 'inactive') {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        member.expiryDate = expiry.toISOString().slice(0,10);
        member.status = "active";
    }

    // ৩. গ্রিড রিফ্রেশ
    alert(`✅ Scan Successful for ${member.name}!`);
    window.closeTransactionModal();
    renderMembersPage(); 
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
    
    // NEW LOGIC: আনলক হওয়ার পর এক্সপায়ারি ডেট Pending First Scan এ যাবে (যদি অলরেডি ডেট না থাকে)
    if (member) {
        member.portalLocked = false;
        if (!member.expiryDate || member.expiryDate === "Lapsed (No-Show)") {
            member.expiryDate = "Pending First Scan";
            member.status = "inactive";
        }
    }
    alert(`Success: Collected ₹${amount}. Portal unlocked.`);
    renderMembersPage();
};

window.handleMemberSearch = function() { const input = document.getElementById('member-search'); if (input) { memberSearchQuery = input.value; renderMembersGrid(); } };
window.switchMemberTab = function(tab) { currentMemberTab = tab; renderMemberFilterTabs(); renderMembersGrid(); };

window.dispatchGatewayNotices = function() {
    let dueCount = 0; let exp7Count = 0; let exp3Count = 0; let exp1Count = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);

    window.MOCK_MEMBERS.forEach(m => {
        const dueAmount = calculateOutstandingDue(m.name);
        if (dueAmount > 0) dueCount++;

        if (m.expiryDate && m.expiryDate !== "Pending First Scan" && m.expiryDate !== "Lapsed (No-Show)") {
            const expDate = new Date(m.expiryDate);
            expDate.setHours(0, 0, 0, 0);
            const diffTime = expDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 7) exp7Count++;
            if (diffDays === 3) exp3Count++;
            if (diffDays === 1) exp1Count++; 
        }
    });

    alert(`🚀 GATEWAY NOTICES DISPATCHED SUCCESSFULLY!\n\nThe automated system scanned the entire roster and dispatched the following alerts:\n\n💳 Active Payment Dues Reminder: ${dueCount} Members\n📅 7-Day Expiry Warning: ${exp7Count} Members\n⚠️ 3-Day Expiry Alert: ${exp3Count} Members\n🔒 1-Day Pre-Gate Block Final Notice: ${exp1Count} Members`);
};

// =========================================================================
// MEMBER DETAILS MODAL & DYNAMIC TRAINER ASSIGNMENT
// =========================================================================
window.openMemberProfile = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    const modal = document.getElementById('transaction-modal');
    if (!modal) return;

    const dueAmount = calculateOutstandingDue(member.name);
    let borderRing = dueAmount > 0 ? "border-amber-500 animate-pulse" : "border-brandRed";
    if (member.status === 'lapsed') borderRing = "border-gray-700 grayscale";

    const allData = `Fighter ID: ${member.id}\nName: ${member.name}\nPhone: ${member.phone}\nPlan: ${member.plan}\nExpiry: ${member.expiryDate}\nLedger Status: ${dueAmount > 0 ? 'Due ₹' + dueAmount : 'Paid'}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(allData)}&bgcolor=ffffff&color=000000&margin=10`;

    // Trainer dropdown creation
    const trainers = window.MOCK_TRAINERS || [];
    const trainerOptions = trainers.map(t => {
        const isSelected = t.id === member.trainerId ? 'selected' : '';
        return `<option value="${t.id}" ${isSelected}>${t.name}</option>`;
    }).join('');
    const noTrainerSelected = !member.trainerId ? 'selected' : '';

    const trainerSelectDropdown = `
        <select onchange="window.assignTrainerToMember('${member.id}', this.value)" class="bg-black/60 border border-gray-800 text-gray-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-brandRed font-medium transition-colors cursor-pointer w-36">
            <option value="" ${noTrainerSelected}>No PT Assigned</option>
            ${trainerOptions}
        </select>
    `;

    let scanActionBtn = '';
    if (member.status === 'lapsed') {
        scanActionBtn = `<button disabled class="w-full bg-red-950/50 text-red-500 text-[11px] font-extrabold py-2 rounded-xl mt-4 border border-red-900/50 cursor-not-allowed uppercase tracking-wider">Account Lapsed (No-Show)</button>`;
    } else if (member.portalLocked) {
        scanActionBtn = `<button disabled class="w-full bg-gray-800 text-gray-500 text-[11px] font-bold py-2 rounded-xl mt-4 cursor-not-allowed uppercase tracking-wider">Clear Dues to Enable Scan</button>`;
    } else {
        scanActionBtn = `<button onclick="window.simulateMemberScan('${member.id}')" class="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold py-2.5 rounded-xl mt-4 shadow-lg uppercase tracking-wider flex justify-center items-center transition-colors"><i class="ph ph-scan text-sm mr-1.5 animate-pulse"></i> Simulate Entrance Scan</button>`;
    }

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[350px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col relative items-center text-xs overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-24 bg-brandRed/10 blur-2xl"></div>
                <button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                
                <div class="relative mt-2 z-10">
                    <img src="${member.photoUrl}" class="w-24 h-24 rounded-full object-cover border-4 ${borderRing}">
                </div>
                
                <h3 class="text-white font-bold text-lg mt-4 tracking-wide">${member.name}</h3>
                <p class="text-gray-400 font-mono text-xs">${member.phone}</p>
                
                <div class="w-full bg-black/40 border border-gray-800 rounded-xl p-4 mt-6 space-y-2.5 z-10 text-left">
                    <div class="flex justify-between items-center border-b border-gray-800/50 pb-1.5">
                        <span class="text-gray-500 font-bold uppercase text-[9px]">Fighter ID</span>
                        <span class="text-brandRed font-mono font-bold">${member.id.toUpperCase()}</span>
                    </div>
                    
                    <div class="flex justify-between items-center border-b border-gray-800/50 pb-1.5">
                        <span class="text-gray-500 font-bold uppercase text-[9px]">Plan</span>
                        <div class="flex items-center space-x-1.5">
                            <span class="text-white font-mono">${member.plan}</span>
                            <button onclick="window.openPlanChangeWindow('${member.id}')" title="Upgrade Plan" class="text-[10px] bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white px-1.5 py-0.5 rounded transition-colors"><i class="ph ph-arrows-left-right"></i></button>
                        </div>
                    </div>

                    <div class="flex justify-between items-center border-b border-gray-800/50 pb-1.5">
                        <span class="text-gray-500 font-bold uppercase text-[9px]">Personal Trainer</span>
                        ${trainerSelectDropdown}
                    </div>

                    <div class="flex justify-between items-center border-b border-gray-800/50 pb-1.5">
                        <span class="text-gray-500 font-bold uppercase text-[9px]">Expiry</span>
                        <span class="${member.status === 'lapsed' ? 'text-red-500 font-bold' : member.expiryDate === 'Pending First Scan' ? 'text-blue-400 font-bold animate-pulse' : 'text-white'} font-mono">${member.expiryDate}</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500 font-bold uppercase text-[9px]">Due Balance</span>
                        <span class="${dueAmount > 0 ? 'text-amber-400' : 'text-green-400'} font-bold font-mono">₹${dueAmount.toLocaleString()}</span>
                    </div>
                </div>

                ${scanActionBtn}

                <div class="mt-6 p-2 bg-white rounded-xl shadow-lg z-10"><img src="${qrUrl}" class="w-32 h-32 rounded-lg" alt="QR"></div>
                <p class="text-[8px] text-gray-500 mt-2 uppercase tracking-[0.2em]">Universal Data Access QR</p>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.add('scale-100'); }, 10);
    modal.onclick = window.closeTransactionModal;
};

window.assignTrainerToMember = function(memberId, selectedTrainerId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    member.trainerId = selectedTrainerId;

    let successMessage = `Success! ${member.name} has been unassigned from personal training.`;
    if (selectedTrainerId) {
        const trainer = window.MOCK_TRAINERS.find(t => t.id === selectedTrainerId);
        successMessage = `Authorized! ${member.name} has been successfully assigned to coach ${trainer ? trainer.name : 'Trainer'}.`;
    }

    alert(successMessage);
    renderMembersPage();
    window.openMemberProfile(memberId);
};