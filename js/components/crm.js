// =========================================================================
// js/components/crm.js — ADVANCED CRM WITH DYNAMIC REFERRAL ENGINE
// =========================================================================

let currentCRMTab = 'all'; 
let crmSearchQuery = '';

// ১. ডাইনামিক রেফারেল অফার কনফিগারেশন (Global State)
if (!window.REFERRAL_OFFER) {
    window.REFERRAL_OFFER = {
        isActive: true,
        referrerReward: 500, // যে মেম্বার রেফার করবে তার রিওয়ার্ড (Wallet Credit)
        refereeDiscount: 500 // নতুন যে লিড আসবে তার জয়েনিং ডিসকাউন্ট
    };
}

// ২. সেন্ট্রালাইজড গ্লোবাল লিডস ডাটাবেস (Referred By ফিল্ড যুক্ত করা হলো)
if (!window.MOCK_LEADS) {
    window.MOCK_LEADS = [
        { id: "LED-101", name: "Anupam Sarkar", phone: "+91 98321 44552", source: "Facebook Ads", status: "new", date: "2026-06-12", notes: "Interested in MMA Fighter Track. Wants evening slots." },
        { id: "LED-102", name: "Subhadip Dutta", phone: "+91 91632 77881", source: "Walk-in", status: "trial", date: "2026-06-13", notes: "Scheduled Free Boxing Trial for tomorrow morning." },
        { id: "LED-103", name: "Priya Roy", phone: "+91 98300 11223", source: "Member Referral", status: "new", date: "2026-06-15", notes: "Wants to join with her friend.", referredBy: "m-8899", referrerName: "Rohan Karmakar" },
        { id: "LED-104", name: "Debasmita Sen", phone: "+91 89021 55664", source: "Instagram", status: "lost", date: "2026-06-05", notes: "Distance issue. Gym is too far from her location." }
    ];
}

// ৩. সিআরএম পেজের কোর লেআউট
function getCRMView() {
    return `
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-darkSurface border border-gray-800 p-4 rounded-xl">
                <div>
                    <h3 class="text-white font-semibold">Leads & CRM Pipeline</h3>
                    <p class="text-xs text-gray-500">Manage enquiries, sales conversions and dynamic referral rewards.</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="window.openReferralConfigModal()" class="border border-amber-500/30 hover:border-amber-500 bg-amber-950/20 hover:bg-amber-900 text-amber-400 text-xs font-bold px-3 py-2.5 rounded-lg transition-all flex items-center space-x-1.5 shadow">
                        <i class="ph ph-gift"></i><span>Referral Offer Config</span>
                    </button>
                    <button onclick="window.simulateMemberReferral()" class="border border-gray-800 hover:border-gray-700 bg-black/40 hover:bg-black text-gray-400 hover:text-white text-xs font-bold px-3 py-2.5 rounded-lg transition-all flex items-center space-x-1.5 shadow">
                        <i class="ph ph-share-network"></i><span>Simulate Member Referral</span>
                    </button>
                    <button onclick="window.openLeadModal()" class="bg-brandRed hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow">
                        <i class="ph ph-plus-circle text-base"></i><span>Add New Lead</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="crm-metrics-cards"></div>

            <div class="space-y-4">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-darkSurface border border-gray-800 p-4 rounded-xl">
                    <div class="relative flex-1 max-w-md">
                        <i class="ph ph-magnifying-glass absolute left-3 top-3.5 text-gray-500 text-lg"></i>
                        <input type="text" id="crm-search" oninput="window.handleCRMSearch()" placeholder="Search leads by name or phone..." class="w-full bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-brandRed transition-colors">
                    </div>
                    <div class="flex bg-black/40 p-1 rounded-lg border border-gray-800" id="crm-filter-tabs"></div>
                </div>

                <div class="bg-darkSurface border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-400">
                            <thead class="text-xs uppercase bg-black/30 text-gray-500 border-b border-gray-800">
                                <tr>
                                    <th class="py-3.5 px-6">Lead ID</th>
                                    <th class="py-3.5 px-6">Lead Details</th>
                                    <th class="py-3.5 px-6">Source / Referral</th>
                                    <th class="py-3.5 px-6">Enquiry Date</th>
                                    <th class="py-3.5 px-6">Pipeline Status</th>
                                    <th class="py-3.5 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-800/50" id="crm-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="transaction-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"></div>
        </div>
    `;
}

function renderCRMPage() {
    renderCRMMetrics();
    renderLeadFilterTabs();
    renderLeadTable();
}

function renderCRMMetrics() {
    const container = document.getElementById('crm-metrics-cards');
    if (!container) return;

    const leads = window.MOCK_LEADS;
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const activeTrials = leads.filter(l => l.status === 'trial').length;
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    container.innerHTML = `
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-xl">
            <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Total Captured Leads</p>
            <h4 class="text-lg font-bold text-white mt-1">${totalLeads} <span class="text-xs text-gray-500 font-normal">Enquiries</span></h4>
        </div>
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-xl border-l-2 border-l-blue-500">
            <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider">New Cold Leads</p>
            <h4 class="text-lg font-bold text-blue-400 mt-1">${newLeads} <span class="text-xs text-gray-500 font-normal">Call Pending</span></h4>
        </div>
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-xl border-l-2 border-l-amber-500">
            <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Active Free Trials</p>
            <h4 class="text-lg font-bold text-amber-400 mt-1">${activeTrials} <span class="text-xs text-gray-500 font-normal">Scheduled</span></h4>
        </div>
        <div class="bg-darkSurface border border-gray-800 p-4 rounded-xl border-l-2 border-l-green-500">
            <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Sales Win Rate</p>
            <h4 class="text-lg font-bold text-green-400 mt-1">${conversionRate}% <span class="text-xs text-gray-500 font-normal">(${convertedLeads} Converted)</span></h4>
        </div>
    `;
}

function renderLeadFilterTabs() {
    const container = document.getElementById('crm-filter-tabs');
    if (!container) return;
    const tabs = [ { id: 'all', label: 'All Leads' }, { id: 'new', label: 'New Cold' }, { id: 'trial', label: 'Trial Runs' }, { id: 'converted', label: 'Converted' }, { id: 'lost', label: 'Dropped' } ];
    container.innerHTML = tabs.map(t => `<button onclick="window.switchCRMTab('${t.id}')" class="px-3 py-1.5 rounded-md transition-all uppercase tracking-wide text-[10px] ${currentCRMTab === t.id ? 'bg-brandRed text-white shadow' : 'text-gray-400 hover:text-white'}">${t.label}</button>`).join('');
}

function renderLeadTable() {
    const tbody = document.getElementById('crm-table-body');
    if (!tbody) return;

    let filtered = window.MOCK_LEADS || [];
    if (currentCRMTab !== 'all') filtered = filtered.filter(l => l.status === currentCRMTab);
    if (crmSearchQuery) filtered = filtered.filter(l => l.name.toLowerCase().includes(crmSearchQuery.toLowerCase()) || l.phone.includes(crmSearchQuery));

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-600">No leads found in this pipeline segment.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(l => {
        let statusClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
        if (l.status === 'trial') statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
        if (l.status === 'converted') statusClass = "bg-green-500/10 text-green-400 border-green-500/20";
        if (l.status === 'lost') statusClass = "bg-red-500/10 text-brandRed border-red-500/20";

        // রেফারেল ব্যাজ লজিক
        const referralBadge = l.referredBy 
            ? `<div class="mt-1.5 inline-flex items-center space-x-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded tracking-wide uppercase"><i class="ph ph-gift"></i><span>Ref By: ${l.referrerName}</span></div>` 
            : '';

        return `
            <tr class="hover:bg-white/[0.02] transition-colors text-xs">
                <td class="py-3.5 px-6 font-mono text-gray-500">${l.id}</td>
                <td class="py-3.5 px-6">
                    <div class="text-white font-semibold text-sm">${l.name}</div>
                    <div class="text-gray-500 font-mono text-[11px] mt-0.5">${l.phone}</div>
                    <p class="text-gray-400 text-[11px] font-sans mt-1 bg-black/20 p-1.5 rounded border border-gray-800/40 max-w-xs">${l.notes}</p>
                </td>
                <td class="py-3.5 px-6">
                    <span class="bg-gray-800 px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 uppercase font-medium">${l.source}</span>
                    <br>${referralBadge}
                </td>
                <td class="py-3.5 px-6 font-mono text-gray-500">${l.date}</td>
                <td class="py-3.5 px-6">
                    <select onchange="window.changeLeadStatus('${l.id}', this.value)" class="bg-black/40 border border-gray-800 rounded px-2 py-1 text-[11px] font-bold uppercase ${statusClass} focus:outline-none cursor-pointer">
                        <option value="new" ${l.status === 'new' ? 'selected' : ''}>New Cold</option>
                        <option value="trial" ${l.status === 'trial' ? 'selected' : ''}>Trial Scheduled</option>
                        <option value="converted" ${l.status === 'converted' ? 'selected' : ''}>Converted</option>
                        <option value="lost" ${l.status === 'lost' ? 'selected' : ''}>Dropped/Lost</option>
                    </select>
                </td>
                <td class="py-3.5 px-6 text-center">
                    <div class="flex items-center justify-center space-x-2">
                        <button onclick="window.sendLeadWhatsApp('${l.id}')" class="bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-black border border-green-500/20 px-2.5 py-1.5 rounded text-[11px] font-bold transition-all flex items-center space-x-1" title="Send WhatsApp Pitch"><i class="ph ph-whatsapp-logo text-sm"></i><span>Follow Up</span></button>
                        <button onclick="window.deleteLead('${l.id}')" class="text-gray-600 hover:text-brandRed p-1 transition-colors"><i class="ph ph-trash text-base"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// =========================================================================
// গ্লোবাল অ্যাক্টিভেশন লজিক্স (WINDOW OMNI BINDING)
// =========================================================================

window.handleCRMSearch = function() {
    const input = document.getElementById('crm-search');
    if (input) { crmSearchQuery = input.value; renderLeadTable(); }
};

window.switchCRMTab = function(tabName) {
    currentCRMTab = tabName; renderLeadFilterTabs(); renderLeadTable();
};

// ১. NEW ERP SYNC: লিড কনভার্সন এবং রেফারেল রিওয়ার্ড অটোমেশন
window.changeLeadStatus = function(leadId, newStatus) {
    const lead = window.MOCK_LEADS.find(l => l.id === leadId);
    if (!lead) return;

    lead.status = newStatus;

    if (newStatus === 'converted') {
        let advanceAmount = window.GYM_FEES ? window.GYM_FEES["advance fee"] : 5000;
        let discountApplied = 0;
        let rewardMessage = "";

        // রেফারেল অফার অ্যাপ্লাই করার লজিক
        if (lead.referredBy && window.REFERRAL_OFFER && window.REFERRAL_OFFER.isActive) {
            discountApplied = window.REFERRAL_OFFER.refereeDiscount;
            advanceAmount -= discountApplied; // নতুন লিডের ফি থেকে ডিসকাউন্ট বাদ

            rewardMessage = `\n\n🎁 REFERRAL APPLIED:\n- ${lead.name} got ₹${discountApplied} Joining Discount!\n- ${lead.referrerName} has been credited ₹${window.REFERRAL_OFFER.referrerReward} in Wallet.`;

            // ফিন্যান্স ড্যাশবোর্ডে রেফারারের জন্য এক্সপেন্স/ওয়ালেট ক্রেডিট এন্ট্রি তৈরি করা
            if (window.MOCK_TRANSACTIONS) {
                window.MOCK_TRANSACTIONS.unshift({
                    id: `TXN-${String(window.MOCK_TRANSACTIONS.length + 1).padStart(3, '0')}`,
                    type: "expense",
                    category: "marketing",
                    amount: window.REFERRAL_OFFER.referrerReward,
                    date: new Date().toISOString().slice(0,10),
                    status: "paid",
                    mode: "Wallet",
                    description: `Referral Reward Credit - Sent to ${lead.referrerName} for referring ${lead.name}`,
                    trainerId: ""
                });
            }
        }

        // ফিন্যান্স ড্যাশবোর্ডে নতুন লিডের জন্য অ্যাডভান্স ফি ইনভয়েস তৈরি করা
        if (window.MOCK_TRANSACTIONS) {
            const descTag = discountApplied > 0 ? ` (Ref. Discounted)` : ``;
            window.MOCK_TRANSACTIONS.unshift({
                id: `TXN-${String(window.MOCK_TRANSACTIONS.length + 1).padStart(3, '0')}`,
                type: "income",
                category: "advance fee",
                amount: advanceAmount,
                date: new Date().toISOString().slice(0,10),
                status: "pending",
                mode: "UPI",
                description: `Advance Fee (Fighter Gated) - ${lead.name}${descTag}`,
                trainerId: "",
                portalLocked: true
            });
        }

        alert(`🎉 CONVERSION SUCCESS: ${lead.name} marked as CONVERTED!${rewardMessage}\n\n🔒 Gated Member Protection Active.\n💸 Ledger Sync: Advance Fee of ₹${advanceAmount.toLocaleString()} sent to Finance for Admin clearance.`);
    } else {
        alert(`Lead pipeline status updated to ${newStatus.toUpperCase()}.`);
    }
    
    renderCRMPage();
};

window.sendLeadWhatsApp = function(leadId) {
    const lead = window.MOCK_LEADS.find(l => l.id === leadId);
    if (!lead) return;
    alert(`📱 WHATSAPP GATEWAY INJECTION:\nSending official pitch template to ${lead.name} (${lead.phone})...\n\n"Hey ${lead.name}! Thanks for considering R.E.N.E.W Gym. We have a Free Trial slot available for you. Let us know when you'd like to drop by!"`);
};

window.deleteLead = function(leadId) {
    if (confirm(`Are you sure you want to permanently delete lead log ${leadId}?`)) {
        const index = window.MOCK_LEADS.findIndex(l => l.id === leadId);
        if (index !== -1) { window.MOCK_LEADS.splice(index, 1); alert("Lead cleared from CRM."); renderCRMPage(); }
    }
};

// ২. NEW FEATURE: ডাইনামিক রেফারেল অফার কনফিগারেশন মোডাল
window.openReferralConfigModal = function() {
    const modal = document.getElementById('transaction-modal');
    if (!modal) return;

    if (!window.REFERRAL_OFFER) window.REFERRAL_OFFER = { isActive: true, referrerReward: 500, refereeDiscount: 500 };
    const offer = window.REFERRAL_OFFER;

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[360px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-5 flex flex-col relative text-xs">
                <button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                
                <div class="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4">
                    <i class="ph ph-gift text-xl text-amber-400"></i>
                    <h3 class="font-bold text-white text-sm tracking-wide">Configure Referral Program</h3>
                </div>

                <div class="space-y-4 text-left">
                    <div class="flex items-center justify-between bg-black/40 border border-gray-800 p-3 rounded-lg">
                        <span class="text-gray-300 font-bold uppercase tracking-wider text-[10px]">Program Status</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="ref-status" class="sr-only peer" ${offer.isActive ? 'checked' : ''}>
                            <div class="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brandRed"></div>
                        </label>
                    </div>

                    <div>
                        <label class="text-amber-400 text-[10px] uppercase font-bold block mb-1">Old Member Reward (Wallet Credit)</label>
                        <div class="relative">
                            <span class="absolute left-3 top-2 text-gray-600 font-mono">₹</span>
                            <input type="number" id="ref-reward" value="${offer.referrerReward}" class="w-full bg-black/50 border border-gray-800 rounded-lg pl-7 pr-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-amber-400">
                        </div>
                    </div>

                    <div>
                        <label class="text-green-400 text-[10px] uppercase font-bold block mb-1">New Lead Discount (Off Base Fee)</label>
                        <div class="relative">
                            <span class="absolute left-3 top-2 text-gray-600 font-mono">₹</span>
                            <input type="number" id="ref-discount" value="${offer.refereeDiscount}" class="w-full bg-black/50 border border-gray-800 rounded-lg pl-7 pr-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-green-400">
                        </div>
                    </div>
                </div>

                <button onclick="window.submitReferralConfig()" class="w-full bg-amber-500 hover:bg-amber-600 text-black text-xs font-extrabold py-2.5 rounded-lg mt-5 tracking-wide uppercase shadow">Save Offer Engine</button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.add('scale-100'); }, 10);
    modal.onclick = window.closeTransactionModal;
};

window.submitReferralConfig = function() {
    const isActive = document.getElementById('ref-status').checked;
    const reward = parseFloat(document.getElementById('ref-reward').value) || 0;
    const discount = parseFloat(document.getElementById('ref-discount').value) || 0;

    window.REFERRAL_OFFER = { isActive: isActive, referrerReward: reward, refereeDiscount: discount };
    alert("Success! Gym Referral Program parameters updated dynamically.");
    window.closeTransactionModal();
};

// ৩. NEW FEATURE: মেম্বার রেফারেল সিমুলেটর
window.simulateMemberReferral = function() {
    const randomLeads = ["Soumyajit Pal", "Koushik Sen", "Sneha Chakraborty"];
    const name = randomLeads[Math.floor(Math.random() * randomLeads.length)];
    
    const newLead = {
        id: `LED-${window.MOCK_LEADS.length + 101}`,
        name: name,
        phone: "+91 88" + Math.floor(10000000 + Math.random() * 90000000),
        source: "Member Referral",
        status: "new",
        date: new Date().toISOString().slice(0,10),
        notes: "Auto-generated referral from Member Portal.",
        referredBy: "m-1024",
        referrerName: "Anirban Das" // সিমুলেটেড রেফারার
    };

    window.MOCK_LEADS.unshift(newLead);
    alert(`[MEMBER PORTAL SIMULATION]:\nAn existing member (Anirban Das) just generated a new referral lead (${name}).\n\nThe lead has been injected into your New Cold pipeline with a Gift Badge!`);
    renderCRMPage();
};

// Add Lead Modal (Standard Form)
window.openLeadModal = function() {
    const modal = document.getElementById('transaction-modal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[360px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-5 flex flex-col relative text-xs">
                <button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                <div class="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4"><i class="ph ph-funnel text-xl text-brandRed"></i><h3 class="font-bold text-white text-sm tracking-wide">Capture New Enquiry</h3></div>
                <div class="space-y-3 text-left">
                    <div><label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Full Name</label><input type="text" id="lead-form-name" placeholder="e.g. Souvik Sen" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-brandRed"></div>
                    <div><label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">WhatsApp Number</label><input type="text" id="lead-form-phone" placeholder="e.g. +91 98300 XXXXX" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 font-mono"></div>
                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Source</label>
                        <select id="lead-form-source" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none">
                            <option value="Facebook Ads">Facebook Ads</option><option value="Instagram">Instagram</option><option value="Walk-in">Walk-In</option><option value="Google Search">Google Search</option><option value="Website">Website Form</option>
                        </select>
                    </div>
                    <div><label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Notes</label><textarea id="lead-form-notes" rows="3" placeholder="Target weight loss 10kg..." class="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-gray-300 resize-none"></textarea></div>
                </div>
                <button onclick="window.submitNewLead()" class="w-full bg-brandRed hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-lg mt-5 uppercase tracking-wide">Register Lead to Pipeline</button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.add('scale-100'); }, 10);
    modal.onclick = window.closeTransactionModal;
};

window.submitNewLead = function() {
    const name = document.getElementById('lead-form-name').value.trim(); const phone = document.getElementById('lead-form-phone').value.trim();
    const source = document.getElementById('lead-form-source').value; const notes = document.getElementById('lead-form-notes').value.trim();

    if (!name || !phone) { alert("Please enter Client Name and Mobile Number!"); return; }

    window.MOCK_LEADS.unshift({
        id: `LED-${window.MOCK_LEADS.length + 101}`, name: name, phone: phone, source: source, status: "new", date: new Date().toISOString().slice(0,10), notes: notes || "No additional logs."
    });
    
    currentCRMTab = 'all'; const searchInput = document.getElementById('crm-search'); if (searchInput) searchInput.value = '';
    alert(`Success!\n${name} plugged into the CRM.`); window.closeTransactionModal(); renderCRMPage();
};

window.closeTransactionModal = function() {
    const modal = document.getElementById('transaction-modal'); if (!modal) return;
    modal.classList.add('opacity-0'); if (modal.firstElementChild) { modal.firstElementChild.classList.remove('scale-100'); modal.firstElementChild.classList.add('scale-95'); }
    setTimeout(() => { modal.classList.add('hidden'); }, 200);
};