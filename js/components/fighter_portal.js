// =========================================================================
// js/components/fighter_portal.js — MAIN DASHBOARD HUB (SWAPPED LAYOUT)
// =========================================================================

let loggedInFighter = null;
let fighterCurrentTab = 'dashboard';

if (!window.GYM_BROADCASTS) {
    window.GYM_BROADCASTS = [ { id: "B-1", message: "⚡ System Alert: The main arena will remain closed on Sunday for deep cleaning and maintenance.", date: "2026-06-18" } ];
}
if (!window.GYM_EVENTS) {
    window.GYM_EVENTS = [ { eventNo: "EVT-101", title: "Pro MMA Striking Masterclass", amount: 1500, date: "2026-06-25" } ];
}

function getFighterPortalView() {
    if (!loggedInFighter) {
        return `
            <div class="h-[80vh] flex items-center justify-center animate-fadeIn">
                <div class="bg-darkSurface border border-gray-800 p-8 rounded-2xl shadow-2xl w-[350px] text-center relative overflow-hidden group">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-brandRed/10 rounded-full blur-3xl group-hover:bg-brandRed/20 transition-all"></div>
                    <i class="ph ph-user-focus text-6xl text-brandRed mb-4 drop-shadow-[0_0_15px_rgba(255,0,51,0.5)]"></i>
                    <h2 class="text-white font-black text-xl tracking-widest uppercase mb-1">Fighter Access</h2>
                    <p class="text-gray-500 text-[10px] uppercase tracking-wider mb-8">Enter registered Phone or ID</p>
                    <input type="text" id="fighter-login-input" placeholder="e.g. m-002 or +91 91632" class="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white text-center font-mono focus:outline-none focus:border-brandRed mb-5">
                    <button onclick="window.loginFighter()" class="w-full bg-gradient-to-r from-red-600 to-brandRed text-white font-extrabold py-3.5 rounded-xl uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,51,0.3)] transition-all">Engage System</button>
                </div>
            </div>
        `;
    }

    const m = loggedInFighter;
    const txns = window.MOCK_TRANSACTIONS || [];
    const memberTxns = txns.filter(t => t.type === 'income' && t.description.toLowerCase().includes(m.name.toLowerCase()));
    const hasPendingDue = memberTxns.some(t => t.status === 'pending');
    const isWaitingApproval = memberTxns.some(t => t.status === 'pending_verification');
    const dueAmount = memberTxns.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);

    if (m.streak === undefined) m.streak = Math.floor(Math.random() * 15) + 1;

    // HOLD STATE: Pending Admin Verification
    if (isWaitingApproval && !hasPendingDue && fighterCurrentTab !== 'billing') {
        return `
            <div class="h-[80vh] flex items-center justify-center animate-fadeIn">
                <div class="bg-darkSurface border border-amber-500/30 p-8 rounded-2xl shadow-2xl w-[400px] text-center relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
                    <div class="w-20 h-20 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 animate-pulse border border-amber-500/20"><i class="ph ph-hourglass-high"></i></div>
                    <h3 class="text-white font-bold text-lg uppercase tracking-wide">Payment Under Verification</h3>
                    <p class="text-gray-400 text-xs mt-2 leading-relaxed">Hello <span class="text-amber-400 font-bold">${m.name}</span>, your payment is logged.</p>
                    <div class="bg-black/40 border border-gray-800 rounded-xl p-3.5 my-5 text-left font-mono text-[11px] text-gray-500 space-y-1">
                        <div><span class="text-gray-400">Account ID:</span> ${m.id}</div>
                        <div><span class="text-gray-400">Clearance:</span> <span class="text-amber-400 font-bold animate-pulse">Awaiting Admin Sign-off</span></div>
                    </div>
                    <button onclick="window.switchFighterTab('billing')" class="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl uppercase text-[11px] tracking-wider transition-all">Go to Billing & Receipts</button>
                    <button onclick="window.logoutFighter()" class="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2.5 rounded-xl uppercase text-[11px] tracking-wider transition-all">Exit Portal</button>
                </div>
            </div>
        `;
    }

    let statusGlow = "shadow-[0_0_20px_rgba(34,197,94,0.2)] border-green-500/50";
    if (m.status === 'lapsed') statusGlow = "shadow-[0_0_20px_rgba(239,68,68,0.2)] border-red-500/50 grayscale";
    else if (hasPendingDue || m.portalLocked) statusGlow = "shadow-[0_0_20px_rgba(245,158,11,0.2)] border-amber-500/50";

    const headerHTML = `
        <div class="flex justify-between items-center bg-darkSurface border border-gray-800 p-4 rounded-2xl shadow-xl mb-6">
            <div class="flex items-center space-x-3">
                <img src="${m.photoUrl}" class="w-10 h-10 rounded-full object-cover border-2 ${statusGlow}">
                <div><h3 class="text-white font-bold text-sm tracking-wide uppercase">Fighter Gateway</h3><p class="text-gray-500 text-[10px] font-mono uppercase">System Logged In</p></div>
            </div>
            <button onclick="window.logoutFighter()" class="bg-black/50 border border-gray-800 hover:bg-brandRed/20 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"><i class="ph ph-sign-out mr-1.5"></i>Exit</button>
        </div>
        
        <div class="flex space-x-2 bg-black/40 p-1.5 rounded-xl w-max mb-6 border border-gray-800 shadow-inner">
            <button onclick="window.switchFighterTab('dashboard')" class="px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'dashboard' ? 'bg-brandRed text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-squares-four mr-1.5"></i> Arena Dashboard</button>
            <button onclick="window.switchFighterTab('billing')" class="px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'billing' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}">
                <i class="ph ph-wallet mr-1.5"></i> Membership & Billing
                ${hasPendingDue ? '<span class="w-2 h-2 rounded-full bg-amber-400 ml-2 animate-pulse"></span>' : ''}
            </button>
        </div>
    `;

    // ---------------------------------------------------------
    // TAB 1: ARENA DASHBOARD 
    // ---------------------------------------------------------
    if (fighterCurrentTab === 'dashboard') {
        const weight = m.weight || "72 KG";
        const height = m.height || "5'8\"";
        const age = m.age || "26 YRS";
        const displayExpiry = (m.expiryDate === 'Pending First Scan' || m.expiryDate === 'Lapsed (No-Show)') ? 'HOLD' : m.expiryDate;
        const displayId = m.id.replace('m-', '4100  8900  000'); 
        const cardClass = m.status === 'lapsed' ? 'gold-card lapsed' : 'gold-card';

        return `
            <style>
                @keyframes scanLine { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                .animate-scan { animation: scanLine 2.5s ease-in-out infinite; }
                .gold-card { width: 100%; max-width: 420px; height: 250px; border-radius: 18px; margin: 0 auto; background: linear-gradient(135deg, #c8a84b 0%, #e8cc6a 30%, #f5e07a 50%, #d4a940 70%, #b8922e 100%); position: relative; overflow: hidden; box-shadow: 0 8px 40px rgba(160,120,20,0.4), 0 2px 8px rgba(0,0,0,0.3); font-family: 'Courier New', monospace; transition: transform 0.3s ease; }
                .gold-card:hover { transform: rotateY(-5deg) rotateX(3deg) scale(1.02); }
                .gold-card .overlay-lines { position: absolute; inset: 0; background: repeating-linear-gradient(60deg, transparent, transparent 38px, rgba(255,255,255,0.04) 38px, rgba(255,255,255,0.04) 39px); }
                .gold-card .glow1 { position: absolute; top: -60px; right: -60px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%); }
                .gold-card .glow2 { position: absolute; bottom: -80px; left: -40px; width: 240px; height: 240px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%); }
                .gold-card .chip { position: absolute; top: 26px; left: 28px; width: 52px; height: 40px; border-radius: 6px; background: linear-gradient(135deg, #c8a020 0%, #e8d060 40%, #b89018 100%); border: 1.5px solid rgba(180,140,10,0.6); display: flex; align-items: center; justify-content: center; overflow: hidden; }
                .gold-card .chip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5px; padding: 5px; z-index: 1; width: 100%; height: 100%; }
                .gold-card .chip-cell { background: rgba(100,70,0,0.35); border-radius: 1px; height: 100%; }
                .gold-card .chip-hline { position: absolute; width: 100%; height: 1.5px; background: rgba(100,70,0,0.3); top: 50%; transform: translateY(-50%); }
                .gold-card .chip-vline { position: absolute; width: 1.5px; height: 100%; background: rgba(100,70,0,0.3); left: 50%; transform: translateX(-50%); }
                .gold-card .card-number { position: absolute; top: 100px; left: 28px; right: 28px; font-size: 22px; font-weight: 600; letter-spacing: 4px; color: rgba(80,50,0,0.85); text-shadow: 0 1px 0 rgba(255,255,200,0.4); }
                .gold-card .valid-label { position: absolute; top: 145px; left: 28px; font-size: 9px; letter-spacing: 1.5px; color: rgba(80,50,0,0.6); font-family: Arial, sans-serif; text-transform: uppercase; }
                .gold-card .expiry { position: absolute; top: 157px; left: 28px; font-size: 15px; font-weight: 600; letter-spacing: 2px; color: rgba(80,50,0,0.85); }
                .gold-card .body-stats { position: absolute; top: 145px; left: 175px; display: flex; gap: 18px; font-family: Arial, sans-serif; }
                .gold-card .stat-box { display: flex; flex-direction: column; }
                .gold-card .stat-label { font-size: 8px; letter-spacing: 1px; color: rgba(80,50,0,0.6); text-transform: uppercase; margin-bottom: 2px; font-weight: bold;}
                .gold-card .stat-value { font-size: 12px; font-weight: 700; color: rgba(80,50,0,0.85); font-family: 'Courier New', monospace;}
                .gold-card .cardholder { position: absolute; bottom: 26px; left: 28px; font-size: 15px; font-weight: 700; letter-spacing: 2px; color: rgba(80,50,0,0.85); text-transform: uppercase; font-family: Arial, sans-serif; text-shadow: 0 1px 0 rgba(255,255,200,0.3); max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .gold-card .edit-btn { position: absolute; top: 26px; right: 28px; background: rgba(80,50,0,0.1); border: 1px solid rgba(80,50,0,0.2); color: rgba(80,50,0,0.8); border-radius: 6px; padding: 6px; cursor: pointer; transition: all 0.2s; z-index: 10; display: flex; align-items: center; justify-content: center; }
                .gold-card .edit-btn:hover { background: rgba(80,50,0,0.2); color: rgba(80,50,0,1); }
                .gold-card .logo { position: absolute; bottom: 20px; right: 28px; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
                .gold-card .logo-circles { display: flex; }
                .gold-card .circle-left { width: 30px; height: 30px; border-radius: 50%; background: rgba(160,80,0,0.5); }
                .gold-card .circle-right { width: 30px; height: 30px; border-radius: 50%; background: rgba(160,80,0,0.35); margin-left: -12px; }
                .gold-card .logo-text { font-size: 8px; letter-spacing: 1px; color: rgba(80,50,0,0.6); font-family: Arial, sans-serif; text-transform: uppercase; font-weight: 700; }
                .gold-card.lapsed { filter: grayscale(100%) opacity(0.8); }
            </style>
            
            <div class="space-y-6 animate-fadeIn max-w-5xl mx-auto">
                ${headerHTML}
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div class="flex justify-center items-center">
                        <div class="${cardClass}">
                            <div class="overlay-lines"></div><div class="glow1"></div><div class="glow2"></div>
                            <button onclick="window.editMemberStats('${m.id}')" class="edit-btn" title="Update Body Stats"><i class="ph ph-pencil-simple text-lg"></i></button>
                            <div class="chip"><div class="chip-grid"><div class="chip-cell"></div><div class="chip-cell"></div><div class="chip-cell"></div><div class="chip-cell"></div></div><div class="chip-hline"></div><div class="chip-vline"></div></div>
                            <div class="card-number">${displayId}</div>
                            <div class="valid-label">Valid Thru</div><div class="expiry">${displayExpiry}</div>
                            <div class="body-stats"><div class="stat-box"><span class="stat-label">Weight</span><span class="stat-value">${weight}</span></div><div class="stat-box"><span class="stat-label">Height</span><span class="stat-value">${height}</span></div><div class="stat-box"><span class="stat-label">Age</span><span class="stat-value">${age}</span></div></div>
                            <div class="cardholder">${m.name}</div>
                            <div class="logo"><div class="logo-circles"><div class="circle-left"></div><div class="circle-right"></div></div><div class="logo-text">R.E.N.E.W</div></div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col space-y-4 h-[250px]">
                        <div class="bg-gradient-to-r from-orange-600/20 to-darkSurface border border-orange-500/30 p-4 rounded-2xl flex items-center justify-between shadow-lg">
                            <div class="flex items-center space-x-3">
                                <div class="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 text-2xl border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                    <i class="ph ph-fire ${m.streak > 0 ? 'animate-pulse' : ''}"></i>
                                </div>
                                <div><h4 class="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Active Gym Streak</h4><p class="text-white text-xl font-black font-mono mt-0.5">${m.streak} <span class="text-xs text-orange-400 font-sans">Days</span></p></div>
                            </div>
                        </div>
                        
                        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex-1 flex flex-col justify-center shadow-lg relative overflow-hidden">
                            <i class="ph ph-barbell absolute -right-4 -bottom-4 text-7xl text-gray-800/30"></i>
                            <h4 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-3 border-b border-gray-800/60 pb-2 relative z-10"><i class="ph ph-shield-check text-blue-400 mr-1.5 text-sm"></i>Current Track Config</h4>
                            <div class="flex justify-between items-center relative z-10">
                                <div>
                                    <p class="text-white font-bold text-lg tracking-wide">${m.plan}</p>
                                    <p class="text-[10px] text-gray-500 uppercase mt-1">Assigned Plan</p>
                                </div>
                                <span class="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${m.status === 'lapsed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : m.expiryDate === 'Pending First Scan' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse' : 'bg-green-500/10 text-green-400 border border-green-500/20'}">${m.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="bg-gradient-to-br from-gray-900 to-black border ${m.portalLocked || m.status === 'lapsed' ? 'border-red-900/50' : 'border-gray-800'} p-6 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center group">
                        <div class="absolute inset-0 ${m.portalLocked || m.status === 'lapsed' ? 'bg-red-500/5' : 'bg-blue-500/5'} blur-2xl"></div>
                        <div class="w-24 h-24 rounded-2xl border-2 ${m.portalLocked || m.status === 'lapsed' ? 'border-red-500/30 text-red-500/50' : 'border-blue-500/50 text-blue-400 border-dashed'} flex items-center justify-center relative mb-4 transition-all bg-black/40 shadow-inner overflow-hidden">
                            <i class="ph ph-scan text-5xl"></i>
                            ${!(m.portalLocked || m.status === 'lapsed') ? '<div class="absolute w-full h-1 bg-blue-400/80 shadow-[0_0_15px_#60a5fa] animate-scan"></div>' : ''}
                        </div>
                        ${m.portalLocked || m.status === 'lapsed' ? '<div class="absolute z-20 text-red-500 font-black text-lg uppercase tracking-widest rotate-[-10deg] border-4 border-red-500 px-3 py-1 rounded-lg bg-black/90 shadow-[0_0_20px_rgba(239,68,68,0.5)]">LOCKED</div>' : ''}
                        <h4 class="text-gray-300 text-[11px] font-bold uppercase tracking-widest relative z-10">Arena Check-in</h4>
                        <div class="w-full relative z-10 flex flex-col space-y-3 mt-4">
                            ${m.status === 'lapsed' ? `<button disabled class="w-full bg-red-950/50 text-red-500 text-[11px] font-extrabold py-2.5 rounded-xl border border-red-900/50 cursor-not-allowed uppercase tracking-wider">Account Lapsed</button>` : m.portalLocked ? `<button disabled class="w-full bg-gray-800 text-gray-500 text-[11px] font-bold py-2.5 rounded-xl cursor-not-allowed uppercase tracking-wider">Clear Dues to Scan</button>` : `<button onclick="window.fighterScanQR('${m.id}')" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-extrabold py-2.5 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.4)] uppercase tracking-wider flex justify-center items-center transition-all"><i class="ph ph-qr-code text-sm mr-1.5 animate-pulse"></i> Open Scanner</button><div class="pt-2 border-t border-gray-800/80 w-full mt-2"><p class="text-[8px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Manual Desk Token</p><div class="flex space-x-2"><input type="text" id="manual-desk-token" placeholder="PIN" class="flex-1 bg-black/60 border border-gray-700 rounded-xl px-2 py-2 text-white text-xs font-mono text-center focus:outline-none focus:border-blue-500 uppercase tracking-widest"><button onclick="window.fighterManualTokenCheckIn('${m.id}')" class="bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-white border border-gray-700 px-3 py-2 rounded-xl transition-colors"><i class="ph ph-check-circle text-sm"></i></button></div></div>`}
                        </div>
                    </div>

                    <div class="lg:col-span-2 flex flex-col space-y-6">
                        <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl flex-1 overflow-y-auto custom-scrollbar flex flex-col relative shadow-inner max-h-[220px]">
                            <h4 class="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center mb-4 sticky top-0 bg-darkSurface/90 backdrop-blur-sm z-10 pb-2 border-b border-gray-800/60">
                                <i class="ph ph-broadcast mr-1.5 text-brandRed animate-pulse text-sm"></i> HQ Bulletins & Events
                            </h4>
                            <div class="space-y-3">
                                ${window.GYM_BROADCASTS.map(b => `<div class="bg-amber-950/20 border border-amber-500/20 p-3 rounded-xl flex items-start space-x-2"><i class="ph ph-warning-circle text-amber-500 mt-0.5 text-base drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]"></i><p class="text-amber-100 text-xs leading-relaxed">${b.message}</p></div>`).join('')}
                                ${window.GYM_EVENTS.map(e => `<div class="bg-purple-950/20 border border-purple-500/20 p-3 rounded-xl flex items-start space-x-2"><i class="ph ph-calendar-star text-purple-400 mt-0.5 text-base drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]"></i><div><p class="text-purple-100 text-xs font-bold">Upcoming Event: ${e.title}</p><p class="text-purple-300 text-[10px] font-mono mt-1">Code: ${e.eventNo} | Date: ${e.date}</p></div></div>`).join('')}
                            </div>
                        </div>

                        <div class="bg-darkSurface border ${hasPendingDue ? 'border-amber-500/40 bg-amber-950/10' : 'border-gray-800'} p-6 rounded-2xl flex-1 flex flex-col justify-center shadow-lg">
                            <h4 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-4 border-b border-gray-800/60 pb-2"><i class="ph ph-wallet text-amber-400 mr-1.5 text-sm"></i>Outstanding Ledger</h4>
                            <div class="flex justify-between items-center">
                                <div>
                                    <p class="${hasPendingDue ? 'text-amber-400 animate-pulse' : 'text-green-400'} font-mono text-3xl font-black">${hasPendingDue ? '₹' + dueAmount.toLocaleString() : 'CLEAR'}</p>
                                    <p class="text-[10px] text-gray-500 uppercase mt-1">Total Account Balance</p>
                                </div>
                                ${hasPendingDue ? `<button onclick="window.payMemberDuesSimulation('${m.id}', ${dueAmount})" class="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black px-5 py-2.5 rounded-xl text-[11px] font-extrabold shadow-lg uppercase tracking-wider transition-all flex items-center"><i class="ph ph-credit-card mr-1.5 text-base"></i>Clear Dues</button>` : `<span class="text-green-400 text-3xl opacity-80"><i class="ph ph-check-circle"></i></span>`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } 
    // ---------------------------------------------------------
    // TAB 2: MEMBERSHIP & BILLING
    // ---------------------------------------------------------
    else if (fighterCurrentTab === 'billing') {
        return `
            <div class="space-y-6 animate-fadeIn max-w-5xl mx-auto">
                ${headerHTML}
                ${getFighterMembershipContent(m, memberTxns, hasPendingDue, dueAmount)}
            </div>
        `;
    }
}

// -------------------------------------------------------------------------
// GLOBAL FUNCTION ACTIONS
// -------------------------------------------------------------------------

window.switchFighterTab = function(tabName) {
    fighterCurrentTab = tabName;
    navigateTo('fighter-portal');
};

window.loginFighter = function() {
    const input = document.getElementById('fighter-login-input').value.trim().toLowerCase();
    if (!input) return alert("Validation Error: Please enter a valid ID.");
    const member = window.MOCK_MEMBERS.find(m => m.id.toLowerCase() === input || m.phone.replace(/[^0-9]/g, '').includes(input.replace(/[^0-9]/g, '')));
    if (member) { loggedInFighter = member; fighterCurrentTab = 'dashboard'; navigateTo('fighter-portal'); } 
    else { alert("Access Denied: Credentials not found."); }
};

window.logoutFighter = function() { loggedInFighter = null; fighterCurrentTab = 'dashboard'; navigateTo('fighter-portal'); };

window.editMemberStats = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;
    const newWeight = prompt(`Update Body Weight:\n(Current: ${member.weight || '72 KG'})`, member.weight || '72 KG');
    if(newWeight) member.weight = newWeight.toUpperCase();
    const newHeight = prompt(`Update Height:\n(Current: ${member.height || '5\'8"'})`, member.height || '5\'8"');
    if(newHeight) member.height = newHeight.toUpperCase();
    const newAge = prompt(`Update Age:\n(Current: ${member.age || '26 YRS'})`, member.age || '26 YRS');
    if(newAge) member.age = newAge.toUpperCase();
    navigateTo('fighter-portal'); 
};

window.fighterScanQR = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member || member.portalLocked || member.status === 'lapsed') return;
    if(confirm("📸 CAMERA INITIALIZED (Simulation)\n\nAim camera at Arena Desk QR.\nClick 'OK' to simulate entry.")) processCheckIn(member);
};

window.fighterManualTokenCheckIn = function(memberId) {
    const tokenInput = document.getElementById('manual-desk-token').value.trim();
    if (!tokenInput || tokenInput.length < 4) return alert("Invalid token format!");
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member || member.portalLocked || member.status === 'lapsed') return;
    processCheckIn(member, true);
};

function processCheckIn(member, isManual = false) {
    const todayStr = new Date().toISOString().slice(0,10);
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (member.expiryDate === "Pending First Scan") {
        const expiry = new Date(); expiry.setDate(expiry.getDate() + 30); 
        member.expiryDate = expiry.toISOString().slice(0,10);
        member.status = "active";
        alert(`🎉 FIRST CHECK-IN SUCCESSFUL!\nYour 30-Day billing cycle officially starts TODAY.`);
    } else { alert(`✅ CHECK-IN SUCCESSFUL!\nWelcome back, ${member.name}.`); }
    if (!member.checkedInToday) member.streak = (member.streak || 0) + 1;
    member.checkedInToday = true;
    member.lastCheckIn = `${todayStr} ${timeStr}`;
    navigateTo('fighter-portal');
}

window.payMemberDuesSimulation = function(memberId, amount) {
    const txns = window.MOCK_TRANSACTIONS || [];
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    const targetTxns = txns.filter(t => t.type === 'income' && t.status === 'pending' && t.description.toLowerCase().includes(member.name.toLowerCase()));
    targetTxns.forEach(t => { t.status = 'pending_verification'; t.mode = 'Online Gateway'; });
    alert(`💳 REQUEST SUBMITTED!\n\nTransaction of ₹${amount.toLocaleString()} is currently on hold.\nWaiting for Admin verification.`);
    fighterCurrentTab = 'dashboard'; 
    navigateTo('fighter-portal');
};
// fighter_portal.js এর processCheckIn ফাংশনে এটি যোগ করুন:
function processCheckIn(member) {
    if (member.portalLocked) {
        alert("⚠️ Access Denied: Please clear your advance fees through the Membership & Billing tab to unlock your portal.");
        return;
    }
    // ... বাকি কোড
}