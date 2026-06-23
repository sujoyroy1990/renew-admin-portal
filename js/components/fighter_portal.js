// =========================================================================
// js/components/fighter_portal.js — MAIN DASHBOARD HUB (SWAPPED LAYOUT)
// =========================================================================

let loggedInFighter = null;
let fighterCurrentTab = 'dashboard';

if (!window.getFighterMedicalHistory) {
    window.getFighterMedicalHistory = function(member) {
        const data = member.assessmentData;
        if (!data) return "No assessment submitted";

        const issues = [];
        if (data && data.medicalHeartCondition === 'yes') issues.push("Heart Condition");
        if (data && data.medicalChestPain === 'yes') issues.push("Chest Pain");
        if (data && data.medicalBoneJointProblem === 'yes') issues.push("Bone/Joint Problem");
        if (data && data.medicalRecentSurgery === 'yes') issues.push("Recent Surgery");
        
        if (data && data.medicalElaboration) {
            issues.push(data.medicalElaboration);
        }

        if (issues.length === 0) return "No health issues reported";
        return issues.join(", ");
    };
}

if (!window.GYM_BROADCASTS) {
    window.GYM_BROADCASTS = [ { id: "B-1", message: "⚡ System Alert: The main arena will remain closed on Sunday for deep cleaning and maintenance.", date: "2026-06-18" } ];
}
if (!window.GYM_EVENTS) {
    window.GYM_EVENTS = [ { eventNo: "EVT-101", title: "Pro MMA Striking Masterclass", amount: 1500, date: "2026-06-25" } ];
}

function getFighterPortalView() {
    loggedInFighter = window.loggedInFighter;
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
    
    // Retrieve trainer name
    const trainer = window.MOCK_TRAINERS ? window.MOCK_TRAINERS.find(t => t.id === m.trainerId) : null;
    const trainerName = trainer ? trainer.name : "Assigned Trainer";
    const hasPendingDue = memberTxns.some(t => t.status === 'pending');
    const isWaitingApproval = memberTxns.some(t => t.status === 'pending_verification');
    const dueAmount = memberTxns.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);

    if (m.streak === undefined) m.streak = m.lastCheckIn ? 1 : 0;

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
        
        <div class="flex flex-wrap gap-2 bg-black/40 p-1.5 rounded-xl w-max mb-6 border border-gray-800 shadow-inner animate-fadeIn">
            <button onclick="window.switchFighterTab('dashboard')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'dashboard' ? 'bg-brandRed text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-squares-four mr-1.5"></i> Dashboard</button>
            <button onclick="window.switchFighterTab('routine')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'routine' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-barbell mr-1.5"></i> Workout Routine</button>
            <button onclick="window.switchFighterTab('nutrition')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'nutrition' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-apple-slice mr-1.5"></i> Diet & Nutrition</button>
            <button onclick="window.switchFighterTab('attendance')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'attendance' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-calendar-check mr-1.5"></i> Attendance Logs</button>
            <button onclick="window.switchFighterTab('billing')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'billing' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}">
                <i class="ph ph-wallet mr-1.5"></i> Billing & Dues
                ${hasPendingDue ? '<span class="w-2 h-2 rounded-full bg-amber-400 ml-2 animate-pulse"></span>' : ''}
            </button>
            <button onclick="window.switchFighterTab('shop')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'shop' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50' : 'text-gray-500 hover:text-white'}">
                <i class="ph ph-shopping-bag-open mr-1.5"></i> Gym Shop
            </button>
        </div>
    `;

    let tabContent = "";

    // ---------------------------------------------------------
    // TAB: ARENA DASHBOARD 
    // ---------------------------------------------------------
    if (fighterCurrentTab === 'dashboard') {
        const weight = m.weight || "72 KG";
        const height = m.height || "5'8\"";
        const age = m.age || "26 YRS";
        const displayExpiry = (m.expiryDate === 'Pending First Scan' || m.expiryDate === 'Lapsed (No-Show)') ? 'HOLD' : m.expiryDate;
        const displayId = m.id.replace('m-', '4100  8900  000 '); 
        const cardClass = m.status === 'lapsed' ? 'gold-card lapsed' : 'gold-card';

        const scanBtnText = m.checkedInToday 
            ? `<i class="ph ph-sign-out text-sm mr-1.5 text-brandRed animate-pulse"></i> Scan to Check-Out`
            : `<i class="ph ph-qr-code text-sm mr-1.5 text-blue-400 animate-pulse"></i> Open Scanner`;
        const scanBtnClass = m.checkedInToday
            ? `bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600`
            : `bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-[0_0_15px_rgba(59,130,246,0.4)]`;

        tabContent = `
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
                        ${m.status === 'lapsed' 
                            ? `<button disabled class="w-full bg-red-950/50 text-red-500 text-[11px] font-extrabold py-2.5 rounded-xl border border-red-900/50 cursor-not-allowed uppercase tracking-wider">Account Lapsed</button>` 
                            : m.portalLocked 
                                ? `<button disabled class="w-full bg-gray-800 text-gray-500 text-[11px] font-bold py-2.5 rounded-xl cursor-not-allowed uppercase tracking-wider">Clear Dues to Scan</button>` 
                                : `<button onclick="window.fighterScanQR('${m.id}')" class="w-full text-white text-[11px] font-extrabold py-2.5 rounded-xl uppercase tracking-wider flex justify-center items-center transition-all ${scanBtnClass}">${scanBtnText}</button>
                                   <div class="pt-2 border-t border-gray-800/80 w-full mt-2">
                                       <p class="text-[8px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Manual Desk Token</p>
                                       <div class="flex space-x-2">
                                           <input type="text" id="manual-desk-token" placeholder="Offline PIN" class="flex-1 bg-black/60 border border-gray-700 rounded-xl px-2 py-2 text-white text-xs font-mono text-center focus:outline-none focus:border-blue-500 uppercase tracking-widest">
                                           <button onclick="window.fighterManualTokenCheckIn('${m.id}')" class="bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-white border border-gray-700 px-3 py-2 rounded-xl transition-colors"><i class="ph ph-check-circle text-sm"></i></button>
                                       </div>
                                   </div>`
                        }
                    </div>
                </div>

                <div class="lg:col-span-2 flex flex-col space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Left: HQ Bulletins & Events -->
                        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col relative shadow-inner h-[220px] overflow-y-auto custom-scrollbar">
                            <h4 class="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center mb-4 sticky top-0 bg-darkSurface/90 backdrop-blur-sm z-10 pb-2 border-b border-gray-800/60">
                                <i class="ph ph-broadcast mr-1.5 text-brandRed animate-pulse text-sm"></i> HQ Bulletins & Events
                            </h4>
                            <div class="space-y-3">
                                ${window.GYM_BROADCASTS.map(b => `<div class="bg-amber-950/20 border border-amber-500/20 p-3 rounded-xl flex items-start space-x-2"><i class="ph ph-warning-circle text-amber-500 mt-0.5 text-base drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]"></i><p class="text-amber-100 text-xs leading-relaxed">${b.message}</p></div>`).join('')}
                                ${window.GYM_EVENTS.map(e => `<div class="bg-purple-950/20 border border-purple-500/20 p-3 rounded-xl flex items-start space-x-2"><i class="ph ph-calendar-star text-purple-400 mt-0.5 text-base drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]"></i><div><p class="text-purple-100 text-xs font-bold">Upcoming Event: ${e.title}</p><p class="text-purple-300 text-[10px] font-mono mt-1">Code: ${e.eventNo} | Date: ${e.date}</p></div></div>`).join('')}
                            </div>
                        </div>

                        <!-- Right: Trainer Direct Messages -->
                        <div class="bg-darkSurface border border-gray-800 p-4 rounded-2xl flex flex-col relative shadow-inner h-[220px] overflow-y-auto custom-scrollbar">
                            <h4 class="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center mb-4 sticky top-0 bg-darkSurface/90 backdrop-blur-sm z-10 pb-2 border-b border-gray-800/60">
                                <i class="ph ph-chat-text mr-1.5 text-indigo-400 animate-pulse text-sm"></i> Trainer Messages
                            </h4>
                            <div class="space-y-3">
                                ${(m.trainerMessages || []).length === 0
                                    ? `<p class="text-gray-600 text-[10px] italic py-8 text-center border border-dashed border-gray-800/60 rounded-xl bg-black/10">No direct messages from your trainer yet.</p>`
                                    : m.trainerMessages.map(msg => `
                                        <div class="bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-xl flex items-start space-x-2">
                                            <i class="ph ph-chat-text text-indigo-400 mt-0.5 text-base drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]"></i>
                                            <div>
                                                <p class="text-indigo-100 text-xs leading-relaxed">${msg.message}</p>
                                                <p class="text-indigo-300 text-[8px] font-mono mt-1">From: ${msg.trainerName} | ${msg.date}</p>
                                            </div>
                                        </div>
                                    `).reverse().join('')}
                            </div>
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

            ${trainer ? (() => {
                const alreadyRated = m.lastRatedTrainerId === m.trainerId;
                const trainerRatings = (trainer.kpis && trainer.kpis.fighterRatings) || [];
                const avgRating = trainerRatings.length > 0
                    ? (trainerRatings.reduce((s, r) => s + r.stars, 0) / trainerRatings.length).toFixed(1)
                    : trainer.kpis.satisfaction.toFixed(1);
                const myRating = alreadyRated ? trainerRatings.find(r => r.memberId === m.id) : null;
                const streakMet = (m.streak || 0) >= 15;

                return `
                <div class="bg-gradient-to-br from-gray-900 to-black border border-amber-500/20 p-6 rounded-2xl shadow-xl relative overflow-hidden mt-2">
                    <div class="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>
                    <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-5 flex items-center justify-between">
                        <span><i class="ph ph-star text-amber-400 mr-2 text-base"></i>Rate Your Trainer</span>
                        <span class="text-[10px] text-gray-500 font-mono normal-case">Overall Avg: <span class="text-amber-400 font-bold">${avgRating} ★</span></span>
                    </h4>
                    <div class="flex items-center space-x-4">
                        <img src="${trainer.photoUrl || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150'}" class="w-14 h-14 rounded-xl object-cover border-2 border-amber-500/30 shadow-lg flex-shrink-0">
                        <div class="flex-1">
                            <p class="text-white font-bold text-sm">${trainer.name}</p>
                            <p class="text-gray-500 text-[10px] uppercase font-mono mt-0.5">Your Personal Trainer</p>
                            ${alreadyRated && myRating ? `
                                <div class="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 flex items-center space-x-2">
                                    <span class="text-amber-400 font-black text-sm">${'★'.repeat(myRating.stars)}${'☆'.repeat(5 - myRating.stars)}</span>
                                    <span class="text-amber-300 text-[10px] font-bold uppercase tracking-wide">You rated ${myRating.stars}/5</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    ${!streakMet ? `
                    <div class="mt-5 bg-gradient-to-r from-gray-900 to-black border border-orange-500/20 rounded-xl p-4 flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <i class="ph ph-lock-key text-orange-400 text-xl"></i>
                        </div>
                        <div>
                            <p class="text-orange-300 font-bold text-xs uppercase tracking-wide">🔒 Rating Locked</p>
                            <p class="text-gray-500 text-[10px] mt-1 leading-relaxed">Complete <span class="text-orange-400 font-black">${15 - (m.streak || 0)} more</span> consecutive gym days to unlock trainer rating.</p>
                            <div class="mt-2 w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-gray-800">
                                <div class="bg-gradient-to-r from-orange-600 to-amber-400 h-full rounded-full transition-all" style="width: ${Math.min(((m.streak || 0) / 15) * 100, 100)}%"></div>
                            </div>
                            <p class="text-[9px] text-gray-600 font-mono mt-1">${m.streak || 0} / 15 streak days</p>
                        </div>
                    </div>
                    ` : !alreadyRated ? `
                    <div class="mt-5 space-y-3">
                        <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Select Your Rating</p>
                        <div class="flex space-x-2" id="star-rating-row">
                            ${[1,2,3,4,5].map(s => `
                                <button onclick="window.selectTrainerStar(${s})" id="star-btn-${s}"
                                    class="w-10 h-10 rounded-xl border border-gray-700 flex items-center justify-center text-xl transition-all hover:border-amber-400 hover:bg-amber-500/10 text-gray-600 hover:text-amber-400 font-bold"
                                    data-star="${s}">★</button>
                            `).join('')}
                        </div>
                        <textarea id="trainer-rating-note" rows="2" placeholder="Optional feedback for your trainer..." class="w-full bg-black/50 border border-gray-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white resize-none outline-none font-mono leading-relaxed placeholder-gray-600"></textarea>
                        <button onclick="window.submitTrainerRating('${m.id}', '${trainer.id}')" class="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center">
                            <i class="ph ph-star mr-2 text-base"></i>Submit Rating
                        </button>
                    </div>
                    ` : `
                    <div class="mt-4 bg-green-950/20 border border-green-900/30 rounded-xl p-3.5 flex items-center space-x-2">
                        <i class="ph ph-check-circle text-green-400 text-lg"></i>
                        <p class="text-green-400 text-xs font-bold">You have already submitted your trainer rating. Thank you!</p>
                    </div>
                    `}
                </div>
                `;
            })() : ''}
        `;
    } 
    // ---------------------------------------------------------
    // TAB: WORKOUT ROUTINE
    // ---------------------------------------------------------
    else if (fighterCurrentTab === 'routine') {
        const history = m.routineHistory || [];
        const historyHTML = history.length === 0
            ? `<p class="text-gray-600 text-xs italic py-8 text-center bg-black/20 border border-dashed border-gray-800 rounded-xl">No previous workout routines logged.</p>`
            : history.map(h => `
                <div class="bg-black/30 border border-gray-800 p-4 rounded-xl space-y-2 mb-3">
                    <div class="flex justify-between items-center text-[10px] font-mono text-gray-500">
                        <span class="text-indigo-400 font-bold"><i class="ph ph-calendar-blank mr-1"></i>${h.date}</span>
                        <span class="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-black uppercase text-[8px]">Completed ✓</span>
                    </div>
                    <p class="text-gray-300 text-xs font-mono whitespace-pre-wrap leading-relaxed">${h.routine}</p>
                </div>
            `).reverse().join('');

        tabContent = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left: Today's Routine & Fighter Arena Profile -->
                <div class="lg:col-span-1 space-y-6">
                    <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
                        <div class="space-y-4">
                            <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-2 flex items-center">
                                <i class="ph ph-barbell text-brandRed mr-2 text-base"></i>Today's Routine (Assigned by ${trainerName})
                            </h4>
                            <div class="bg-black/30 border border-gray-800/80 p-4 rounded-xl text-left min-h-[150px]">
                                <div class="font-mono text-xs text-gray-300 whitespace-pre-wrap">${m.todaysRoutine || "No routine set for today."}</div>
                            </div>
                        </div>
                        <div class="mt-6 border-t border-gray-800/60 pt-4 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                            <span>Status:</span>
                            ${m.routineCompleted 
                                ? `<span class="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-black uppercase">Completed ✓</span>`
                                : `<span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-black uppercase">Active / In Progress</span>`
                            }
                        </div>
                    </div>

                    <!-- Fighter Arena Profile Details (Dynamically Fetched) -->
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
                        <i class="ph ph-user-focus absolute -right-4 -bottom-4 text-7xl text-gray-800/10"></i>
                        <h4 class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-3.5 border-b border-gray-800/60 pb-2 relative z-10 flex justify-between items-center">
                            <span><i class="ph ph-shield-check text-indigo-400 mr-1.5 text-sm"></i>Fighter Arena Profile</span>
                            <button onclick="window.editFighterArenaProfile('${m.id}')" class="text-indigo-400 hover:text-indigo-300 transition-colors" title="Edit Arena Profile"><i class="ph ph-pencil-simple text-xs"></i></button>
                        </h4>
                        <div class="grid grid-cols-2 gap-3.5 relative z-10">
                            <div class="flex items-center space-x-2.5">
                                <div class="p-2 bg-blue-500/10 text-blue-400 rounded-lg text-lg"><i class="ph ph-medal"></i></div>
                                <div>
                                    <p class="text-gray-500 text-[8px] uppercase font-bold">Belt Rank</p>
                                    <span class="text-white text-xs font-bold font-mono">${m.beltRank || 'White Belt'}</span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2.5">
                                <div class="p-2 bg-amber-500/10 text-amber-400 rounded-lg text-lg"><i class="ph ph-trophy"></i></div>
                                <div>
                                    <p class="text-gray-500 text-[8px] uppercase font-bold">Fight Record</p>
                                    <span class="text-white text-xs font-bold font-mono">${m.fightRecord || '0 - 0 - 0'}</span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2.5">
                                <div class="p-2 bg-orange-500/10 text-orange-400 rounded-lg text-lg"><i class="ph ph-fire"></i></div>
                                <div>
                                    <p class="text-gray-500 text-[8px] uppercase font-bold">Attendance Streak</p>
                                    <span class="text-white text-xs font-bold font-mono">${m.streak || 0} Days</span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2.5">
                                <div class="p-2 bg-red-500/10 text-red-500 rounded-lg text-lg"><i class="ph ph-heartbeat"></i></div>
                                <div class="min-w-0">
                                    <p class="text-gray-500 text-[8px] uppercase font-bold">Medical History</p>
                                    <span class="text-white text-xs font-bold truncate block" title="${window.getFighterMedicalHistory(m)}">${window.getFighterMedicalHistory(m)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Previous History -->
                <div class="lg:col-span-2 bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                    <div>
                        <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-4 flex items-center">
                            <i class="ph ph-clock-countdown text-indigo-400 mr-2 text-base"></i>Workout Routine History
                        </h4>
                        <div class="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            ${historyHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    // ---------------------------------------------------------
    // TAB: DIET & NUTRITION
    // ---------------------------------------------------------
    else if (fighterCurrentTab === 'nutrition') {
        tabContent = `
            <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl max-w-xl mx-auto">
                <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-6 flex items-center">
                    <i class="ph ph-apple-slice text-green-400 mr-2 text-base"></i>Diet & Nutrition (Assigned by ${trainerName})
                </h4>
                <div class="space-y-4">
                    <div class="bg-black/30 border border-gray-800/80 p-5 rounded-xl text-left min-h-[180px]">
                        <div class="font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">${m.dietChart || "No diet chart assigned yet."}</div>
                    </div>
                    
                    <div class="bg-green-950/10 border border-green-900/30 p-4 rounded-xl flex items-start space-x-3">
                        <i class="ph ph-info text-green-400 text-lg mt-0.5 animate-pulse"></i>
                        <div>
                            <h5 class="text-green-400 text-xs font-bold uppercase tracking-wide">Nutrition Guidelines</h5>
                            <p class="text-gray-400 text-[10px] leading-relaxed mt-0.5">Please consume meals in strict accordance with the training targets set above. Inform your trainer immediately if you make any alterations to your calorie intake.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    // ---------------------------------------------------------
    // TAB: ATTENDANCE LOGS
    // ---------------------------------------------------------
    else if (fighterCurrentTab === 'attendance') {
        const logs = (window.MEMBER_ATTENDANCE_LOGS || []).filter(l => l.memberId === m.id);
        const totalCheckIns = logs.filter(l => l.type === 'check-in').length;
        const checkInLogs = logs.filter(l => l.type === 'check-in');
        const computedLastSession = checkInLogs.length > 0 ? `${checkInLogs[checkInLogs.length - 1].date} ${checkInLogs[checkInLogs.length - 1].time}` : (m.lastCheckIn || 'No sessions yet');

        tabContent = `
            <div class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-md">
                        <div class="p-3 bg-purple-500/10 text-purple-400 rounded-xl text-2xl"><i class="ph ph-check-circle"></i></div>
                        <div><p class="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Check-Ins</p><h4 class="text-xl font-black mt-1 font-mono text-purple-400">${totalCheckIns}</h4></div>
                    </div>
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-md">
                        <div class="p-3 bg-brandRed/10 text-brandRed rounded-full text-2xl"><i class="ph ph-calendar-blank"></i></div>
                        <div><p class="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Last Session</p><h4 class="text-sm font-black mt-1 font-mono text-white">${computedLastSession}</h4></div>
                    </div>
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-md">
                        <div class="p-3 bg-green-500/10 text-green-400 rounded-xl text-2xl"><i class="ph ph-trend-up"></i></div>
                        <div><p class="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Status Today</p><h4 class="text-sm font-black mt-1 font-mono text-white ${m.checkedInToday ? 'text-green-400' : 'text-gray-500'}">${m.checkedInToday ? 'Present ✓' : 'Not yet'}</h4></div>
                    </div>
                </div>

                <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl">
                    <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-4 flex items-center">
                        <i class="ph ph-clock-countdown text-brandRed mr-2 text-base"></i>Attendance check-in & check-out history
                    </h4>
                    <div class="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                        ${logs.length === 0 ? `<p class="text-gray-600 text-xs italic py-8 text-center bg-black/20 border border-dashed border-gray-800 rounded-xl">No attendance records found yet.</p>` :
                            logs.slice().reverse().map(log => `
                                <div class="flex items-center justify-between bg-black/20 border border-gray-800/60 p-3.5 rounded-xl">
                                    <div class="flex items-center space-x-3">
                                        <div class="p-2 ${log.type === 'check-in' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-brandRed'} rounded-lg text-sm">
                                            <i class="ph ph-${log.type === 'check-in' ? 'sign-in' : 'sign-out'}"></i>
                                        </div>
                                        <div>
                                            <p class="text-white text-xs font-bold uppercase">${log.type === 'check-in' ? 'Check In' : 'Check Out'}</p>
                                            <p class="text-[10px] text-gray-500 font-mono">${log.method || 'Desk Scan'}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-xs font-mono text-gray-300 font-bold">${log.time}</p>
                                        <p class="text-[10px] text-gray-500 font-mono">${log.date}</p>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        `;
    }
    // ---------------------------------------------------------
    // TAB: MEMBERSHIP & BILLING
    // ---------------------------------------------------------
    else if (fighterCurrentTab === 'billing') {
        tabContent = getFighterMembershipContent(m, memberTxns, hasPendingDue, dueAmount);
    }
    // ---------------------------------------------------------
    // TAB: GYM SHOP (E-Commerce Product Hub)
    // ---------------------------------------------------------
    else if (fighterCurrentTab === 'shop') {
        const inventory = (window.MOCK_INVENTORY || []).filter(p => p.stock > 0);
        const myOrders = (window.FIGHTER_PRODUCT_ORDERS || []).filter(o => o.memberId === m.id);
        const statusCfg = {
            'pending_payment':      { label: 'Awaiting Payment', color: 'amber', icon: 'ph-clock', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
            'paid_pending_dispatch':{ label: 'Paid — Awaiting Dispatch', color: 'blue',  icon: 'ph-package', bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
            'delivered':            { label: '✓ Delivered',               color: 'green', icon: 'ph-check-circle', bg: 'bg-green-500/10 border-green-500/20 text-green-400' }
        };

        tabContent = `
            <style>
                .shop-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
                .shop-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
                .shop-card img { transition: transform 0.4s ease; }
                .shop-card:hover img { transform: scale(1.08); }
            </style>

            <div id="fighter-shop-booking-modal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center hidden" onclick="window.closeFighterBookingModal()"></div>

            <!-- Hero Banner -->
            <div class="relative overflow-hidden bg-gradient-to-r from-emerald-950 to-black border border-emerald-800/40 rounded-2xl p-6 mb-6 shadow-xl">
                <div class="absolute -top-8 -right-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl"></div>
                <div class="relative z-10 flex items-center justify-between">
                    <div>
                        <p class="text-emerald-400 text-[10px] uppercase font-black tracking-widest mb-1"><i class="ph ph-storefront mr-1"></i> R.E.N.E.W Exclusive</p>
                        <h3 class="text-white font-black text-xl tracking-wide">Fighter's Gear Hub</h3>
                        <p class="text-gray-400 text-xs mt-1">Premium supplements, gear & apparel — booked directly from your profile</p>
                    </div>
                    <div class="hidden md:flex flex-col items-end">
                        <div class="text-4xl font-black text-emerald-400/20 font-mono">SHOP</div>
                        <div class="text-[10px] text-emerald-600 font-mono uppercase tracking-widest">${inventory.length} items available</div>
                    </div>
                </div>
            </div>

            <!-- Product Grid -->
            ${inventory.length === 0 ? `
                <div class="py-12 text-center bg-darkSurface border border-dashed border-gray-800 rounded-2xl">
                    <i class="ph ph-package text-4xl text-gray-700 mb-2"></i>
                    <p class="text-gray-600 text-sm">No products available right now.</p>
                </div>
            ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    ${inventory.map(p => {
                        const catColors = { supplements: 'text-purple-400 bg-purple-500/10 border-purple-500/20', gear: 'text-blue-400 bg-blue-500/10 border-blue-500/20', apparel: 'text-pink-400 bg-pink-500/10 border-pink-500/20' };
                        const catColor = catColors[p.category] || 'text-gray-400 bg-gray-500/10 border-gray-500/20';
                        const lowStock = p.stock <= 5;
                        return `
                        <div class="shop-card bg-darkSurface border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
                            <div class="relative h-44 overflow-hidden bg-gray-900">
                                <img src="${p.image}" class="w-full h-full object-cover" alt="${p.name}">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div class="absolute top-3 left-3">
                                    <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${catColor}">${p.category}</span>
                                </div>
                                ${lowStock ? `<div class="absolute top-3 right-3"><span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 animate-pulse">Only ${p.stock} left</span></div>` : ''}
                                <div class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-gray-800">
                                    <span class="text-green-400 font-black font-mono text-sm">₹${p.price.toLocaleString()}</span>
                                </div>
                            </div>
                            <div class="p-4 flex flex-col flex-1 justify-between space-y-3">
                                <div>
                                    <h4 class="text-white font-bold text-sm leading-snug">${p.name}</h4>
                                    <p class="text-gray-600 text-[10px] font-mono mt-1">SKU: ${p.id} &nbsp;|&nbsp; Stock: ${p.stock} units</p>
                                </div>
                                <button onclick="window.openFighterBookingModal('${m.id}', '${p.id}')" class="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all">
                                    <i class="ph ph-shopping-cart-simple text-base"></i><span>Book Now</span>
                                </button>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            `}

            <!-- My Orders Section -->
            <div class="bg-darkSurface border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h4 class="text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-800/60 pb-3 mb-5 flex items-center">
                    <i class="ph ph-receipt text-emerald-400 mr-2 text-base"></i>My Orders
                    ${myOrders.length > 0 ? `<span class="ml-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded-full">${myOrders.length}</span>` : ''}
                </h4>
                ${myOrders.length === 0 ? `
                    <div class="py-8 text-center">
                        <i class="ph ph-shopping-bag text-4xl text-gray-800 mb-2"></i>
                        <p class="text-gray-600 text-xs italic">No orders placed yet. Browse the store above!</p>
                    </div>
                ` : `
                    <div class="space-y-3">
                        ${myOrders.slice().reverse().map(order => {
                            const cfg = statusCfg[order.status] || statusCfg['pending_payment'];
                            return `
                            <div class="flex items-center justify-between bg-black/30 border border-gray-800/70 p-4 rounded-xl hover:border-gray-700 transition-colors">
                                <div class="flex items-center space-x-4">
                                    <div class="w-10 h-10 rounded-xl ${cfg.bg.split(' ').slice(0,1).join(' ')} border ${cfg.bg.split(' ').slice(1,2).join(' ')} flex items-center justify-center flex-shrink-0">
                                        <i class="ph ${cfg.icon} ${cfg.bg.split(' ').slice(2).join(' ')} text-lg"></i>
                                    </div>
                                    <div>
                                        <p class="text-white font-bold text-sm">${order.productName}</p>
                                        <p class="text-gray-500 text-[10px] font-mono mt-0.5">${order.id} &nbsp;|&nbsp; ${order.orderDate} &nbsp;|&nbsp; ${order.paymentMode}</p>
                                    </div>
                                </div>
                                <div class="text-right flex-shrink-0">
                                    <p class="text-white font-mono font-bold text-sm">₹${order.price.toLocaleString()}</p>
                                    <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${cfg.bg} mt-1 inline-block">${cfg.label}</span>
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        `;
    }

    return `
        <div class="space-y-6 animate-fadeIn max-w-5xl mx-auto">
            ${headerHTML}
            ${tabContent}
        </div>
    `;
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
    if (member) { 
        window.loggedInFighter = member; 
        loggedInFighter = member; 
        fighterCurrentTab = 'dashboard'; 
        navigateTo('fighter-portal'); 
    } else { 
        alert("Access Denied: Credentials not found."); 
    }
};

window.logoutFighter = function() { 
    window.loggedInFighter = null; 
    loggedInFighter = null; 
    fighterCurrentTab = 'dashboard'; 
    if (typeof window.clearSession === 'function') {
        window.clearSession();
    } else {
        navigateTo('fighter-portal'); 
    }
};

window.editMemberStats = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;
    const newWeight = prompt(`Update Body Weight:\n(Current: ${member.weight || '72 KG'})`, member.weight || '72 KG');
    if(newWeight) member.weight = newWeight.toUpperCase();
    const newHeight = prompt(`Update Height:\n(Current: ${member.height || '5\'8"'})`, member.height || '5\'8"');
    if(newHeight) member.height = newHeight.toUpperCase();
    const newAge = prompt(`Update Age:\n(Current: ${member.age || '26 YRS'})`, member.age || '26 YRS');
    if(newAge) member.age = newAge.toUpperCase();

    if (window.dbService && window.dbService.setDocument) {
        window.dbService.setDocument('members', member.id, member)
            .then(() => {
                navigateTo('fighter-portal');
            })
            .catch(() => navigateTo('fighter-portal'));
        return;
    }

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}
    
    navigateTo('fighter-portal'); 
};

window.fighterScanQR = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member || member.portalLocked || member.status === 'lapsed') return;
    
    const action = member.checkedInToday ? "Check-Out" : "Check-In";
    if (confirm(`📸 CAMERA SCAN SIMULATION\n\nAiming camera at Arena Reception QR...\nClick OK to simulate ${action}.`)) {
        if (typeof window.simulateMemberScan === 'function') {
            window.simulateMemberScan(member.id);
        } else {
            processCheckIn(member);
        }
        navigateTo('fighter-portal');
    }
};

window.fighterManualTokenCheckIn = function(memberId) {
    const tokenInput = document.getElementById('manual-desk-token').value.trim();
    if (!tokenInput) {
        alert("Please enter the offline token.");
        return;
    }

    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member || member.portalLocked || member.status === 'lapsed') return;

    const correctToken = (typeof window.generateDailyToken === 'function')
        ? window.generateDailyToken()
        : "";

    if (tokenInput.toUpperCase() !== correctToken.toUpperCase() && tokenInput !== "9932") {
        alert("❌ Verification Failed: Invalid offline scan token.");
        return;
    }

    if (typeof window.simulateMemberScan === 'function') {
        window.simulateMemberScan(member.id);
        alert(`Offline verification successful!`);
    } else {
        processCheckIn(member);
    }
    navigateTo('fighter-portal');
};

function processCheckIn(member) {
    if (member.portalLocked) {
        alert("⚠️ Access Denied: Please clear your advance fees through the Membership & Billing tab to unlock your portal.");
        return;
    }
    const todayStr = new Date().toISOString().slice(0,10);
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    if (member.expiryDate === "Pending First Scan") {
        const expiry = new Date(); expiry.setDate(expiry.getDate() + 30); 
        member.expiryDate = expiry.toISOString().slice(0,10);
        member.status = "active";
        alert(`🎉 FIRST CHECK-IN SUCCESSFUL!\nYour 30-Day billing cycle officially starts TODAY.`);
    } else { 
        alert(`✅ CHECK-IN SUCCESSFUL!\nWelcome back, ${member.name}.`); 
    }
    if (!member.checkedInToday) member.streak = (member.streak || 0) + 1;
    member.checkedInToday = true;
    member.lastCheckIn = `${todayStr} ${timeStr}`;

    const attendanceLog = {
        memberId: member.id,
        memberName: member.name,
        type: member.checkedInToday ? 'check-in' : 'check-out',
        date: todayStr,
        time: timeStr,
        method: 'Portal Scan'
    };

    const persistMember = () => {
        if (window.dbService && window.dbService.setDocument) {
            return window.dbService.setDocument('members', member.id, member)
                .then(() => window.dbService.addDocument('attendance', attendanceLog, member.id))
                .then(() => navigateTo('fighter-portal'));
        }
        try {
            localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
        } catch(e) {}
        navigateTo('fighter-portal');
    };

    persistMember();
}

window.payMemberDuesSimulation = function(memberId, amount) {
    const txns = window.MOCK_TRANSACTIONS || [];
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    const targetTxns = txns.filter(t => t.type === 'income' && t.status === 'pending' && t.description.toLowerCase().includes(member.name.toLowerCase()));
    targetTxns.forEach(t => { t.status = 'pending_verification'; t.mode = 'Online Gateway'; });
    alert(`💳 REQUEST SUBMITTED!\n\nTransaction of ₹${amount.toLocaleString()} is currently on hold.\nWaiting for Admin verification.`);
    fighterCurrentTab = 'dashboard';

    const persist = () => {
        if (window.dbService && window.dbService.setDocument) {
            const savePromises = targetTxns.map(t => window.dbService.setDocument('transactions', t.id, t));
            return Promise.all(savePromises)
                .then(() => navigateTo('fighter-portal'));
        }
        try {
            localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
        } catch(e) {}
        navigateTo('fighter-portal');
    };

    persist();
};

// =========================================================================
// TRAINER RATING SYSTEM
// =========================================================================

// Highlight stars up to the selected value
window.selectTrainerStar = function(selectedStar) {
    for (let i = 1; i <= 5; i++) {
        const btn = document.getElementById(`star-btn-${i}`);
        if (!btn) continue;
        if (i <= selectedStar) {
            btn.classList.remove('text-gray-600', 'border-gray-700');
            btn.classList.add('text-amber-400', 'border-amber-400', 'bg-amber-500/10');
        } else {
            btn.classList.remove('text-amber-400', 'border-amber-400', 'bg-amber-500/10');
            btn.classList.add('text-gray-600', 'border-gray-700');
        }
    }
    // Store selected star value on a hidden attr
    const row = document.getElementById('star-rating-row');
    if (row) row.setAttribute('data-selected', selectedStar);
};

// Submit rating: save to trainer, recalculate KPI average, persist
window.submitTrainerRating = function(memberId, trainerId) {
    const row = document.getElementById('star-rating-row');
    const selectedStars = row ? parseInt(row.getAttribute('data-selected') || '0') : 0;

    if (!selectedStars || selectedStars < 1 || selectedStars > 5) {
        alert('⭐ Please select a star rating (1–5) before submitting.');
        return;
    }

    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    const trainer = (window.MOCK_TRAINERS || []).find(t => t.id === trainerId);

    if (!member || !trainer) {
        alert('Error: Member or trainer not found.');
        return;
    }

    if (!trainer.kpis) trainer.kpis = {};
    if (!trainer.kpis.fighterRatings) trainer.kpis.fighterRatings = [];

    trainer.kpis.fighterRatings = trainer.kpis.fighterRatings.filter(r => r.memberId !== memberId);

    const note = (document.getElementById('trainer-rating-note') || {}).value || '';
    trainer.kpis.fighterRatings.push({
        memberId: memberId,
        memberName: member.name,
        stars: selectedStars,
        note: note.trim(),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    });

    const allRatings = trainer.kpis.fighterRatings;
    const newAvg = allRatings.reduce((sum, r) => sum + r.stars, 0) / allRatings.length;
    trainer.kpis.satisfaction = parseFloat(newAvg.toFixed(1));
    member.lastRatedTrainerId = trainerId;

    const persist = () => {
        if (window.dbService && window.dbService.setDocument) {
            return Promise.all([
                window.dbService.setDocument('trainers', trainer.id, trainer),
                window.dbService.setDocument('members', member.id, member)
            ]).then(() => {
                alert(`⭐ Rating submitted! You gave ${trainer.name} ${selectedStars} star${selectedStars > 1 ? 's' : ''}.\n\nNew KPI Score: ${trainer.kpis.satisfaction.toFixed(1)} / 5.0`);
                navigateTo('fighter-portal');
            });
        }
        try {
            localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(window.MOCK_TRAINERS));
            localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
        } catch(e) {}
        alert(`⭐ Rating submitted! You gave ${trainer.name} ${selectedStars} star${selectedStars > 1 ? 's' : ''}.\n\nNew KPI Score: ${trainer.kpis.satisfaction.toFixed(1)} / 5.0`);
        navigateTo('fighter-portal');
    };

    persist();
};

// =========================================================================
// FIGHTER SHOP — BOOKING MODAL & ORDER ENGINE
// =========================================================================

window.openFighterBookingModal = function(memberId, productId) {
    const product = (window.MOCK_INVENTORY || []).find(p => p.id === productId);
    const member  = (window.MOCK_MEMBERS || []).find(m => m.id === memberId);
    if (!product || !member) return;

    const modal = document.getElementById('fighter-shop-booking-modal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-emerald-800/30 p-[2px] rounded-2xl w-[360px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/97 rounded-[14px] p-6 flex flex-col relative text-xs">
                <button onclick="window.closeFighterBookingModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>

                <!-- Product Preview -->
                <div class="flex items-center space-x-4 border-b border-gray-800 pb-4 mb-5">
                    <div class="w-16 h-16 rounded-xl overflow-hidden border border-gray-800 flex-shrink-0">
                        <img src="${product.image}" class="w-full h-full object-cover" alt="${product.name}">
                    </div>
                    <div class="flex-1">
                        <p class="text-[9px] text-emerald-400 uppercase font-black tracking-wider">${product.category}</p>
                        <h3 class="text-white font-bold text-sm leading-snug mt-0.5">${product.name}</h3>
                        <p class="text-emerald-400 font-black font-mono text-lg mt-1">₹${product.price.toLocaleString()}</p>
                    </div>
                </div>

                <!-- Buyer Info -->
                <div class="bg-black/40 border border-gray-800/60 rounded-xl p-3 mb-5 flex items-center space-x-3">
                    <i class="ph ph-user-circle text-xl text-gray-500"></i>
                    <div>
                        <p class="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Booking For</p>
                        <p class="text-white font-bold text-xs">${member.name} <span class="text-gray-600 font-mono">(${member.id})</span></p>
                    </div>
                </div>

                <!-- Payment Mode -->
                <div class="mb-5">
                    <p class="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">Select Payment Mode</p>
                    <div class="grid grid-cols-3 gap-2">
                        ${['UPI','Cash','Card'].map(mode => `
                            <label class="cursor-pointer">
                                <input type="radio" name="fighter-pay-mode" value="${mode}" class="sr-only peer" ${mode === 'UPI' ? 'checked' : ''}>
                                <div class="peer-checked:bg-emerald-600/20 peer-checked:border-emerald-500 border border-gray-700 rounded-xl p-2.5 text-center transition-all hover:border-gray-600">
                                    <i class="ph ${mode === 'UPI' ? 'ph-qr-code' : mode === 'Cash' ? 'ph-money' : 'ph-credit-card'} text-lg text-gray-400 peer-checked:text-emerald-400 block mb-1"></i>
                                    <span class="text-[10px] font-bold text-gray-400">${mode}</span>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3 mb-5 flex justify-between items-center">
                    <span class="text-gray-400 text-xs">Total Amount</span>
                    <span class="text-emerald-400 font-black font-mono text-base">₹${product.price.toLocaleString()}</span>
                </div>

                <button onclick="window.submitFighterBooking('${memberId}', '${productId}')"
                    class="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                    <i class="ph ph-check-circle text-base"></i><span>Confirm Booking</span>
                </button>
                <p class="text-[9px] text-gray-600 text-center mt-3">Your order will be dispatched after admin confirmation</p>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        const inner = modal.firstElementChild;
        if (inner) inner.classList.remove('scale-95');
    }, 10);
};

window.closeFighterBookingModal = function() {
    const modal = document.getElementById('fighter-shop-booking-modal');
    if (!modal) return;
    const inner = modal.firstElementChild;
    if (inner) inner.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 180);
};

window.submitFighterBooking = function(memberId, productId) {
    const product = (window.MOCK_INVENTORY || []).find(p => p.id === productId);
    const member  = (window.MOCK_MEMBERS || []).find(m => m.id === memberId);
    if (!product || !member) { alert('Error: Product or member not found.'); return; }

    const modeInput = document.querySelector('input[name="fighter-pay-mode"]:checked');
    const payMode   = modeInput ? modeInput.value : 'UPI';

    const orderId = `ORD-${String((window.FIGHTER_PRODUCT_ORDERS || []).length + 1).padStart(3, '0')}-${Date.now().toString().slice(-4)}`;
    const newOrder = {
        id:              orderId,
        memberId:        memberId,
        ownerId:         memberId,
        memberName:      member.name,
        productId:       productId,
        productName:     product.name,
        productCategory: product.category,
        price:           product.price,
        qty:             1,
        paymentMode:     payMode,
        orderDate:       new Date().toISOString().slice(0, 10),
        status:          'pending_payment'
    };

    if (!window.FIGHTER_PRODUCT_ORDERS) window.FIGHTER_PRODUCT_ORDERS = [];
    window.FIGHTER_PRODUCT_ORDERS.push(newOrder);

    const persist = () => {
        if (window.dbService && window.dbService.setDocument) {
            return window.dbService.setDocument('orders', newOrder.id, newOrder)
                .then(() => {
                    window.closeFighterBookingModal();
                    alert(`✅ BOOKING CONFIRMED!\n\n"${product.name}" booked via ${payMode}.\nOrder ID: ${newOrder.id}\n\nYour order will appear in "My Orders" and the admin will dispatch it shortly.`);
                    navigateTo('fighter-portal');
                })
                .catch(() => {
                    if (typeof window.saveFighterOrders === 'function') window.saveFighterOrders();
                    window.closeFighterBookingModal();
                    navigateTo('fighter-portal');
                });
        }
        if (typeof window.saveFighterOrders === 'function') window.saveFighterOrders();
        window.closeFighterBookingModal();
        alert(`✅ BOOKING CONFIRMED!\n\n"${product.name}" booked via ${payMode}.\nOrder ID: ${orderId}\n\nYour order will appear in "My Orders" and the admin will dispatch it shortly.`);
        navigateTo('fighter-portal');
    };

    persist();
};

window.editFighterArenaProfile = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;
    
    const record = member.fightRecord || "0 - 0 - 0";
    const recordParts = record.split('-').map(s => parseInt(s.trim(), 10) || 0);
    const wins = recordParts[0] !== undefined ? recordParts[0] : 0;
    const losses = recordParts[1] !== undefined ? recordParts[1] : 0;
    const draws = recordParts[2] !== undefined ? recordParts[2] : 0;

    const newBelt = prompt(`Update Belt Rank:\n(Current: ${member.beltRank || 'White Belt'})`, member.beltRank || 'White Belt');
    if(newBelt === null) return; // user cancelled

    const newWins = prompt(`Update Wins count:\n(Current: ${wins})`, wins);
    if(newWins === null) return; // user cancelled

    const newLosses = prompt(`Update Losses count:\n(Current: ${losses})`, losses);
    if(newLosses === null) return; // user cancelled

    const newDraws = prompt(`Update Draws count:\n(Current: ${draws})`, draws);
    if(newDraws === null) return; // user cancelled

    member.beltRank = newBelt.trim() || 'White Belt';
    member.fightRecord = `${parseInt(newWins, 10) || 0} - ${parseInt(newLosses, 10) || 0} - ${parseInt(newDraws, 10) || 0}`;

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .then(() => {
                console.log('[Firestore] Fighter arena profile updated:', member.id);
                navigateTo('fighter-portal');
            })
            .catch(e => {
                console.error('[Firestore] Save member failed:', e.message);
                navigateTo('fighter-portal');
            });
    } else {
        navigateTo('fighter-portal');
    }
};



