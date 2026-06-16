// =========================================================================
// js/components/crm.js — ADVANCED CRM & LEADS PIPELINE ENGINE
// =========================================================================

// সিআরএম মডিউলের গ্লোবাল স্টেট ফিল্টারস
let currentCRMTab = 'all'; // all, new, trial, converted, lost
let crmSearchQuery = '';

// ১. সেন্ট্রালাইজড গ্লোবাল লিডস ডাটাবেস (Single Source of Truth for Leads)
if (!window.MOCK_LEADS) {
    window.MOCK_LEADS = [
        { id: "LED-101", name: "Anupam Sarkar", phone: "+91 98321 44552", source: "Facebook Ads", status: "new", date: "2026-06-12", notes: "Interested in MMA Fighter Track. Wants evening slots." },
        { id: "LED-102", name: "Subhadip Dutta", phone: "+91 91632 77881", source: "Walk-in", status: "trial", date: "2026-06-13", notes: "Scheduled Free Boxing Trial for tomorrow morning." },
        { id: "LED-103", name: "Rahul Ghosh", phone: "+91 98300 11223", source: "Google Search", status: "converted", date: "2026-06-10", notes: "Converted! Joined annual package and paid advance." },
        { id: "LED-104", name: "Debasmita Sen", phone: "+91 89021 55664", source: "Instagram", status: "lost", date: "2026-06-05", notes: "Distance issue. Gym is too far from her location." },
        { id: "LED-105", name: "Sayan Banerjee", phone: "+91 97482 33445", source: "Website", status: "new", date: "2026-06-15", notes: "Filled form for Weight Loss pack. Call required." }
    ];
}

// ২. সিআরএম পেজের কোর লেআউট টেমপ্লেট
function getCRMView() {
    return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="crm-metrics-cards"></div>

            <div class="space-y-4">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-darkSurface border border-gray-800 p-4 rounded-xl">
                    <div class="relative flex-1 max-w-md">
                        <i class="ph ph-magnifying-glass absolute left-3 top-3.5 text-gray-500 text-lg"></i>
                        <input type="text" id="crm-search" oninput="window.handleCRMSearch()" placeholder="Search leads by name or phone..." class="w-full bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-brandRed transition-colors">
                    </div>
                    
                    <div class="flex flex-wrap items-center gap-3">
                        <div class="flex bg-black/40 p-1 rounded-lg border border-gray-800" id="crm-filter-tabs"></div>
                        <button onclick="window.openLeadModal()" class="bg-brandRed hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow">
                            <i class="ph ph-user-plus text-base"></i>
                            <span>Add New Lead</span>
                        </button>
                    </div>
                </div>

                <div class="bg-darkSurface border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-400">
                            <thead class="text-xs uppercase bg-black/30 text-gray-500 border-b border-gray-800">
                                <tr>
                                    <th class="py-3.5 px-6">Lead ID</th>
                                    <th class="py-3.5 px-6">Lead Details</th>
                                    <th class="py-3.5 px-6">Channel Source</th>
                                    <th class="py-3.5 px-6">Enquiry Date</th>
                                    <th class="py-3.5 px-6">Pipeline Status</th>
                                    <th class="py-3.5 px-6 text-center">Engagement Actions</th>
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

// ৩. সিআরএম পেজ ইনিশিয়েলাইজ করার মাস্টার কন্ট্রোলার
function renderCRMPage() {
    renderCRMMetrics();
    renderLeadFilterTabs();
    renderLeadTable();
}

// ৪. ৪টি কোর সেলস কনভার্সন মেট্রিক্স কার্ডস লজিক
function renderCRMMetrics() {
    const container = document.getElementById('crm-metrics-cards');
    if (!container) return;

    const leads = window.MOCK_LEADS;
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const activeTrials = leads.filter(l => l.status === 'trial').length;
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    
    // কনভার্সন রেট বা উইন রেট পার্সেন্টেজ ক্যালকুলেশন
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

// ৫. সিআরএম পাইপলাইন ফিল্টার ট্যাবস (All, New, Trial, Converted, Lost)
function renderLeadFilterTabs() {
    const container = document.getElementById('crm-filter-tabs');
    if (!container) return;

    const tabs = [
        { id: 'all', label: 'All Leads' },
        { id: 'new', label: 'New Cold' },
        { id: 'trial', label: 'Trial Runs' },
        { id: 'converted', label: 'Converted' },
        { id: 'lost', label: 'Dropped' }
    ];

    container.innerHTML = tabs.map(t => {
        const isActive = currentCRMTab === t.id;
        return `<button onclick="window.switchCRMTab('${t.id}')" class="px-3 py-1.5 rounded-md transition-all uppercase tracking-wide text-[10px] ${isActive ? 'bg-brandRed text-white shadow' : 'text-gray-400 hover:text-white'}">${t.label}</button>`;
    }).join('');
}

// ৬. মাস্টার সিআরএম টেবিল রেন্ডারার
function renderLeadTable() {
    const tbody = document.getElementById('crm-table-body');
    if (!tbody) return;

    let filtered = window.MOCK_LEADS || [];

    if (currentCRMTab !== 'all') {
        filtered = filtered.filter(l => l.status === currentCRMTab);
    }

    if (crmSearchQuery) {
        filtered = filtered.filter(l => l.name.toLowerCase().includes(crmSearchQuery.toLowerCase()) || l.phone.includes(crmSearchQuery));
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-600">No leads found in this pipeline segment.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(l => {
        // স্ট্যাটাস অনুযায়ী ডাইনামিক কালার ব্যাজ মেকানিজম
        let statusClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
        if (l.status === 'trial') statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
        if (l.status === 'converted') statusClass = "bg-green-500/10 text-green-400 border-green-500/20";
        if (l.status === 'lost') statusClass = "bg-red-500/10 text-brandRed border-red-500/20";

        return `
            <tr class="hover:bg-white/[0.02] transition-colors text-xs">
                <td class="py-3.5 px-6 font-mono text-gray-500">${l.id}</td>
                <td class="py-3.5 px-6">
                    <div class="text-white font-semibold text-sm">${l.name}</div>
                    <div class="text-gray-500 font-mono text-[11px] mt-0.5">${l.phone}</div>
                    <p class="text-gray-400 text-[11px] font-sans mt-1 bg-black/20 p-1.5 rounded border border-gray-800/40 max-w-xs">${l.notes}</p>
                </td>
                <td class="py-3.5 px-6 font-medium text-gray-300"><span class="bg-gray-800 px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 uppercase">${l.source}</span></td>
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
                        <button onclick="window.sendLeadWhatsApp('${l.id}')" class="bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-black border border-green-500/20 px-2.5 py-1.5 rounded text-[11px] font-bold transition-all flex items-center space-x-1" title="Send WhatsApp Pitch">
                            <i class="ph ph-whatsapp-logo text-sm"></i>
                            <span>Follow Up</span>
                        </button>
                        <button onclick="window.deleteLead('${l.id}')" class="text-gray-600 hover:text-brandRed p-1 transition-colors">
                            <i class="ph ph-trash text-base"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// =========================================================================
// গ্লোবাল বাইন্ডেড সিআরএম অ্যাকশন ফাংশনসমূহ (BULLETPROOF WINDOW BINDING)
// =========================================================================

window.handleCRMSearch = function() {
    const input = document.getElementById('crm-search');
    if (input) { crmSearchQuery = input.value; renderLeadTable(); }
};

window.switchCRMTab = function(tabName) {
    currentCRMTab = tabName;
    renderLeadFilterTabs();
    renderLeadTable();
};

// ১. স্ট্যাটাস চেঞ্জ এবং অটোমেটিক গেটিং ট্রিগার সিঙ্ক লজিক
window.changeLeadStatus = function(leadId, newStatus) {
    const lead = window.MOCK_LEADS.find(l => l.id === leadId);
    if (!lead) return;

    lead.status = newStatus;

    // ইন্টেলিজেন্ট ইআরপি সিঙ্ক: লিড যদি "Converted" হয়, তবে ফিন্যান্স খাতায় অটোমেটিক একটি "Advance Fee Gated" ইনভয়েস তৈরি হবে!
    if (newStatus === 'converted') {
        const advanceAmount = window.GYM_FEES ? window.GYM_FEES["advance fee"] : 5000;
        if (window.MOCK_TRANSACTIONS) {
            window.MOCK_TRANSACTIONS.unshift({
                id: `TXN-${window.MOCK_TRANSACTIONS.length + 1}`,
                type: "income",
                category: "advance fee",
                amount: advanceAmount,
                date: new Date().toISOString().slice(0,10),
                status: "pending",
                mode: "UPI",
                description: `Advance Fee (Fighter Gated) - ${lead.name}`,
                trainerId: "",
                portalLocked: true
            });
            alert(`🎉 LEADS CONVERSION SUCCESS:\n${lead.name} has been successfully marked as CONVERTED!\n\n🔒 Gated Member Protection Active.\n💸 Ledger Sync: An automated Advance Fee Invoice of ₹${advanceAmount.toLocaleString()} has been sent to Finance for Admin clearance.`);
        }
    } else {
        alert(`Lead status updated to ${newStatus.toUpperCase()} successfully.`);
    }
    
    renderCRMPage(); // সিআরএম এর মেট্রিক্স ও টেবিল লাইভ আপডেট
};

// ২. হোয়াটসঅ্যাপ টেমপ্লেট রিমাইন্ডার সিমুলেটর
window.sendLeadWhatsApp = function(leadId) {
    const lead = window.MOCK_LEADS.find(l => l.id === leadId);
    if (!lead) return;

    alert(`📱 WHATSAPP GATEWAY INJECTION:\nSending official gym onboarding pitch text template to ${lead.name} (${lead.phone})...\n\n"Hey ${lead.name}! Thanks for choosing R.E.N.E.W Gym. Your Fighter Track access details are ready. Let us know when you'd like to drop by North Dumdum Arena!"`);
};

// ৩. সিকিউর লিড পার্জ/ডিলিট মেকানিজম
window.deleteLead = function(leadId) {
    if (confirm(`Are you sure you want to permanently delete lead log ${leadId}?`)) {
        const index = window.MOCK_LEADS.findIndex(l => l.id === leadId);
        if (index !== -1) {
            window.MOCK_LEADS.splice(index, 1);
            alert("Lead cleared from the CRM roster.");
            renderCRMPage();
        }
    }
};

// ৪. নিউ লিড ক্যাপচার মোডাল উইন্ডো
window.openLeadModal = function() {
    const modal = document.getElementById('transaction-modal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[360px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-5 flex flex-col relative text-xs">
                <button onclick="window.closeTransactionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                
                <div class="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4">
                    <i class="ph ph-funnel text-xl text-brandRed"></i>
                    <h3 class="font-bold text-white text-sm tracking-wide">Capture New Enquiries</h3>
                </div>

                <div class="space-y-3 text-left">
                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Lead/Client Full Name</label>
                        <input type="text" id="lead-form-name" placeholder="e.g. Souvik Sen" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-brandRed">
                    </div>
                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Contact WhatsApp Number</label>
                        <input type="text" id="lead-form-phone" placeholder="e.g. +91 98300 XXXXX" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 font-mono">
                    </div>
                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Acquisition Channel Source</label>
                        <select id="lead-form-source" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none">
                            <option value="Facebook Ads">Facebook Ads Campaign</option>
                            <option value="Instagram">Instagram DM</option>
                            <option value="Walk-in">Direct Walk-In Enquiry</option>
                            <option value="Google Search">Google Organic/My Business</option>
                            <option value="Website">Official Portal Webform</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Requirement Notes / Pitch Summary</label>
                        <textarea id="lead-form-notes" rows="3" placeholder="e.g. Boxing pack options, target weight loss 10kg..." class="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-gray-300 focus:outline-none focus:border-brandRed resize-none"></textarea>
                    </div>
                </div>

                <button onclick="window.submitNewLead()" class="w-full bg-brandRed hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-lg mt-5 uppercase tracking-wide">Register Lead to Pipeline</button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.remove('scale-95'); modal.firstElementChild.classList.add('scale-100'); }, 10);
    modal.onclick = window.closeTransactionModal;
};

// ৫. নিউ লিড সাবমিট ও সেভ করার ভ্যালিডেশন ইঞ্জিন
window.submitNewLead = function() {
    const name = document.getElementById('lead-form-name').value.trim();
    const phone = document.getElementById('lead-form-phone').value.trim();
    const source = document.getElementById('lead-form-source').value;
    const notes = document.getElementById('lead-form-notes').value.trim();

    if (!name || !phone) {
        alert("Validation Failed:\nPlease enter both Client Name and Mobile Number to hook the lead!");
        return;
    }

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    const newLead = {
        id: `LED-${window.MOCK_LEADS.length + 101}`,
        name: name,
        phone: phone,
        source: source,
        status: "new", // যেকোনো নতুন ইনকামিং লিড ডিফল্ট কোল্ড অবস্থায় আসবে
        date: formattedDate,
        notes: notes || "No additional requirement logs recorded."
    };

    window.MOCK_LEADS.unshift(newLead);
    
    // ফিল্টার রিসেট করা ইউজার সুবিধার জন্য
    currentCRMTab = 'all';
    const searchInput = document.getElementById('crm-search');
    if (searchInput) searchInput.value = '';

    alert(`Success!\n${name} has been plugged into the R.E.N.E.W CRM pipeline successfully.`);
    window.closeTransactionModal();
    renderCRMPage();
};