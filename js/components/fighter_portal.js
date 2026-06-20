// =========================================================================
// js/components/fighter_portal.js — FIGHTER PORTAL HUB (DEMO)
// =========================================================================

let fighterCurrentTab = 'dashboard';

function getFighterPortalView() {
    const fighter = window.loggedInFighter;

    if (!fighter) {
        return `
            <div class="h-[80vh] flex items-center justify-center">
                <div class="bg-darkSurface border border-gray-800 p-8 rounded-2xl shadow-2xl w-[380px] text-center relative overflow-hidden group">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-brandRed/10 rounded-full blur-3xl group-hover:bg-brandRed/20 transition-all"></div>
                    <div class="w-16 h-16 bg-brandRed/10 text-brandRed rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-brandRed/20 shadow-[0_0_15px_rgba(255,0,51,0.2)]">
                        <i class="ph ph-user-focus text-3xl"></i>
                    </div>
                    <h2 class="text-white font-black text-xl tracking-widest uppercase mb-1">Fighter Gateway</h2>
                    <p class="text-gray-500 text-[10px] uppercase tracking-wider mb-8">Enter your Member ID or Email</p>
                    
                    <div class="space-y-4 mb-6">
                        <input type="text" id="fighter-portal-login-input" placeholder="e.g. m-001 or subham@gmail.com" class="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white text-center font-mono focus:outline-none focus:border-brandRed text-sm transition-colors">
                    </div>
                    
                    <button onclick="window.loginFighterPortal()" class="w-full bg-gradient-to-r from-brandRed to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,51,0.2)] transition-all text-xs">
                        Access Fighter Hub
                    </button>
                    
                    <div class="mt-6 text-[10px] text-gray-500 border-t border-gray-800/60 pt-4">
                        Demo Accounts: <span class="text-brandRed font-mono">m-001</span> (Subham Das) or <span class="text-brandRed font-mono">m-003</span> (Sourav Ganguly)
                    </div>
                </div>
            </div>
        `;
    }

    const f = fighter;
    const trainer = (window.MOCK_TRAINERS || []).find(t => t.id === f.trainerId);
    const myLogs = (window.MEMBER_ATTENDANCE_LOGS || []).filter(l => l.memberId === f.id);

    // Calculate days remaining
    let daysRemaining = '--';
    let expiryBadgeClass = 'text-gray-400';
    if (f.expiryDate && !f.expiryDate.includes('Pending')) {
        const expiry = new Date(f.expiryDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        daysRemaining = diff;
        if (diff <= 7) expiryBadgeClass = 'text-red-400';
        else if (diff <= 15) expiryBadgeClass = 'text-amber-400';
        else expiryBadgeClass = 'text-green-400';
    }

    // Status badge
    const statusBadgeMap = {
        active: '<span class="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase flex items-center"><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>Active</span>',
        expiring: '<span class="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Expiring Soon</span>',
        inactive: '<span class="text-[10px] bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Inactive</span>',
        at_risk: '<span class="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">At Risk</span>',
    };
    const statusBadge = statusBadgeMap[f.status] || statusBadgeMap['inactive'];

    // Tab nav
    const tabsHTML = `
        <div class="flex flex-wrap gap-2 bg-black/40 p-1.5 rounded-xl w-full mb-6 border border-gray-800 shadow-inner">
            <button onclick="window.switchFighterPortalTab('dashboard')" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'dashboard' ? 'bg-brandRed text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-squares-four mr-1.5"></i> My Hub</button>
            <button onclick="window.switchFighterPortalTab('attendance')" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'attendance' ? 'bg-brandRed text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-calendar-check mr-1.5"></i> Attendance</button>
            <button onclick="window.switchFighterPortalTab('profile')" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center ${fighterCurrentTab === 'profile' ? 'bg-brandRed text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-user-gear mr-1.5"></i> Profile</button>
        </div>
    `;

    // Header card
    const headerHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-darkSurface border border-gray-800 p-5 rounded-2xl shadow-xl mb-6">
            <div class="flex items-center space-x-4">
                <img src="${f.photoUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}" class="w-12 h-12 rounded-xl object-cover border border-gray-800 shadow-md">
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 class="text-white font-bold text-base tracking-wide">${f.name}</h3>
                        ${statusBadge}
                    </div>
                    <p class="text-xs text-gray-500 font-mono mt-0.5">${f.email} | Plan: ${f.plan}</p>
                </div>
            </div>
            <button onclick="window.logoutFighterPortal()" class="bg-black/50 border border-gray-800 hover:bg-brandRed/20 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"><i class="ph ph-sign-out text-base"></i><span>Logout</span></button>
        </div>
        ${tabsHTML}
    `;

    let tabContent = '';

    if (fighterCurrentTab === 'dashboard') {
        tabContent = `
            <div class="space-y-6">
                ${headerHTML}
                
                <!-- Membership Status Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-md">
                        <div class="p-3 bg-brandRed/10 text-brandRed rounded-xl text-2xl"><i class="ph ph-identification-card"></i></div>
                        <div><p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Member ID</p><h4 class="text-sm font-black mt-1 font-mono text-white">${f.id.toUpperCase()}</h4></div>
                    </div>
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-md">
                        <div class="p-3 bg-green-500/10 text-green-400 rounded-xl text-2xl"><i class="ph ph-calendar-blank"></i></div>
                        <div><p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Plan Expiry</p><h4 class="text-sm font-black mt-1 font-mono ${expiryBadgeClass}">${f.expiryDate}</h4></div>
                    </div>
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-md">
                        <div class="p-3 bg-amber-500/10 text-amber-400 rounded-xl text-2xl"><i class="ph ph-timer"></i></div>
                        <div><p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Days Remaining</p><h4 class="text-xl font-black mt-1 font-mono ${expiryBadgeClass}">${daysRemaining}</h4></div>
                    </div>
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-md">
                        <div class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl text-2xl"><i class="ph ph-barbell"></i></div>
                        <div><p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Trainer</p><h4 class="text-sm font-black mt-1 font-mono text-white">${trainer ? trainer.name : 'Not Assigned'}</h4></div>
                    </div>
                </div>

                <!-- Membership Card + Today Status -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <!-- Membership Card -->
                    <div class="lg:col-span-2 bg-gradient-to-br from-gray-900 via-black to-brandRed/5 border border-brandRed/20 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-48 h-48 bg-brandRed/5 rounded-full blur-3xl"></div>
                        <div class="relative z-10">
                            <div class="flex justify-between items-start mb-6">
                                <div>
                                    <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">R.E.N.E.W Membership</p>
                                    <h3 class="text-white font-black text-xl tracking-wider mt-1">${f.name}</h3>
                                </div>
                                <div class="bg-brandRed px-3 py-1 rounded text-white font-bold tracking-wider text-xs shadow-md">R.E.N.E.W</div>
                            </div>
                            <div class="grid grid-cols-3 gap-4 mb-6">
                                <div>
                                    <p class="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">Plan</p>
                                    <p class="text-xs text-gray-300 font-mono font-bold">${f.plan}</p>
                                </div>
                                <div>
                                    <p class="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">Member Since</p>
                                    <p class="text-xs text-gray-300 font-mono font-bold">${f.registrationDate || 'N/A'}</p>
                                </div>
                                <div>
                                    <p class="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">Expiry</p>
                                    <p class="text-xs font-mono font-bold ${expiryBadgeClass}">${f.expiryDate}</p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between border-t border-gray-800/60 pt-4">
                                <p class="text-[10px] text-gray-500 font-mono uppercase tracking-widest">${f.id.toUpperCase()}</p>
                                ${f.checkedInToday 
                                    ? `<span class="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full font-bold uppercase flex items-center"><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>Checked In Today</span>`
                                    : `<span class="text-[10px] bg-gray-800 text-gray-500 border border-gray-700 px-2 py-1 rounded-full font-bold uppercase">Not Checked In</span>`
                                }
                            </div>
                        </div>
                    </div>

                    <!-- Trainer Info -->
                    <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                        <div>
                            <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-4 flex items-center">
                                <i class="ph ph-barbell text-brandRed mr-2 text-base"></i>My Trainer
                            </h4>
                            ${trainer ? `
                                <div class="flex flex-col items-center text-center space-y-3">
                                    <img src="${trainer.photoUrl}" class="w-16 h-16 rounded-full border-2 border-brandRed/30 object-cover shadow-lg">
                                    <div>
                                        <h5 class="text-white font-bold text-sm">${trainer.name}</h5>
                                        <p class="text-[10px] text-gray-500 font-mono mt-0.5">${trainer.email}</p>
                                        <p class="text-[10px] text-gray-500 font-mono">${trainer.phone}</p>
                                    </div>
                                    <div class="flex items-center space-x-1 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold">
                                        <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        <span>Active Trainer</span>
                                    </div>
                                </div>
                            ` : `
                                <div class="flex flex-col items-center text-center space-y-3 py-4">
                                    <div class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl text-gray-600"><i class="ph ph-barbell"></i></div>
                                    <p class="text-gray-600 text-xs italic">No trainer assigned yet.<br>Contact admin for assignment.</p>
                                </div>
                            `}
                        </div>
                        ${f.portalLocked ? `
                            <div class="mt-4 bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-center">
                                <i class="ph ph-lock text-brandRed text-xl"></i>
                                <p class="text-red-400 text-[10px] font-bold uppercase mt-1">Portal Locked</p>
                                <p class="text-gray-600 text-[9px] mt-0.5">Pending admission fee payment</p>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- QR / Token Section -->
                <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl">
                    <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-4 flex items-center">
                        <i class="ph ph-qr-code text-brandRed mr-2 text-base"></i>Daily Check-In Token
                    </h4>
                    <div class="flex flex-col sm:flex-row items-center gap-6">
                        <div class="bg-white p-4 rounded-xl shadow-lg">
                            <div class="w-24 h-24 grid grid-cols-7 gap-0.5">
                                ${Array.from({length: 49}, (_, i) => 
                                    `<div class="w-full h-full ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} rounded-sm"></div>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="flex-1 space-y-3">
                            <div class="bg-black/30 border border-gray-800 p-4 rounded-xl">
                                <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Today's Access Token</p>
                                <p class="text-brandRed font-mono font-black text-lg tracking-widest">${typeof window.generateDailyToken === 'function' ? window.generateDailyToken() : 'RNW-TOKEN'}</p>
                                <p class="text-[9px] text-gray-600 mt-1 font-mono">Valid for today only · Show to desk staff</p>
                            </div>
                            <div class="flex items-center space-x-2 text-xs text-gray-500">
                                <i class="ph ph-info text-base text-indigo-400"></i>
                                <p>Present this token or QR code at the reception desk to mark attendance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    if (fighterCurrentTab === 'attendance') {
        const logs = (window.MEMBER_ATTENDANCE_LOGS || []).filter(l => l.memberId === f.id);
        const totalCheckIns = logs.filter(l => l.type === 'check-in').length;

        tabContent = `
            <div class="space-y-6">
                ${headerHTML}
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4">
                        <div class="p-3 bg-green-500/10 text-green-400 rounded-xl text-2xl"><i class="ph ph-check-circle"></i></div>
                        <div><p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Check-Ins</p><h4 class="text-xl font-black mt-1 font-mono text-green-400">${totalCheckIns}</h4></div>
                    </div>
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4">
                        <div class="p-3 bg-brandRed/10 text-brandRed rounded-xl text-2xl"><i class="ph ph-calendar-blank"></i></div>
                        <div><p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Last Session</p><h4 class="text-sm font-black mt-1 font-mono text-white">${f.lastCheckIn || 'No sessions yet'}</h4></div>
                    </div>
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4">
                        <div class="p-3 bg-amber-500/10 text-amber-400 rounded-xl text-2xl"><i class="ph ph-trend-up"></i></div>
                        <div><p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Status Today</p><h4 class="text-sm font-black mt-1 font-mono ${f.checkedInToday ? 'text-green-400' : 'text-gray-500'}">${f.checkedInToday ? 'Present ✓' : 'Not yet'}</h4></div>
                    </div>
                </div>

                <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl">
                    <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-4 flex items-center">
                        <i class="ph ph-clock-countdown text-brandRed mr-2 text-base"></i>Attendance History
                    </h4>
                    <div class="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                        ${logs.length === 0 ? `<p class="text-gray-600 text-xs italic py-8 text-center">No attendance records found yet.</p>` :
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

    if (fighterCurrentTab === 'profile') {
        tabContent = `
            <div class="space-y-6">
                ${headerHTML}
                <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl max-w-xl mx-auto">
                    <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-6 flex items-center">
                        <i class="ph ph-user-gear text-brandRed mr-2 text-base"></i>My Profile Details
                    </h4>
                    <div class="flex flex-col items-center space-y-4 mb-6">
                        <img src="${f.photoUrl}" class="w-20 h-20 rounded-full border-2 border-brandRed/30 object-cover shadow-xl">
                        <div class="text-center">
                            <h3 class="text-white font-bold text-lg">${f.name}</h3>
                            <p class="text-gray-500 text-xs font-mono">${f.id.toUpperCase()} · ${f.plan}</p>
                        </div>
                    </div>
                    <div class="space-y-3 text-left">
                        <div class="flex justify-between bg-black/30 border border-gray-800/60 p-3.5 rounded-xl">
                            <span class="text-gray-500 text-xs font-bold uppercase tracking-wider">Email</span>
                            <span class="text-gray-300 text-xs font-mono">${f.email}</span>
                        </div>
                        <div class="flex justify-between bg-black/30 border border-gray-800/60 p-3.5 rounded-xl">
                            <span class="text-gray-500 text-xs font-bold uppercase tracking-wider">Phone</span>
                            <span class="text-gray-300 text-xs font-mono">${f.phone}</span>
                        </div>
                        <div class="flex justify-between bg-black/30 border border-gray-800/60 p-3.5 rounded-xl">
                            <span class="text-gray-500 text-xs font-bold uppercase tracking-wider">Membership Plan</span>
                            <span class="text-gray-300 text-xs font-mono">${f.plan}</span>
                        </div>
                        <div class="flex justify-between bg-black/30 border border-gray-800/60 p-3.5 rounded-xl">
                            <span class="text-gray-500 text-xs font-bold uppercase tracking-wider">Registered</span>
                            <span class="text-gray-300 text-xs font-mono">${f.registrationDate || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between bg-black/30 border border-gray-800/60 p-3.5 rounded-xl">
                            <span class="text-gray-500 text-xs font-bold uppercase tracking-wider">Expiry Date</span>
                            <span class="text-xs font-mono font-bold ${expiryBadgeClass}">${f.expiryDate}</span>
                        </div>
                        <div class="flex justify-between bg-black/30 border border-gray-800/60 p-3.5 rounded-xl">
                            <span class="text-gray-500 text-xs font-bold uppercase tracking-wider">Membership Status</span>
                            <span class="text-xs font-mono font-bold capitalize ${f.status === 'active' ? 'text-green-400' : f.status === 'expiring' ? 'text-amber-400' : 'text-gray-500'}">${f.status}</span>
                        </div>
                        <div class="flex justify-between bg-black/30 border border-gray-800/60 p-3.5 rounded-xl">
                            <span class="text-gray-500 text-xs font-bold uppercase tracking-wider">Trainer</span>
                            <span class="text-gray-300 text-xs font-mono">${trainer ? trainer.name : 'Not Assigned'}</span>
                        </div>
                    </div>
                    <p class="text-[10px] text-gray-600 text-center mt-6 font-mono">To update profile details, contact your trainer or admin.</p>
                </div>
            </div>
        `;
    }

    return `
        <div class="space-y-6 animate-fadeIn relative">
            ${tabContent}
        </div>
    `;
}

// =========================================================================
// ACTION TRIGGERS
// =========================================================================

window.switchFighterPortalTab = function(tabName) {
    fighterCurrentTab = tabName;
    navigateTo('fighter-portal');
};

window.loginFighterPortal = function() {
    const val = document.getElementById('fighter-portal-login-input')?.value.trim().toLowerCase();
    if (!val) { alert('Please enter your Member ID or Email.'); return; }

    const members = window.MOCK_MEMBERS || [];
    const matched = members.find(m => m.id.toLowerCase() === val || (m.email && m.email.toLowerCase() === val));

    if (!matched) {
        alert('Access Denied: Member ID or email not found in the system.');
        return;
    }

    if (matched.portalLocked) {
        alert('🔒 Portal Locked: Your portal access is pending admission fee payment. Please contact admin.');
        return;
    }

    window.loggedInFighter = matched;
    fighterCurrentTab = 'dashboard';
    navigateTo('fighter-portal');
};

window.logoutFighterPortal = function() {
    window.loggedInFighter = null;
    fighterCurrentTab = 'dashboard';
    if (typeof window.clearSession === 'function') {
        window.clearSession();
    } else {
        navigateTo('fighter-portal');
    }
};
