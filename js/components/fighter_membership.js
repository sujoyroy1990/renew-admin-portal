// =========================================================================
// js/components/fighter_membership.js — FIGHTER BILLING & PLAN MANAGER
// =========================================================================

function getFighterMembershipContent(m, memberTxns, hasPendingDue, dueAmount) {
    // 1. রিনিউয়াল রিমাইন্ডার লজিক (৭ দিনের কম হলে)
    let renewalBanner = '';
    if (m.expiryDate && m.expiryDate !== "Pending First Scan" && m.expiryDate !== "Lapsed (No-Show)") {
        const expDate = new Date(m.expiryDate);
        const today = new Date();
        const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7 && diffDays >= 0) {
            renewalBanner = `
                <div class="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl flex justify-between items-center mb-6 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                    <div class="flex items-center space-x-3">
                        <i class="ph ph-warning-circle text-orange-500 text-2xl animate-pulse"></i>
                        <div>
                            <h4 class="text-orange-400 text-sm font-bold uppercase tracking-wide">Renewal Reminder</h4>
                            <p class="text-orange-200/70 text-xs">Your membership expires in <span class="font-bold text-white">${diffDays} days</span>. Please renew soon to keep your gym streak active!</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // 2. প্ল্যান এবং হিস্ট্রি জেনারেটর
    const planOptions = window.GYM_PLANS.map(p => `<option value="${p.name}" data-fee="${p.fee}" ${m.plan === p.name ? 'selected' : ''}>${p.name} (₹${p.fee})</option>`).join('');
    const pastTxns = memberTxns.filter(t => t.status !== 'pending' && t.status !== 'overdue');
    const historyHTML = pastTxns.map(t => `
        <div class="flex justify-between items-center bg-black/40 border border-gray-800/80 p-3.5 rounded-xl hover:border-gray-700 transition-colors group mb-3">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center ${t.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}">
                    <i class="ph ${t.status === 'paid' ? 'ph-check-circle' : 'ph-hourglass'} text-lg"></i>
                </div>
                <div>
                    <p class="text-gray-200 text-xs font-bold">${t.description}</p>
                    <p class="text-gray-500 text-[10px] font-mono mt-0.5">${t.date} &nbsp;•&nbsp; ${t.mode} &nbsp;•&nbsp; ID: ${t.id}</p>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <span class="text-white font-mono text-sm font-bold">₹${t.amount}</span>
                <button onclick="window.downloadInvoice('${t.id}')" class="text-gray-500 hover:text-blue-400 transition-colors bg-gray-800/50 p-2 rounded-lg" title="Download Official Invoice"><i class="ph ph-download-simple text-base"></i></button>
            </div>
        </div>
    `).join('') || '<p class="text-xs text-gray-500 italic text-center py-6 border border-dashed border-gray-800 rounded-xl bg-black/20">No billing history found.</p>';

    // 3. ফাইনাল HTML রেন্ডার
    return `
        ${renewalBanner}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-darkSurface border ${hasPendingDue ? 'border-amber-500/40 bg-amber-950/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-gray-800'} p-6 rounded-2xl flex flex-col justify-between">
                <div>
                    <h4 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-4 border-b border-gray-800/60 pb-2"><i class="ph ph-credit-card text-amber-400 mr-1.5 text-sm"></i>Online Fee Payment</h4>
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <p class="${hasPendingDue ? 'text-amber-400 animate-pulse' : 'text-green-400'} font-mono text-3xl font-black">${hasPendingDue ? '₹' + dueAmount.toLocaleString() : '₹0.00'}</p>
                            <p class="text-[10px] text-gray-500 uppercase mt-1">Pending Amount to Clear</p>
                        </div>
                        ${!hasPendingDue ? `<span class="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-500/20"><i class="ph ph-check-circle mr-1"></i>All Clear</span>` : ''}
                    </div>
                </div>
                ${hasPendingDue ? `
                    <button onclick="window.payMemberDuesSimulation('${m.id}', ${dueAmount})" class="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black py-3 rounded-xl text-xs font-extrabold shadow-lg uppercase tracking-wider transition-all flex justify-center items-center">
                        <i class="ph ph-lock-key-open mr-2 text-lg"></i> Pay Now via Secure Gateway
                    </button>
                    <p class="text-[9px] text-center text-gray-500 mt-2 font-mono">Supports UPI, Net Banking & Cards</p>
                ` : `
                    <button disabled class="w-full bg-gray-800 text-gray-600 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed border border-gray-700">No Action Required</button>
                `}
            </div>

            <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl flex flex-col">
                <h4 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-4 border-b border-gray-800/60 pb-2"><i class="ph ph-barbell text-blue-400 mr-1.5 text-sm"></i>Plan Configuration</h4>
                <div class="mb-4">
                    <label class="text-[10px] text-gray-400 uppercase font-bold mb-1.5 block">Current Plan Assigned</label>
                    <div class="bg-black/40 border border-gray-700 p-3 rounded-xl text-white text-sm font-bold flex justify-between items-center">
                        <span>${m.plan}</span>
                        <span class="text-green-400 text-xs font-mono">ACTIVE</span>
                    </div>
                </div>
                <div class="flex-1">
                    <label class="text-[10px] text-gray-400 uppercase font-bold mb-1.5 block">Request Plan Upgrade</label>
                    <select id="upgrade-plan-selector" class="w-full bg-black/60 border border-gray-700 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-blue-500 mb-4">
                        ${planOptions}
                    </select>
                    <button onclick="window.requestPlanUpgrade('${m.id}')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">Confirm & Upgrade Plan</button>
                </div>
            </div>
        </div>

        <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl mt-6">
            <h4 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-4 border-b border-gray-800/60 pb-2"><i class="ph ph-receipt text-purple-400 mr-1.5 text-sm"></i>Billing History & Receipts</h4>
            <div class="max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                ${historyHTML}
            </div>
        </div>
    `;
}

// Global Membership Actions
window.requestPlanUpgrade = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    const selector = document.getElementById('upgrade-plan-selector');
    const newPlanName = selector.value;
    const newFee = parseFloat(selector.options[selector.selectedIndex].getAttribute('data-fee'));

    if (member.plan === newPlanName) {
        alert("You are already subscribed to this exact plan!"); return;
    }

    member.plan = newPlanName;
    if (window.MOCK_TRANSACTIONS) {
        window.MOCK_TRANSACTIONS.unshift({
            id: `TXN-${String(window.MOCK_TRANSACTIONS.length + 1).padStart(3, '0')}`,
            type: "income", category: "membership", amount: newFee,
            date: new Date().toISOString().slice(0,10),
            status: "pending", mode: "Online Gateway",
            description: `${member.name} - Plan Switch (${newPlanName})`,
            trainerId: "", portalLocked: false
        });
    }

    alert(`✅ PLAN UPGRADE REQUESTED!\n\nYou have successfully switched to [${newPlanName}].\nA new pending invoice of ₹${newFee} has been generated. Please clear your dues to continue.`);
    navigateTo('fighter-portal');
};

window.downloadInvoice = function(txnId) {
    alert(`📥 INVOICE DOWNLOAD INITIATED\n\nGenerating secure PDF receipt for Transaction ID: ${txnId}...\nThe file will be saved to your device shortly.`);
};