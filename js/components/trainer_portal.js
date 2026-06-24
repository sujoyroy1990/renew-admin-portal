// =========================================================================
// js/components/trainer_portal.js — TRAINER PORTAL HUB (DEMO)
// =========================================================================

let loggedInTrainer = null;
let trainerCurrentTab = 'dashboard';

// Pre-populate user's Gemini API key if not set or contains the old failed key
const currentStoredKey = localStorage.getItem('GEMINI_API_KEY');
if (!currentStoredKey || currentStoredKey === 'AQ.Ab8RN6LVGGuYcn7Gzr08rkXRUjmI8CsVUdQ_x8x0JbC7BtmCMA') {
    localStorage.setItem('GEMINI_API_KEY', 'AQ.Ab8RN6KroA6uyJAMjLoDp1eQ_KfoYA9BVvdFC1-Vtq7S31MKSw');
}

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

function getTrainerPortalView() {
    if (!loggedInTrainer) {
        return `
            <div class="h-[80vh] flex items-center justify-center animate-fadeIn">
                <div class="bg-darkSurface border border-gray-800 p-8 rounded-2xl shadow-2xl w-[380px] text-center relative overflow-hidden group">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                    <div class="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <i class="ph ph-barbell text-3xl"></i>
                    </div>
                    <h2 class="text-white font-black text-xl tracking-widest uppercase mb-1">Trainer Gateway</h2>
                    <p class="text-gray-500 text-[10px] uppercase tracking-wider mb-8">Enter Trainer ID or Email</p>
                    
                    <div class="space-y-4 mb-6">
                        <input type="text" id="trainer-portal-login-input" placeholder="e.g. t1 or rajat@gym.com" class="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white text-center font-mono focus:outline-none focus:border-indigo-500 text-sm">
                    </div>
                    
                    <button onclick="window.loginTrainerPortal()" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all text-xs">Access Roster</button>
                    
                    <div class="mt-6 text-[10px] text-gray-500 border-t border-gray-800/60 pt-4">
                        Demo Accounts: <span class="text-indigo-400 font-mono">t1</span> (Rajat Sharma) or <span class="text-indigo-400 font-mono">t2</span> (Vikram Singh)
                    </div>
                </div>
            </div>
        `;
    }

    const t = loggedInTrainer;
    const assignedFighters = window.MOCK_MEMBERS.filter(m => m.trainerId === t.id);

    // Shared revenue engine ব্যবহার করে current month-এর ডেটা নেওয়া হচ্ছে
    const _curMonth = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}`;
    const liveSales = (typeof window.calculateTrainerEarnings === 'function')
        ? window.calculateTrainerEarnings(t.id, _curMonth)
        : { totalRevenue: 0, totalCommission: 0, breakdown: [] };

    const myLogs = window.TRAINER_LOGS.filter(log => log.trainerId === t.id || log.trainerId === 'all');

    const hasLeft = t.todayAttendance.checkOut !== null;
    const hasCheckedIn = t.todayAttendance.checkIn !== "--:--" && t.todayAttendance.checkIn !== null;

    let shiftStatusBadge = "";
    if (hasLeft) {
        shiftStatusBadge = `<span class="text-[10px] bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Shift Ended</span>`;
    } else if (hasCheckedIn) {
        shiftStatusBadge = `<span class="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center"><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>Active Shift</span>`;
    } else {
        shiftStatusBadge = `<span class="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Off Duty</span>`;
    }

    const stars = '★'.repeat(Math.round(t.kpis.satisfaction)) + '☆'.repeat(5 - Math.round(t.kpis.satisfaction));

    const headerHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-darkSurface border border-gray-800 p-5 rounded-2xl shadow-xl mb-6">
            <div class="flex items-center space-x-4">
                <img src="${t.photoUrl || 'https://images.unsplash.com/photo-1597403864947-a85709d7d4c8?w=200'}" class="w-12 h-12 rounded-xl object-cover border border-gray-800 shadow-md">
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 class="text-white font-bold text-base tracking-wide">${t.name}</h3>
                        ${shiftStatusBadge}
                    </div>
                    <p class="text-xs text-gray-500 font-mono mt-0.5">${t.email} | Specialty: ${t.specialty || 'MMA / Fitness'}</p>
                </div>
            </div>
            <button onclick="window.logoutTrainerPortal()" class="bg-black/50 border border-gray-800 hover:bg-brandRed/20 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"><i class="ph ph-sign-out text-base"></i><span>Logout</span></button>
        </div>
        
        <div class="flex flex-wrap gap-2 bg-black/40 p-1.5 rounded-xl w-full mb-6 border border-gray-800 shadow-inner">
            <button onclick="window.switchTrainerPortalTab('dashboard')" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center ${trainerCurrentTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-squares-four mr-1.5"></i> Dashboard Center</button>
            <button onclick="window.switchTrainerPortalTab('work-schedule')" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center ${trainerCurrentTab === 'work-schedule' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-calendar-blank mr-1.5"></i> Work Schedule</button>
            <button onclick="window.switchTrainerPortalTab('nutrition')" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center ${trainerCurrentTab === 'nutrition' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-apple-slice mr-1.5"></i> Nutrition Plan</button>
            <button onclick="window.switchTrainerPortalTab('logs')" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center ${trainerCurrentTab === 'logs' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}">
                <i class="ph ph-bell mr-1.5"></i> Tasks & Alerts
                ${myLogs.length > 0 ? `<span class="bg-brandRed text-white text-[9px] px-1.5 py-0.5 rounded-full ml-1.5 font-bold">${myLogs.length}</span>` : ''}
            </button>
            <button onclick="window.switchTrainerPortalTab('profile')" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center ${trainerCurrentTab === 'profile' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}"><i class="ph ph-user-gear mr-1.5"></i> Edit Profile</button>
        </div>
    `;

    let tabContent = "";

    if (trainerCurrentTab === 'dashboard') {
        tabContent = `
            <div class="space-y-6">
                ${headerHTML}
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-md">
                        <div class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl text-2xl"><i class="ph ph-users"></i></div>
                        <div><p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Clients</p><h4 class="text-xl font-black mt-1 font-mono">${assignedFighters.length}</h4></div>
                    </div>
                    <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-md">
                        <div class="p-3 bg-amber-500/10 text-amber-400 rounded-xl text-2xl"><i class="ph ph-star"></i></div>
                        <div><p class="text-gray-500 text-xs font-bold uppercase tracking-wider">KPI Rating</p><h4 class="text-xl font-black mt-1 font-mono text-amber-400">${t.kpis.satisfaction.toFixed(1)} <span class="text-xs text-gray-500 font-sans">${stars}</span></h4></div>
                    </div>
                <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-md md:col-span-2">
                        <div class="p-3 bg-green-500/10 text-green-400 rounded-xl text-2xl"><i class="ph ph-wallet"></i></div>
                        <div class="flex-1">
                            <p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Revenue Share (This Month)</p>
                            <h4 class="text-xl font-black mt-1 font-mono text-green-400">₹${liveSales.totalRevenue.toLocaleString()}</h4>
                            <p class="text-[10px] text-indigo-300 font-mono mt-0.5">Commission: ₹${(liveSales.totalCommission || 0).toLocaleString('en-IN', {maximumFractionDigits:0})}</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    <div class="xl:col-span-1 bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
                        <div>
                            <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-4 flex items-center"><i class="ph ph-clock text-indigo-400 mr-2 text-base"></i>Shift attendance</h4>
                            <div class="bg-black/30 border border-gray-800/80 p-4 rounded-xl font-mono text-xs space-y-2 mb-4">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Check In Time:</span>
                                    <span class="text-gray-300 font-bold">${t.todayAttendance.checkIn}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Check Out Time:</span>
                                    <span class="text-gray-300 font-bold">${t.todayAttendance.checkOut || '--:--'}</span>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-2">
                            ${!hasCheckedIn 
                                ? `<button onclick="window.trainerCheckInShift()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold py-3 rounded-xl transition-all shadow-md flex justify-center items-center"><i class="ph ph-sign-in mr-1.5 text-base"></i>Start Shift</button>` 
                                : !hasLeft 
                                    ? `<button onclick="window.trainerCheckOutShift()" class="w-full bg-brandRed hover:bg-red-700 text-white text-xs font-extrabold py-3 rounded-xl transition-all shadow-md flex justify-center items-center"><i class="ph ph-sign-out mr-1.5 text-base"></i>End Shift</button>` 
                                    : `<button onclick="window.trainerStartNextShift()" class="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold py-3 rounded-xl transition-all shadow-md flex justify-center items-center"><i class="ph ph-arrow-clockwise mr-1.5 text-base"></i>Start Next Shift</button>`
                            }
                        </div>
                    </div>

                    <div class="xl:col-span-2 bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl">
                        <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-4 flex items-center justify-between">
                            <span><i class="ph ph-users text-indigo-400 mr-2 text-base"></i>My Clients (${assignedFighters.length})</span>
                        </h4>
                        <div class="max-h-[220px] overflow-y-auto pr-1 custom-scrollbar space-y-3">
                            ${assignedFighters.length === 0 
                                ? `<p class="text-gray-600 text-xs italic py-6 text-center">No clients assigned to your training docket yet.</p>` 
                                : assignedFighters.map(f => {
                                    const formColorClass = f.formUploaded ? 'text-green-400' : 'text-red-500';
                                    const formTitle = f.formUploaded ? 'Assessment Form Completed' : 'Assessment Form Pending';
                                    
                                    return `
                                    <div class="bg-black/20 border border-gray-800/60 p-3 rounded-xl flex items-center justify-between">
                                        <div class="flex items-center space-x-3">
                                            <img src="${f.photoUrl}" class="w-8 h-8 rounded-full border border-gray-800 object-cover">
                                            <div>
                                                <div class="flex items-center space-x-1.5">
                                                    <h5 class="text-indigo-400 hover:text-indigo-300 font-bold text-xs cursor-pointer hover:underline" onclick="window.showFighterProfileDetail('${f.id}')">${f.name}</h5>
                                                    <button onclick="window.openAssessmentForm('${f.id}')" class="${formColorClass} hover:scale-110 transition-transform" title="${formTitle}">
                                                        <i class="ph ph-note-pencil text-sm font-bold"></i>
                                                    </button>
                                                </div>
                                                <p class="text-[9px] text-gray-500 uppercase font-mono">${f.plan}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <button onclick="window.toggleFormUpload('${f.id}')" class="text-[9px] px-2 py-0.5 rounded font-black border transition-all ${
                                                f.formUploaded 
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' 
                                                    : 'bg-red-500/10 text-brandRed border-brandRed/20 hover:bg-brandRed/20'
                                            }">
                                                ${f.formUploaded ? 'Uploaded' : 'Pending'}
                                            </button>
                                            <span class="text-[9px] bg-brandRed/10 text-brandRed border border-brandRed/20 px-2 py-0.5 rounded font-black uppercase">${f.status}</span>
                                        </div>
                                    </div>
                                    `;
                                }).join('')
                            }
                        </div>
                    </div>
                </div>

                <!-- REVENUE SHARE COMMISSION BREAKDOWN PANEL -->
                <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl" id="trainer-revenue-panel">
                    ${renderTrainerRevenuePanel(t.id)}
                </div>

                <!-- FIGHTER RATINGS PANEL -->
                <div class="bg-darkSurface border border-amber-500/15 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div class="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
                    <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-4 flex items-center justify-between">
                        <span><i class="ph ph-star text-amber-400 mr-2 text-base"></i>Fighter Ratings & Feedback</span>
                        <span class="text-[10px] font-mono text-amber-400 font-bold">${t.kpis.satisfaction.toFixed(1)} / 5.0 ★</span>
                    </h4>
                    ${(() => {
                        const ratings = (t.kpis && t.kpis.fighterRatings) || [];
                        if (ratings.length === 0) return `<p class="text-gray-600 text-xs italic py-6 text-center border border-dashed border-gray-800 rounded-xl">No fighter ratings yet. Ratings will appear here once fighters submit feedback from their portal.</p>`;
                        return `<div class="space-y-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                            ${[...ratings].reverse().map(r => `
                                <div class="bg-black/20 border border-gray-800/60 p-3.5 rounded-xl flex items-start space-x-3">
                                    <div class="text-amber-400 text-base font-black min-w-[60px] font-mono">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-center">
                                            <p class="text-white text-xs font-bold">${r.memberName || 'Fighter'}</p>
                                            <p class="text-[9px] text-gray-500 font-mono">${r.date}</p>
                                        </div>
                                        ${r.note ? `<p class="text-gray-400 text-[10px] mt-1 italic leading-relaxed">"${r.note}"</p>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>`;
                    })()}
                </div>
            </div>
        `;
    }

    if (trainerCurrentTab === 'logs') {
        tabContent = `
            <div class="space-y-6">
                ${headerHTML}
                <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl">
                    <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-4 flex items-center">
                        <i class="ph ph-clipboard-text text-indigo-400 mr-2 text-base"></i>Direct Tasks & Global Gym Announcements
                    </h4>
                    
                    <div class="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        ${myLogs.length === 0 
                            ? `<p class="text-gray-600 text-xs italic py-8 text-center">No command logs or tasks issued by administration yet.</p>` 
                            : myLogs.map(log => {
                                let icon = "ph-chat-text text-blue-400";
                                let bgClass = "bg-black/30 border-gray-800/50";
                                if (log.type === 'task') {
                                    icon = "ph-clipboard-text text-amber-400";
                                    bgClass = "bg-amber-950/5 border-amber-900/10";
                                }
                                if (log.type === 'notice') {
                                    icon = "ph-note text-purple-400";
                                    bgClass = "bg-purple-950/5 border-purple-900/10";
                                }
                                if (log.type === 'announcement') {
                                    icon = "ph-megaphone text-brandRed";
                                    bgClass = "bg-brandRed/5 border-brandRed/10";
                                }

                                const deadlineText = log.deadline ? `<span class="text-amber-500/80 font-mono text-[9px] block mt-1">Deadline: ${log.deadline}</span>` : '';

                                return `
                                    <div class="p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${bgClass}">
                                        <i class="ph ${icon} text-lg mt-0.5"></i>
                                        <div class="flex-1">
                                            <div class="flex justify-between items-center text-gray-500 text-[9px] font-mono mb-1">
                                                <span class="uppercase font-extrabold tracking-wider text-gray-400">${log.type}</span>
                                                <span>Issued: ${log.date}</span>
                                            </div>
                                            <p class="text-gray-300 leading-relaxed">${log.content}</p>
                                            ${deadlineText}
                                        </div>
                                    </div>
                                `;
                            }).reverse().join('')
                        }
                    </div>
                </div>
            </div>
        `;
    }

    if (trainerCurrentTab === 'work-schedule') {
        const rows = assignedFighters.length === 0
            ? `<p class="text-gray-600 text-xs italic py-12 text-center border border-dashed border-gray-800 rounded-xl">No clients assigned to your training docket yet.</p>`
            : assignedFighters.map(f => {
                const level = (f.assessmentData && f.assessmentData.fighterLevel) || "Beginner";
                const routineText = f.todaysRoutine || "No routine set for today.";
                return `
                    <div class="bg-black/20 border border-gray-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/40 transition-all shadow-md">
                        <div class="flex items-center space-x-3.5">
                            <img src="${f.photoUrl}" class="w-12 h-12 rounded-full border border-gray-800 object-cover shadow-sm">
                            <div>
                                <div class="flex items-center space-x-2">
                                    <h5 class="text-indigo-400 hover:text-indigo-300 font-bold text-xs cursor-pointer hover:underline" onclick="window.showFighterProfileDetail('${f.id}')">${f.name}</h5>
                                    <span class="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-mono text-[9px] font-bold uppercase">${level}</span>
                                </div>
                                <p class="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">${f.plan}</p>
                            </div>
                        </div>
                        <div class="flex-1 w-full md:max-w-md bg-black/40 border border-gray-800/80 p-3.5 rounded-xl text-left">
                            <span class="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Today's Routine</span>
                            <div class="font-mono text-xs text-gray-300 line-clamp-3 whitespace-pre-wrap">${routineText}</div>
                        </div>
                        <button onclick="window.openUpdateRoutineModal('${f.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow">
                            Update Routine
                        </button>
                    </div>
                `;
            }).join('');

        tabContent = `
            <div class="space-y-6">
                ${headerHTML}
                <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl">
                    <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-6 flex items-center">
                        <i class="ph ph-calendar-blank text-indigo-400 mr-2 text-base"></i>Work Schedule Plan
                    </h4>
                    
                    <div class="space-y-4">
                        ${rows}
                    </div>
                </div>
            </div>
        `;
    }

    if (trainerCurrentTab === 'nutrition') {
        const getBillingStatus = (m) => {
            if (m.dietChartPaid) return { label: "Paid", colorClass: "bg-green-500/10 text-green-400 border-green-500/20", isGated: false };
            
            const today = new Date();
            today.setHours(0,0,0,0);
            const regDateStr = m.registrationDate || today.toISOString().slice(0,10);
            const regDate = new Date(regDateStr);
            regDate.setHours(0,0,0,0);
            const diffTime = today - regDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 7) {
                return { label: "Trial Active", colorClass: "bg-blue-500/10 text-blue-400 border-blue-500/20", isGated: false, daysRemaining: 7 - diffDays };
            }
            return { label: "Awaiting Payment", colorClass: "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse", isGated: true };
        };

        const rows = assignedFighters.length === 0
            ? `<p class="text-gray-600 text-xs italic py-12 text-center border border-dashed border-gray-800 rounded-xl">No clients assigned to your training docket yet.</p>`
            : assignedFighters.map(f => {
                const billing = getBillingStatus(f);
                const statusBadge = `<span class="px-2 py-0.5 border rounded font-mono text-[9px] font-bold uppercase ${billing.colorClass}">${billing.label}${billing.daysRemaining !== undefined ? ` (${billing.daysRemaining}d left)` : ''}</span>`;
                
                let actionBtn = "";
                if (billing.isGated) {
                    actionBtn = `
                        <div class="flex flex-col items-end">
                            <span class="text-[10px] text-red-500 font-bold mb-0.5 flex items-center"><i class="ph ph-lock-keyhole mr-1"></i> Locked</span>
                            <span class="text-[8px] text-gray-500 uppercase tracking-wider">Awaiting Payment</span>
                        </div>
                    `;
                } else {
                    actionBtn = `
                        <div class="flex flex-col sm:flex-row gap-2">
                            <button onclick="window.openDietChartModal('${f.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow">
                                Update Diet
                            </button>
                            <button onclick="window.generateDietDirectlyFromList('${f.id}')" class="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-extrabold text-[11px] px-4 py-2.5 border border-indigo-500/20 rounded-xl uppercase tracking-wider transition-colors shadow flex items-center justify-center">
                                <i class="ph ph-sparkle mr-1.5 text-sm animate-pulse"></i> AI Generate
                            </button>
                        </div>
                    `;
                }

                return `
                    <div class="bg-black/20 border border-gray-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/40 transition-all shadow-md">
                        <div class="flex items-center space-x-3.5">
                            <img src="${f.photoUrl}" class="w-12 h-12 rounded-full border border-gray-800 object-cover shadow-sm">
                            <div>
                                <div class="flex items-center space-x-2">
                                    <h5 class="text-indigo-400 hover:text-indigo-300 font-bold text-xs cursor-pointer hover:underline" onclick="window.showFighterProfileDetail('${f.id}')">${f.name}</h5>
                                    ${statusBadge}
                                </div>
                                <p class="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">${f.plan}</p>
                            </div>
                        </div>
                        <div class="flex-1 w-full md:max-w-md bg-black/40 border border-gray-800/80 p-3.5 rounded-xl text-left">
                            <span class="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Active Diet Chart</span>
                            <div class="font-mono text-xs text-gray-300 line-clamp-3 whitespace-pre-wrap">${f.dietChart || "No diet chart generated yet."}</div>
                        </div>
                        <div>
                            ${actionBtn}
                        </div>
                    </div>
                `;
            }).join('');

        tabContent = `
            <div class="space-y-6">
                ${headerHTML}
                <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl">
                    <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-6 flex items-center">
                        <i class="ph ph-apple-slice text-indigo-400 mr-2 text-base"></i>Client Nutrition Plans
                    </h4>
                    
                    <div class="space-y-4">
                        ${rows}
                    </div>
                </div>
            </div>
        `;
    }

    if (trainerCurrentTab === 'profile') {
        tabContent = `
            <div class="space-y-6">
                ${headerHTML}
                
                <div class="bg-darkSurface border border-gray-800 p-6 rounded-2xl shadow-xl max-w-xl mx-auto">
                    <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-6 flex items-center">
                        <i class="ph ph-user-gear text-indigo-400 mr-2 text-base"></i>Edit Profile Details
                    </h4>
                    
                    <div class="space-y-4 text-left">
                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Trainer Full Name</label>
                            <input type="text" id="edit-t-name" value="${t.name}" class="w-full bg-black/50 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Email Address</label>
                                <input type="email" id="edit-t-email" value="${t.email}" class="w-full bg-black/50 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
                            </div>
                            <div>
                                <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Phone Number</label>
                                <input type="text" id="edit-t-phone" value="${t.phone}" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10)" class="w-full bg-black/50 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
                            </div>
                        </div>

                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Specialization / Expertise</label>
                            <input type="text" id="edit-t-specialty" value="${t.specialty || 'MMA & Kickboxing'}" class="w-full bg-black/50 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
                        </div>

                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Home Address / Hub</label>
                            <input type="text" id="edit-t-address" value="${t.address || 'Birati, Kolkata'}" class="w-full bg-black/50 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
                        </div>

                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Avatar Photo URL</label>
                            <input type="text" id="edit-t-photo" value="${t.photoUrl}" class="w-full bg-black/50 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none font-mono font-bold">
                            <div class="mt-2 flex items-center space-x-3">
                                <label for="upload-avatar-file" class="cursor-pointer bg-black/40 hover:bg-black/80 border border-gray-800 hover:border-indigo-500 text-[10px] text-gray-300 font-extrabold px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5">
                                    <i class="ph ph-upload-simple text-sm text-indigo-400"></i>
                                    <span>Upload Image</span>
                                </label>
                                <input type="file" id="upload-avatar-file" accept="image/*" class="hidden" onchange="window.handleTrainerAvatarUpload(event)">
                                <span id="upload-status" class="text-[9px] text-gray-500 font-mono italic">or paste a URL above</span>
                            </div>
                        </div>
                        
                        <button onclick="window.saveTrainerPortalProfile()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold py-3.5 rounded-xl uppercase tracking-widest shadow-lg transition-all mt-4">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="space-y-6 animate-fadeIn relative">
            ${tabContent}
            <div id="trainer-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300" onclick="window.closeTrainerModal()"></div>
        </div>
    `;
}

// =========================================================================
// REVENUE SHARE BREAKDOWN PANEL — Shared engine ব্যবহার করে
// =========================================================================

/**
 * renderTrainerRevenuePanel(trainerId)
 * Trainer dashboard-এ commission breakdown box রেন্ডার করে।
 * window.calculateTrainerEarnings (mockData.js-এ defined) ব্যবহার করে
 * যাতে Admin ও Trainer একই লজিক থেকে ডেটা পায়।
 */
function renderTrainerRevenuePanel(trainerId) {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevMonth = (() => {
        const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    })();

    const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

    let result = { totalRevenue: 0, totalCommission: 0, breakdown: [] };
    if (typeof window.calculateTrainerEarnings === 'function') {
        result = window.calculateTrainerEarnings(trainerId, currentMonth);
    }

    const commissionRules = window.COMMISSION_RULES || { 'pt': 0.20, 'diet plan': 0.10, 'supplement': 0.05, 'supplements': 0.05, 'gear': 0.05, 'apparel': 0.05 };
    const rateLabels = { 'pt': '20%', 'diet plan': '10%', 'supplement': '5%', 'supplements': '5%', 'gear': '5%', 'apparel': '5%' };

    const breakdownRows = result.breakdown.length > 0
        ? result.breakdown.map(b => {
            const catKey = b.category.toLowerCase();
            const rateLabel = rateLabels[catKey] || `${Math.round((commissionRules[catKey] || 0) * 100)}%`;
            return `
                <div class="flex items-center justify-between bg-black/30 border border-gray-800/60 p-3 rounded-xl">
                    <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 rounded-full bg-indigo-400"></div>
                        <span class="text-gray-300 text-xs font-semibold uppercase tracking-wide">${b.category}</span>
                        <span class="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono font-bold">${rateLabel} rate</span>
                    </div>
                    <div class="text-right">
                        <div class="text-white font-mono text-xs font-bold">₹${b.commission.toLocaleString('en-IN', {maximumFractionDigits: 0})}</div>
                        <div class="text-[9px] text-gray-500 font-mono">on ₹${b.revenue.toLocaleString('en-IN')}</div>
                    </div>
                </div>
            `;
        }).join('')
        : `<p class="text-gray-600 text-xs italic text-center py-4">No commissionable income this month yet.</p>`;

    return `
        <div class="flex justify-between items-center border-b border-gray-800/60 pb-3 mb-4">
            <h4 class="text-gray-400 font-bold tracking-wide text-xs uppercase flex items-center">
                <i class="ph ph-chart-bar text-green-400 mr-2 text-base"></i>Revenue Share Breakdown
                <span class="ml-2 text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-mono uppercase">${monthLabel}</span>
            </h4>
            <div class="text-right">
                <p class="text-[9px] text-gray-500 uppercase font-bold">Total Commission</p>
                <p class="text-lg font-black font-mono text-green-400">₹${result.totalCommission.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
            </div>
        </div>

        <div class="space-y-2.5 mb-4">
            ${breakdownRows}
        </div>

        <div class="bg-gradient-to-r from-green-950/30 to-black border border-green-900/20 p-3.5 rounded-xl flex items-center justify-between">
            <div>
                <p class="text-[10px] text-gray-500 uppercase font-bold">Total Sales Revenue Linked</p>
                <p class="text-base font-black font-mono text-white mt-0.5">₹${result.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div class="text-right">
                <p class="text-[10px] text-gray-500 uppercase font-bold">Your Earning Share</p>
                <p class="text-base font-black font-mono text-green-400 mt-0.5">₹${result.totalCommission.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
            </div>
        </div>

        <p class="text-[9px] text-gray-600 mt-3 text-center font-mono">⚡ Live sync — updates instantly when admin logs new income</p>
    `;
}

// =========================================================================
// REAL-TIME SYNC: Admin Finance → Trainer Portal
// Admin income entry হলেই এই listener trainer portal-এ নতুন revenue দেখায়
// =========================================================================
window.addEventListener('trainerDataUpdated', function(event) {
    if (!loggedInTrainer) return;
    const { trainerId } = event.detail || {};

    // শুধুমাত্র logged-in trainer-এর entry হলে panel update করব
    if (trainerId && trainerId === loggedInTrainer.id) {
        const panel = document.getElementById('trainer-revenue-panel');
        if (panel) {
            // Smooth flash animation দিয়ে panel update
            panel.style.transition = 'box-shadow 0.4s ease';
            panel.style.boxShadow = '0 0 20px rgba(34,197,94,0.4)';
            panel.innerHTML = renderTrainerRevenuePanel(loggedInTrainer.id);
            setTimeout(() => { panel.style.boxShadow = ''; }, 1500);
        }
    }
});

// =========================================================================
// ACTION TRIGGERS & DELEGATES
// =========================================================================

window.switchTrainerPortalTab = function(tabName) {
    trainerCurrentTab = tabName;
    navigateTo('trainer-portal');
};

window.loginTrainerPortal = function() {
    const val = document.getElementById('trainer-portal-login-input').value.trim().toLowerCase();
    if (!val) return alert("Credentials Error: Input field cannot be empty.");

    const trainers = window.MOCK_TRAINERS || [];
    const matched = trainers.find(t => t.id.toLowerCase() === val || t.email.toLowerCase() === val);

    if (!matched) {
        alert("Access Denied: Trainer ID or email not registered on active roster.");
        return;
    }

    if (matched.status === 'pending') {
        alert("🔒 Access Deferred: Your registration status is 'Pending'. Access is blocked until Admin clearance.");
        return;
    }

    if (matched.status === 'blocked' || matched.status === 'inactive' || matched.status === 'suspended') {
        alert(`🔒 Access Denied: Your account status is '${matched.status.toUpperCase()}'. Access is blocked.`);
        return;
    }

    loggedInTrainer = matched;
    trainerCurrentTab = 'dashboard';
    navigateTo('trainer-portal');
};

window.logoutTrainerPortal = function() {
    loggedInTrainer = null;
    trainerCurrentTab = 'dashboard';
    window.clearSession();
};

window.trainerCheckInShift = function() {
    if (!loggedInTrainer) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const todayStr = now.toISOString().slice(0, 10);
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    loggedInTrainer.todayAttendance.checkIn = timeStr;

    const newLog = {
        trainerId: loggedInTrainer.id,
        trainerName: loggedInTrainer.name,
        type: "check-in",
        date: todayStr,
        time: timeFormatted
    };

    if (!window.TRAINER_ATTENDANCE_LOGS) window.TRAINER_ATTENDANCE_LOGS = [];
    window.TRAINER_ATTENDANCE_LOGS.push(newLog);

    const index = window.MOCK_TRAINERS.findIndex(t => t.id === loggedInTrainer.id);
    if (index !== -1) {
        window.MOCK_TRAINERS[index] = loggedInTrainer;
    }

    try {
        localStorage.setItem('RENEW_TRAINER_ATTENDANCE_DB', JSON.stringify(window.TRAINER_ATTENDANCE_LOGS));
        localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(window.MOCK_TRAINERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('trainers', loggedInTrainer.id, loggedInTrainer)
            .catch(e => console.error('[Firestore] Trainer check-in status write failed:', e.message));
        window.dbService.addDocument('attendance', { ...newLog, logType: 'trainer' }, loggedInTrainer.id)
            .catch(e => console.error('[Firestore] Trainer check-in attendance write failed:', e.message));
    }

    alert(`⚡ SHIFT SIGN-IN:\nGood day! Shift started successfully at ${timeStr}.`);
    navigateTo('trainer-portal');
};

window.trainerCheckOutShift = function() {
    if (!loggedInTrainer) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const todayStr = now.toISOString().slice(0, 10);
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    loggedInTrainer.todayAttendance.checkOut = timeStr;

    const newLog = {
        trainerId: loggedInTrainer.id,
        trainerName: loggedInTrainer.name,
        type: "check-out",
        date: todayStr,
        time: timeFormatted
    };

    if (!window.TRAINER_ATTENDANCE_LOGS) window.TRAINER_ATTENDANCE_LOGS = [];
    window.TRAINER_ATTENDANCE_LOGS.push(newLog);

    const index = window.MOCK_TRAINERS.findIndex(t => t.id === loggedInTrainer.id);
    if (index !== -1) {
        window.MOCK_TRAINERS[index] = loggedInTrainer;
    }

    try {
        localStorage.setItem('RENEW_TRAINER_ATTENDANCE_DB', JSON.stringify(window.TRAINER_ATTENDANCE_LOGS));
        localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(window.MOCK_TRAINERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('trainers', loggedInTrainer.id, loggedInTrainer)
            .catch(e => console.error('[Firestore] Trainer check-out status write failed:', e.message));
        window.dbService.addDocument('attendance', { ...newLog, logType: 'trainer' }, loggedInTrainer.id)
            .catch(e => console.error('[Firestore] Trainer check-out attendance write failed:', e.message));
    }

    alert(`🛑 SHIFT SIGN-OUT:\nDuty completed. Shift ended successfully at ${timeStr}.`);
    navigateTo('trainer-portal');
};

window.trainerStartNextShift = function() {
    if (!loggedInTrainer) return;
    if (confirm("Start a new shift? This resets today's login status.")) {
        loggedInTrainer.todayAttendance.checkIn = "--:--";
        loggedInTrainer.todayAttendance.checkOut = null;
        loggedInTrainer.todayAttendance.workingHours = 0;
        
        // Sync to mock DB list & LocalStorage
        const index = window.MOCK_TRAINERS.findIndex(t => t.id === loggedInTrainer.id);
        if (index !== -1) window.MOCK_TRAINERS[index] = loggedInTrainer;
        try {
            localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(window.MOCK_TRAINERS));
        } catch(e) {}
        
        if (window.dbService && typeof window.dbService.setDocument === 'function') {
            window.dbService.setDocument('trainers', loggedInTrainer.id, loggedInTrainer)
                .catch(e => console.error('[Firestore] Trainer reset shift write failed:', e.message));
        }
        
        navigateTo('trainer-portal');
    }
};

window.handleTrainerAvatarUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB.");
        return;
    }

    const reader = new FileReader();
    const statusText = document.getElementById('upload-status');
    if (statusText) statusText.textContent = "Uploading...";

    reader.onload = function(e) {
        const base64Data = e.target.result;
        const photoInput = document.getElementById('edit-t-photo');
        if (photoInput) {
            photoInput.value = base64Data;
        }
        if (statusText) statusText.textContent = "Upload successful! (Ready to save)";
    };

    reader.onerror = function() {
        if (statusText) statusText.textContent = "Upload failed.";
        alert("Error reading file.");
    };

    reader.readAsDataURL(file);
};

window.saveTrainerPortalProfile = function() {
    if (!loggedInTrainer) return;
    
    const name = document.getElementById('edit-t-name').value.trim();
    const email = document.getElementById('edit-t-email').value.trim();
    const phone = document.getElementById('edit-t-phone').value.trim();
    const specialty = document.getElementById('edit-t-specialty').value.trim();
    const address = document.getElementById('edit-t-address').value.trim();
    const photoUrl = document.getElementById('edit-t-photo').value.trim();

    if (!name || !email || !phone) {
        alert("Validation error: Name, Email and Phone cannot be blank!");
        return;
    }

    loggedInTrainer.name = name;
    loggedInTrainer.email = email;
    loggedInTrainer.phone = phone;
    loggedInTrainer.specialty = specialty;
    loggedInTrainer.address = address;
    loggedInTrainer.photoUrl = photoUrl;

    // Sync changes back to MOCK_TRAINERS list
    const index = window.MOCK_TRAINERS.findIndex(t => t.id === loggedInTrainer.id);
    if (index !== -1) {
        window.MOCK_TRAINERS[index] = loggedInTrainer;
    }

    try {
        localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(window.MOCK_TRAINERS));
    } catch (e) {
        console.error("Failed to save trainer details to RENEW_TRAINERS_DB", e);
    }

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('trainers', loggedInTrainer.id, loggedInTrainer)
            .catch(e => console.error('[Firestore] Trainer profile write failed:', e.message));
    }

    alert("✅ Profile configuration saved successfully!");
    navigateTo('trainer-portal');
};

window.toggleFormUpload = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    member.formUploaded = !member.formUploaded;

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .catch(e => console.error('[Firestore] Form upload status write failed:', e.message));
    }

    alert(`Success: Assessment status for ${member.name} updated to ${member.formUploaded ? 'Uploaded (Green)' : 'Pending (Red)'}.`);
    navigateTo('trainer-portal');
};

window.openAssessmentForm = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return alert("Error: Member not found.");

    const modal = document.getElementById('trainer-modal');
    if (!modal) return;

    const weight = member.weight || "72 KG";
    const height = member.height || "5'8\"";
    const age = member.age || "26 YRS";
    const data = member.assessmentData || {};

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 via-darkBg to-black border border-gray-800 p-[2px] rounded-2xl w-[95%] max-w-2xl shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col text-xs text-left relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-24 bg-indigo-600/5 blur-2xl"></div>
                
                <!-- HEADER -->
                <div class="flex items-center justify-between border-b border-gray-800 pb-4 mb-4 z-10">
                    <div class="flex items-center space-x-3">
                        <img src="${member.photoUrl}" class="w-10 h-10 rounded-full border border-gray-800 object-cover">
                        <div>
                            <h3 class="font-bold text-white text-base tracking-wide">Client Health Assessment</h3>
                            <p class="text-[10px] text-gray-500 font-mono">Fighter: ${member.name} (${member.id.toUpperCase()})</p>
                        </div>
                    </div>
                    <button onclick="window.closeTrainerModal()" class="text-gray-500 hover:text-white text-lg transition-colors"><i class="ph ph-x"></i></button>
                </div>
                
                <!-- SCROLLABLE BODY -->
                <div class="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar space-y-4 z-10">
                    <!-- PROFILE INFO (Read-Only) -->
                    <div class="bg-black/30 border border-gray-800/60 p-4 rounded-xl">
                        <h4 class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center"><i class="ph ph-identification-card mr-1.5 text-sm"></i> Profile Details (Read-only)</h4>
                        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div>
                                <label class="text-gray-500 text-[8px] uppercase font-black block mb-1">Full Name</label>
                                <input type="text" value="${member.name}" disabled class="w-full bg-black/40 border border-gray-800/60 text-gray-400 text-xs rounded-lg px-2.5 py-1.5 cursor-not-allowed">
                            </div>
                            <div>
                                <label class="text-gray-500 text-[8px] uppercase font-black block mb-1">Phone</label>
                                <input type="text" value="${member.phone}" disabled class="w-full bg-black/40 border border-gray-800/60 text-gray-400 text-xs rounded-lg px-2.5 py-1.5 cursor-not-allowed">
                            </div>
                            <div>
                                <label class="text-gray-500 text-[8px] uppercase font-black block mb-1">Age</label>
                                <input type="text" value="${age}" disabled class="w-full bg-black/40 border border-gray-800/60 text-gray-400 text-xs rounded-lg px-2.5 py-1.5 cursor-not-allowed font-mono">
                            </div>
                            <div>
                                <label class="text-gray-500 text-[8px] uppercase font-black block mb-1">Height</label>
                                <input type="text" value="${height}" disabled class="w-full bg-black/40 border border-gray-800/60 text-gray-400 text-xs rounded-lg px-2.5 py-1.5 cursor-not-allowed font-mono">
                            </div>
                            <div>
                                <label class="text-gray-500 text-[8px] uppercase font-black block mb-1">Weight</label>
                                <input type="text" value="${weight}" disabled class="w-full bg-black/40 border border-gray-800/60 text-gray-400 text-xs rounded-lg px-2.5 py-1.5 cursor-not-allowed font-mono">
                            </div>
                        </div>
                    </div>

                    <!-- CLASSIFICATION & LIFESTYLE PROFILES -->
                    <div class="bg-black/30 border border-gray-800/60 p-4 rounded-xl">
                        <h4 class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center">
                            <i class="ph ph-user-focus mr-1.5 text-sm"></i> Classification & Lifestyle Profiles
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                                <label class="text-gray-300 text-[11px] block mb-1">Gender</label>
                                <select id="as-gender" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                    <option value="Male" ${data.gender === 'Male' ? 'selected' : ''}>Male</option>
                                    <option value="Female" ${data.gender === 'Female' ? 'selected' : ''}>Female</option>
                                    <option value="Non-Binary" ${data.gender === 'Non-Binary' ? 'selected' : ''}>Non-Binary</option>
                                    <option value="Other" ${data.gender === 'Other' ? 'selected' : ''}>Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-gray-300 text-[11px] block mb-1">Weekly Training (Days)</label>
                                <select id="as-weekly-days" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono">
                                    <option value="1" ${data.weeklyTrainingDays == '1' ? 'selected' : ''}>1 Day</option>
                                    <option value="2" ${data.weeklyTrainingDays == '2' ? 'selected' : ''}>2 Days</option>
                                    <option value="3" ${data.weeklyTrainingDays == '3' ? 'selected' : ''}>3 Days</option>
                                    <option value="4" ${data.weeklyTrainingDays == '4' ? 'selected' : ''}>4 Days</option>
                                    <option value="5" ${data.weeklyTrainingDays == '5' ? 'selected' : ''}>5 Days</option>
                                    <option value="6" ${data.weeklyTrainingDays == '6' ? 'selected' : ''}>6 Days</option>
                                    <option value="7" ${data.weeklyTrainingDays == '7' ? 'selected' : ''}>7 Days</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-gray-300 text-[11px] block mb-1">Fighter Classification</label>
                                <select id="as-fighter-level" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                    <option value="Beginner" ${data.fighterLevel === 'Beginner' ? 'selected' : ''}>Beginner</option>
                                    <option value="Intermediate" ${data.fighterLevel === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                                    <option value="Pro Fighter" ${data.fighterLevel === 'Pro Fighter' ? 'selected' : ''}>Pro Fighter</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-gray-300 text-[11px] block mb-1">Food Habit</label>
                                <select id="as-food-habit" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                    <option value="Veg" ${data.foodHabit === 'Veg' ? 'selected' : ''}>Veg</option>
                                    <option value="Non Veg" ${data.foodHabit === 'Non Veg' ? 'selected' : ''}>Non Veg</option>
                                    <option value="Vegan" ${data.foodHabit === 'Vegan' ? 'selected' : ''}>Vegan</option>
                                    <option value="Eggitarian" ${data.foodHabit === 'Eggitarian' ? 'selected' : ''}>Eggitarian</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- MEDICAL HISTORY -->
                    <div class="bg-black/30 border border-gray-800/60 p-4 rounded-xl">
                        <h4 class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center"><i class="ph ph-heartbeat mr-1.5 text-sm"></i> Medical & Health History</h4>
                        <div class="space-y-3">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/40 pb-2">
                                <span class="text-gray-300 text-[11px] max-w-md">1. Has your doctor ever diagnosed you with a heart condition and recommended that you should only exercise under medical supervision?</span>
                                <select id="as-q1" class="bg-black/60 border border-gray-800 rounded px-2 py-1 text-[11px] text-white outline-none w-20">
                                    <option value="no" ${data.medicalHeartCondition === 'no' ? 'selected' : ''}>No</option>
                                    <option value="yes" ${data.medicalHeartCondition === 'yes' ? 'selected' : ''}>Yes</option>
                                </select>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/40 pb-2">
                                <span class="text-gray-300 text-[11px] max-w-md">2. Have you had chest pain when you were not doing physical activity?</span>
                                <select id="as-q2" class="bg-black/60 border border-gray-800 rounded px-2 py-1 text-[11px] text-white outline-none w-20">
                                    <option value="no" ${data.medicalHeartCondition === 'no' ? 'selected' : ''}>No</option>
                                    <option value="yes" ${data.medicalHeartCondition === 'yes' ? 'selected' : ''}>Yes</option>
                                </select>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/40 pb-2">
                                <span class="text-gray-300 text-[11px] max-w-md">3. Do you have a bone, joint, or health limit (e.g. diabetes, high BP, asthma)?</span>
                                <select id="as-q3" class="bg-black/60 border border-gray-800 rounded px-2 py-1 text-[11px] text-white outline-none w-20">
                                    <option value="no" ${data.medicalBoneJointProblem === 'no' ? 'selected' : ''}>No</option>
                                    <option value="yes" ${data.medicalBoneJointProblem === 'yes' ? 'selected' : ''}>Yes</option>
                                </select>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/40 pb-2">
                                <span class="text-gray-300 text-[11px] max-w-md">4. Have you had a recent surgery?</span>
                                <select id="as-q4" class="bg-black/60 border border-gray-800 rounded px-2 py-1 text-[11px] text-white outline-none w-20">
                                    <option value="no" ${data.medicalRecentSurgery === 'no' ? 'selected' : ''}>No</option>
                                    <option value="yes" ${data.medicalRecentSurgery === 'yes' ? 'selected' : ''}>Yes</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-gray-500 text-[8px] uppercase font-black block mb-1">Medical History Elaboration (If YES to any above)</label>
                                <textarea id="as-q-elaborate" rows="2" placeholder="Describe symptoms, medications, or surgical details here..." class="w-full bg-black/40 border border-gray-800 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-white resize-none outline-none">${data.medicalElaboration || ''}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- PHYSICAL PERFORMANCE & VITALS -->
                    <div class="bg-black/30 border border-gray-800/60 p-4 rounded-xl">
                        <h4 class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center">
                            <i class="ph ph-barbell mr-1.5 text-sm"></i> Physical Performance & Vitals
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="text-gray-300 text-[11px] block mb-1">Blood Pressure (mmHg)</label>
                                <input type="text" id="as-bp" value="${data.bloodPressure || ''}" placeholder="e.g. 120/80" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono">
                            </div>
                            <div>
                                <label class="text-gray-300 text-[11px] block mb-1">Max Pushup (till failure)</label>
                                <input type="number" id="as-pushup" value="${data.maxPushup || ''}" min="0" placeholder="Reps" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono">
                            </div>
                            <div>
                                <label class="text-gray-300 text-[11px] block mb-1">Curl Up (till failure)</label>
                                <input type="number" id="as-curlup" value="${data.curlUp || ''}" min="0" placeholder="Reps" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono">
                            </div>
                        </div>
                    </div>

                    <!-- LIFESTYLE -->
                    <div class="bg-black/30 border border-gray-800/60 p-4 rounded-xl">
                        <h4 class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center"><i class="ph ph-activity mr-1.5 text-sm"></i> Lifestyle & Daily Habits</h4>
                        <div class="space-y-3">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">5. Do you smoke?</label>
                                    <select id="as-q5" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                        <option value="no" ${data.lifestyleSmoke === 'no' ? 'selected' : ''}>No</option>
                                        <option value="yes" ${data.lifestyleSmoke === 'yes' ? 'selected' : ''}>Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">If yes, how many per day?</label>
                                    <input type="text" id="as-q5-detail" value="${data.lifestyleSmokePerDay || ''}" placeholder="e.g. 5 cigarettes" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">6. Do you drink alcohol?</label>
                                    <select id="as-q6" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                        <option value="no" ${data.lifestyleDrink === 'no' ? 'selected' : ''}>No</option>
                                        <option value="yes" ${data.lifestyleDrink === 'yes' ? 'selected' : ''}>Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">If yes, weekly quantity?</label>
                                    <input type="text" id="as-q6-detail" value="${data.lifestyleDrinkQuantity || ''}" placeholder="e.g. 2-3 beers" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">7. Night sleep hours regularly?</label>
                                    <input type="number" id="as-q7" value="${data.lifestyleSleep || 8}" min="1" max="24" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono">
                                </div>
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">8. Describe your job role:</label>
                                    <select id="as-q8" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                        <option value="Sedentary" ${data.lifestyleJob === 'Sedentary' ? 'selected' : ''}>Sedentary (Desk bound)</option>
                                        <option value="Active" ${data.lifestyleJob === 'Active' ? 'selected' : ''}>Active (On feet often)</option>
                                        <option value="Physically demanding" ${data.lifestyleJob === 'Physically demanding' ? 'selected' : ''}>Physically demanding (Heavy labor)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">9. Does your job require travel?</label>
                                    <select id="as-q9" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                        <option value="no" ${data.lifestyleTravel === 'no' ? 'selected' : ''}>No</option>
                                        <option value="yes" ${data.lifestyleTravel === 'yes' ? 'selected' : ''}>Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">10. Stress level (1-10): <span class="text-indigo-400 font-mono font-bold" id="stress-val-display">${data.lifestyleStress || 5}</span></label>
                                    <input type="range" id="as-q10" min="1" max="10" value="${data.lifestyleStress || 5}" oninput="document.getElementById('stress-val-display').innerText=this.value" class="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- DIET & NUTRITION -->
                    <div class="bg-black/30 border border-gray-800/60 p-4 rounded-xl">
                        <h4 class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center"><i class="ph ph-apple-slice mr-1.5 text-sm"></i> Diet & Nutrition Behavior</h4>
                        <div class="space-y-3">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">11. Rate nutrition quality (1-10): <span class="text-indigo-400 font-mono font-bold" id="nutrition-val-display">${data.dietNutritionRating || 5}</span></label>
                                    <input type="range" id="as-q11" min="1" max="10" value="${data.dietNutritionRating || 5}" oninput="document.getElementById('nutrition-val-display').innerText=this.value" class="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2">
                                </div>
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">12. Meal frequency per day?</label>
                                    <input type="number" id="as-q12" value="${data.dietMealFrequency || 3}" min="1" max="10" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">13. Do you skip meals?</label>
                                    <select id="as-q13" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                        <option value="no" ${data.dietSkipMeals === 'no' ? 'selected' : ''}>No</option>
                                        <option value="yes" ${data.dietSkipMeals === 'yes' ? 'selected' : ''}>Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">14. Late night eating habits?</label>
                                    <select id="as-q14" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                        <option value="Never" ${data.dietLateNightEating === 'Never' ? 'selected' : ''}>Never</option>
                                        <option value="Sometimes" ${data.dietLateNightEating === 'Sometimes' ? 'selected' : ''}>Sometimes</option>
                                        <option value="Often" ${data.dietLateNightEating === 'Often' ? 'selected' : ''}>Often</option>
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">15. Glasses of water consumed daily?</label>
                                    <input type="number" id="as-q15" value="${data.dietWaterIntake || 8}" min="1" max="30" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono">
                                </div>
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">16. Feel drops in energy during day?</label>
                                    <select id="as-q16" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                        <option value="no" ${data.dietEnergyDrops === 'no' ? 'selected' : ''}>No</option>
                                        <option value="yes" ${data.dietEnergyDrops === 'yes' ? 'selected' : ''}>Yes</option>
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">If yes, when do drops occur?</label>
                                    <input type="text" id="as-q16-detail" value="${data.dietEnergyDropsWhen || ''}" placeholder="e.g. 3 PM afternoon" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                </div>
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">17. Know calorie intake per day?</label>
                                    <select id="as-q17" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                        <option value="no" ${data.dietKnowCalories === 'no' ? 'selected' : ''}>No</option>
                                        <option value="yes" ${data.dietKnowCalories === 'yes' ? 'selected' : ''}>Yes</option>
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">If yes, how many calories?</label>
                                    <input type="number" id="as-q17-detail" value="${data.dietKnowCaloriesValue || ''}" placeholder="e.g. 2100 kcal" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono">
                                </div>
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">18. Take multivitamins/supplements?</label>
                                    <select id="as-q18" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                        <option value="no" ${data.dietSupplements === 'no' ? 'selected' : ''}>No</option>
                                        <option value="yes" ${data.dietSupplements === 'yes' ? 'selected' : ''}>Yes</option>
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">If yes, list supplements:</label>
                                    <input type="text" id="as-q18-detail" value="${data.dietSupplementsList || ''}" placeholder="e.g. Whey, Vitamin C, Fish Oil" class="w-full bg-black/40 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none">
                                </div>
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">19. Weekly dining out frequency?</label>
                                    <select id="as-q19" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono">
                                        <option value="0" ${data.dietEatOutFrequency == '0' ? 'selected' : ''}>0 times</option>
                                        <option value="1" ${data.dietEatOutFrequency == '1' ? 'selected' : ''}>1 time</option>
                                        <option value="2" ${data.dietEatOutFrequency == '2' ? 'selected' : ''}>2 times</option>
                                        <option value="3" ${data.dietEatOutFrequency == '3' ? 'selected' : ''}>3 times</option>
                                        <option value="4" ${data.dietEatOutFrequency == '4' ? 'selected' : ''}>4 times</option>
                                        <option value="5" ${data.dietEatOutFrequency == '5' ? 'selected' : ''}>5 times</option>
                                        <option value="6" ${data.dietEatOutFrequency == '6' ? 'selected' : ''}>6 times</option>
                                        <option value="7" ${data.dietEatOutFrequency == '7' ? 'selected' : ''}>7+ times</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- GOALS & CONSENT -->
                    <div class="bg-black/30 border border-gray-800/60 p-4 rounded-xl">
                        <h4 class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center"><i class="ph ph-target mr-1.5 text-sm"></i> Fitness Goals & Consent</h4>
                        <div class="space-y-3">
                            <div class="grid grid-cols-1 gap-3">
                                <div>
                                    <label class="text-gray-300 text-[11px] block mb-1">20. Present fitness rating (1-10): <span class="text-indigo-400 font-mono font-bold" id="fitness-val-display">${data.fitnessLevel || 5}</span></label>
                                    <input type="range" id="as-q20" min="1" max="10" value="${data.fitnessLevel || 5}" oninput="document.getElementById('fitness-val-display').innerText=this.value" class="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2">
                                </div>
                            </div>
                            <div>
                                <label class="text-gray-300 text-[11px] block mb-1">21. Primary fitness goal?</label>
                                <textarea id="as-q21" rows="3" placeholder="Describe short-term & long-term performance/body goals here..." class="w-full bg-black/40 border border-gray-800 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-white resize-none outline-none">${data.fitnessGoal || ''}</textarea>
                            </div>
                            <div class="flex items-center space-x-2 pt-2">
                                <input type="checkbox" id="as-consent" ${data.consentWaiver ? 'checked' : ''} class="w-4 h-4 bg-black/50 border border-gray-800 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer">
                                <label for="as-consent" class="text-gray-400 text-[11px] cursor-pointer">Verify client waiver and consent declaration has been accepted.</label>
                            </div>
                        </div>
                    </div>
                </div>

                            <div class="flex justify-end space-x-3 border-t border-gray-800 pt-4 mt-4 z-10">
                    <button type="button" onclick="window.closeTrainerModal()" class="px-5 py-2.5 bg-black/40 border border-gray-800 hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">Cancel</button>
                    <button type="button" onclick="window.saveAssessmentForm('${member.id}')" class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all">Save Assessment</button>
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
};

window.closeTrainerModal = function() {
    const modal = document.getElementById('trainer-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    if (modal.firstElementChild) {
        modal.firstElementChild.classList.remove('scale-100');
        modal.firstElementChild.classList.add('scale-95');
    }
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 200);
};

window.saveAssessmentForm = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return alert("Error: Member not found.");

    // Retrieve fields
    const medicalHeartCondition = document.getElementById('as-q1').value;
    const medicalChestPain = document.getElementById('as-q2').value;
    const medicalBoneJointProblem = document.getElementById('as-q3').value;
    const medicalRecentSurgery = document.getElementById('as-q4').value;
    const medicalElaboration = document.getElementById('as-q-elaborate').value.trim();
    const bloodPressure = document.getElementById('as-bp').value.trim();
    const maxPushup = document.getElementById('as-pushup').value.trim();
    const curlUp = document.getElementById('as-curlup').value.trim();

    const lifestyleSmoke = document.getElementById('as-q5').value;
    const lifestyleSmokePerDay = document.getElementById('as-q5-detail').value.trim();
    const lifestyleDrink = document.getElementById('as-q6').value;
    const lifestyleDrinkQuantity = document.getElementById('as-q6-detail').value.trim();
    const lifestyleSleep = parseInt(document.getElementById('as-q7').value) || 8;
    const lifestyleJob = document.getElementById('as-q8').value;
    const lifestyleTravel = document.getElementById('as-q9').value;
    const lifestyleStress = parseInt(document.getElementById('as-q10').value) || 5;

    const dietNutritionRating = parseInt(document.getElementById('as-q11').value) || 5;
    const dietMealFrequency = parseInt(document.getElementById('as-q12').value) || 3;
    const dietSkipMeals = document.getElementById('as-q13').value;
    const dietLateNightEating = document.getElementById('as-q14').value;
    const dietWaterIntake = parseInt(document.getElementById('as-q15').value) || 8;
    const dietEnergyDrops = document.getElementById('as-q16').value;
    const dietEnergyDropsWhen = document.getElementById('as-q16-detail').value.trim();
    const dietKnowCalories = document.getElementById('as-q17').value;
    const dietKnowCaloriesValue = document.getElementById('as-q17-detail').value.trim();
    const dietSupplements = document.getElementById('as-q18').value;
    const dietSupplementsList = document.getElementById('as-q18-detail').value.trim();
    const dietEatOutFrequency = document.getElementById('as-q19').value;

    const fitnessLevel = parseInt(document.getElementById('as-q20').value) || 5;
    const fitnessGoal = document.getElementById('as-q21').value.trim();
    const consentWaiver = document.getElementById('as-consent').checked;

    const gender = document.getElementById('as-gender').value;
    const weeklyTrainingDays = document.getElementById('as-weekly-days').value;
    const fighterLevel = document.getElementById('as-fighter-level').value;
    const foodHabit = document.getElementById('as-food-habit').value;

    // Save
    member.assessmentData = {
        medicalHeartCondition,
        medicalChestPain,
        medicalBoneJointProblem,
        medicalRecentSurgery,
        medicalElaboration,
        bloodPressure,
        maxPushup,
        curlUp,
        lifestyleSmoke,
        lifestyleSmokePerDay,
        lifestyleDrink,
        lifestyleDrinkQuantity,
        lifestyleSleep,
        lifestyleJob,
        lifestyleTravel,
        lifestyleStress,
        dietNutritionRating,
        dietMealFrequency,
        dietSkipMeals,
        dietLateNightEating,
        dietWaterIntake,
        dietEnergyDrops,
        dietEnergyDropsWhen,
        dietKnowCalories,
        dietKnowCaloriesValue,
        dietSupplements,
        dietSupplementsList,
        dietEatOutFrequency,
        fitnessLevel,
        fitnessGoal,
        consentWaiver,
        gender,
        weeklyTrainingDays,
        fighterLevel,
        foodHabit
    };

    member.formUploaded = true;

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .catch(e => console.error('[Firestore] Assessment form write failed:', e.message));
    }

    alert(`✅ Success: Assessment data saved for ${member.name}. status badge set to Uploaded.`);
    window.closeTrainerModal();
    navigateTo('trainer-portal');
};

window.openUpdateRoutineModal = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return alert("Error: Member not found.");

    const modal = document.getElementById('trainer-modal');
    if (!modal) return;

    const todaysRoutine = member.todaysRoutine || "";
    const history = member.routineHistory || [];

    const historyHTML = history.length === 0
        ? `<p class="text-gray-600 text-xs italic py-4 text-center">No previous routines logged yet.</p>`
        : history.map(h => `
            <div class="bg-black/40 border border-gray-800/80 p-3 rounded-xl space-y-1">
                <div class="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                    <span class="font-bold text-indigo-400"><i class="ph ph-calendar-blank mr-1"></i>${h.date}</span>
                </div>
                <div class="text-gray-300 text-xs font-mono whitespace-pre-wrap">${h.routine}</div>
            </div>
        `).reverse().join('');

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 via-darkBg to-black border border-gray-800 p-[2px] rounded-2xl w-[95%] max-w-2xl shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col text-xs text-left relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-24 bg-indigo-600/5 blur-2xl"></div>
                
                <!-- HEADER -->
                <div class="flex items-center justify-between border-b border-gray-800 pb-4 mb-4 z-10">
                    <div class="flex items-center space-x-3">
                        <img src="${member.photoUrl}" class="w-10 h-10 rounded-full border border-gray-800 object-cover">
                        <div>
                            <h3 class="font-bold text-white text-base tracking-wide">Workout Routine Plan</h3>
                            <p class="text-[10px] text-gray-500 font-mono">Fighter: ${member.name} | Level: ${(member.assessmentData && member.assessmentData.fighterLevel) || "Beginner"}</p>
                        </div>
                    </div>
                    <button onclick="window.closeTrainerModal()" class="text-gray-500 hover:text-white text-lg transition-colors"><i class="ph ph-x"></i></button>
                </div>
                
                <!-- BODY -->
                <div class="space-y-4 z-10">
                    <div>
                        <label class="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-2">Today's Workout Routine</label>
                        <textarea id="edit-routine-text" rows="5" placeholder="Enter exercises, sets, reps (e.g. Bench press 4x10...)" class="w-full bg-black/50 border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white resize-none outline-none font-mono leading-relaxed">${todaysRoutine}</textarea>
                    </div>

                    <div>
                        <label class="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-2">Previous Routines (History)</label>
                        <div class="max-h-[180px] overflow-y-auto pr-1 custom-scrollbar space-y-2">
                            ${historyHTML}
                        </div>
                    </div>
                </div>
                
                <!-- FOOTER -->
                <div class="flex justify-end space-x-3 border-t border-gray-800 pt-4 mt-5 z-10">
                    <button type="button" onclick="window.closeTrainerModal()" class="px-5 py-2.5 bg-black/40 border border-gray-800 hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">Cancel</button>
                    <button type="button" onclick="window.saveWorkoutRoutine('${member.id}')" class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all">Save Routine</button>
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
};

window.saveWorkoutRoutine = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return alert("Error: Member not found.");

    const newRoutine = document.getElementById('edit-routine-text').value.trim();
    const oldRoutine = member.todaysRoutine || "";

    if (newRoutine !== oldRoutine) {
        if (oldRoutine) {
            if (!member.routineHistory) member.routineHistory = [];
            member.routineHistory.push({
                date: new Date().toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                routine: oldRoutine
            });
        }
        member.todaysRoutine = newRoutine;
        member.routineCompleted = false;

        try {
            localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
        } catch(e) {}
    } else {
        member.routineCompleted = false;
        try {
            localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
        } catch(e) {}
    }

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .catch(e => console.error('[Firestore] Workout routine write failed:', e.message));
    }

    alert(`Workout routine for ${member.name} updated successfully.`);
    window.closeTrainerModal();
    navigateTo('trainer-portal');
};

window.openDietChartModal = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return alert("Error: Member not found.");

    const modal = document.getElementById('trainer-modal');
    if (!modal) return;

    const dietChart = member.dietChart || "";
    const data = member.assessmentData || {};
    const goal = data.fitnessGoal || "";
    const habit = data.foodHabit || "";

    const isVeg = (habit.toLowerCase().includes('veg') && !habit.toLowerCase().includes('non'));
    const isEgg = habit.toLowerCase().includes('egg');
    const isVegan = habit.toLowerCase().includes('vegan');
    const isNonVeg = !isVeg && !isEgg && !isVegan;

    const isWeightLoss = goal.toLowerCase().includes('loss') || goal.toLowerCase().includes('cut') || goal.toLowerCase().includes('slim');
    const isGain = goal.toLowerCase().includes('gain') || goal.toLowerCase().includes('bulk') || goal.toLowerCase().includes('build');
    const isPerformance = goal.toLowerCase().includes('perform') || goal.toLowerCase().includes('endur') || goal.toLowerCase().includes('stamina') || goal.toLowerCase().includes('strength');

    const savedApiKey = localStorage.getItem('GEMINI_API_KEY') || "";

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 via-darkBg to-black border border-gray-800 p-[2px] rounded-2xl w-[95%] max-w-lg shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col text-xs text-left relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-24 bg-indigo-600/5 blur-2xl"></div>
                
                <!-- HEADER -->
                <div class="flex items-center justify-between border-b border-gray-800 pb-4 mb-4 z-10">
                    <div class="flex items-center space-x-3">
                        <img src="${member.photoUrl}" class="w-10 h-10 rounded-full border border-gray-800 object-cover">
                        <div>
                            <h3 class="font-bold text-white text-base tracking-wide">Client Diet & Nutrition Plan</h3>
                            <p class="text-[10px] text-gray-500 font-mono">Fighter: ${member.name}</p>
                        </div>
                    </div>
                    <button onclick="window.closeTrainerModal()" class="text-gray-500 hover:text-white text-lg transition-colors"><i class="ph ph-x"></i></button>
                </div>
                
                <!-- BODY -->
                <div class="space-y-4 z-10">
                    <!-- Gemini AI Assistant Panel -->
                    <div class="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-indigo-400 font-extrabold text-[10px] uppercase tracking-wider flex items-center">
                                <i class="ph ph-sparkle mr-1.5 text-sm animate-pulse"></i> Gemini AI Assistant
                            </span>
                            <button type="button" onclick="window.toggleAIPrefs()" class="text-gray-400 hover:text-white text-[10px] flex items-center space-x-1 transition-colors">
                                <span id="prefs-toggle-text">Show Preferences</span> <i class="ph ph-caret-down" id="prefs-toggle-icon"></i>
                            </button>
                        </div>
                        
                        <!-- Collapsible AI Preferences -->
                        <div id="ai-prefs-container" class="hidden space-y-2 border-t border-gray-800/40 pt-2 text-[10px]">
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="text-gray-450 block mb-1">Target Goal</label>
                                    <select id="ai-target-goal" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1 text-white outline-none">
                                        <option value="Weight Cut / Weight Loss" ${isWeightLoss ? 'selected' : ''}>Weight Cut / Weight Loss</option>
                                        <option value="Lean Muscle Gain" ${isGain ? 'selected' : ''}>Lean Muscle Gain</option>
                                        <option value="Endurance & Performance" ${isPerformance ? 'selected' : ''}>Endurance & Performance</option>
                                        <option value="General Health / Maintenance" ${(!isWeightLoss && !isGain && !isPerformance) ? 'selected' : ''}>General Health / Maintenance</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-gray-450 block mb-1">Dietary Preference</label>
                                    <select id="ai-diet-type" class="w-full bg-black/60 border border-gray-800 rounded px-2.5 py-1 text-white outline-none">
                                        <option value="Non-Vegetarian" ${isNonVeg ? 'selected' : ''}>Non-Vegetarian</option>
                                        <option value="Vegetarian" ${isVeg ? 'selected' : ''}>Vegetarian</option>
                                        <option value="Eggitarian" ${isEgg ? 'selected' : ''}>Eggitarian</option>
                                        <option value="Vegan" ${isVegan ? 'selected' : ''}>Vegan</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center space-x-2">
                            <button type="button" onclick="window.generateDietWithAI('${member.id}')" id="btn-generate-ai" class="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold py-2 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-1.5">
                                <i class="ph ph-sparkle"></i> <span>Generate 7-Day Plan</span>
                            </button>
                            <button type="button" onclick="window.toggleKeySettings()" class="bg-black/40 border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white p-2 rounded-lg transition-all" title="Gemini API Key Settings">
                                <i class="ph ph-key"></i>
                            </button>
                        </div>

                        <!-- Collapsible API Key Settings -->
                        <div id="api-key-container" class="hidden space-y-2 border-t border-gray-800/40 pt-2 text-[10px] text-left">
                            <label class="text-gray-400 font-bold uppercase tracking-wider text-[8px] block">Gemini API Key</label>
                            <div class="flex space-x-2">
                                <input type="password" id="gemini-api-key" value="${savedApiKey}" placeholder="Paste API Key (AIzaSy...)" class="flex-1 bg-black/50 border border-gray-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-[10px] text-white outline-none font-mono">
                                <button type="button" onclick="window.saveApiKey()" class="bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all">Save</button>
                            </div>
                            <p class="text-[9px] text-gray-500">Get a free key from <a href="https://aistudio.google.com/" target="_blank" class="text-indigo-400 hover:underline">Google AI Studio</a>.</p>
                        </div>
                    </div>

                    <div>
                        <label class="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-2">Active Diet Chart Details</label>
                        <textarea id="edit-diet-text" rows="8" placeholder="Enter daily diet plan (e.g. Breakfast: Oats... Lunch: Chicken Rice...)" class="w-full bg-black/50 border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white resize-none outline-none font-mono leading-relaxed">${dietChart}</textarea>
                    </div>
                </div>
                
                <!-- FOOTER -->
                <div class="flex justify-end space-x-3 border-t border-gray-800 pt-4 mt-5 z-10">
                    <button type="button" onclick="window.closeTrainerModal()" class="px-5 py-2.5 bg-black/40 border border-gray-800 hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">Cancel</button>
                    <button type="button" onclick="window.saveDietChart('${member.id}')" class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all">Save Diet Chart</button>
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
};

// Toggle helpers
window.toggleAIPrefs = function() {
    const container = document.getElementById('ai-prefs-container');
    const icon = document.getElementById('prefs-toggle-icon');
    const text = document.getElementById('prefs-toggle-text');
    if (!container || !icon) return;

    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        icon.classList.remove('ph-caret-down');
        icon.classList.add('ph-caret-up');
        text.innerText = "Hide Preferences";
    } else {
        container.classList.add('hidden');
        icon.classList.remove('ph-caret-up');
        icon.classList.add('ph-caret-down');
        text.innerText = "Show Preferences";
    }
};

window.toggleKeySettings = function() {
    const container = document.getElementById('api-key-container');
    if (!container) return;
    container.classList.toggle('hidden');
};

window.toggleApiKeyVisibility = function() {
    const input = document.getElementById('gemini-api-key');
    const icon = document.getElementById('toggle-key-icon');
    if (!input || !icon) return;
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('ph-eye');
        icon.classList.add('ph-eye-closed');
    } else {
        input.type = 'password';
        icon.classList.remove('ph-eye-closed');
        icon.classList.add('ph-eye');
    }
};

window.saveApiKey = function() {
    const keyInput = document.getElementById('gemini-api-key');
    if (!keyInput) return;
    const key = keyInput.value.trim();
    if (!key) {
        alert("Please enter a valid API key.");
        return;
    }
    localStorage.setItem('GEMINI_API_KEY', key);
    alert("Gemini API Key saved successfully!");
    
    // Auto collapse after saving
    const container = document.getElementById('api-key-container');
    if (container) container.classList.add('hidden');
};

window.generateDietWithAI = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return alert("Error: Member not found.");

    const apiKeyInput = document.getElementById('gemini-api-key');
    let apiKey = (apiKeyInput ? apiKeyInput.value.trim() : '') || localStorage.getItem('GEMINI_API_KEY') || '';
    
    if (!apiKey) {
        alert("Please configure your Google Gemini API Key first.");
        const keyContainer = document.getElementById('api-key-container');
        if (keyContainer) keyContainer.classList.remove('hidden');
        if (apiKeyInput) apiKeyInput.focus();
        return;
    }

    const goal = document.getElementById('ai-target-goal').value;
    const dietType = document.getElementById('ai-diet-type').value;

    const btn = document.getElementById('btn-generate-ai');
    if (!btn) return;
    
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="ph ph-spinner animate-spin mr-1"></i> <span>Generating Plan...</span>`;
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    const data = member.assessmentData || {};
    
    let prompt = `You are a professional Clinical Nutritionist and Fitness Coach. Create a highly personalized 7-day diet chart/nutrition plan for a gym member based on the following Client Health Assessment details:

Client Profile Details:
- Name: ${member.name}
- Gender: ${data.gender || 'Not specified'}
- Fighter/Training Level: ${data.fighterLevel || member.plan || 'Regular active member'}
- Weekly Training Frequency: ${data.weeklyTrainingDays ? data.weeklyTrainingDays + ' days/week' : 'Not specified'}
- Medical History/Considerations: ${member.medicalHistory || 'None'} ${data.medicalElaboration ? '(' + data.medicalElaboration + ')' : ''}
- Daily Sleep: ${data.lifestyleSleep || '8'} hours
- Daily Water Intake: ${data.dietWaterIntake || '8'} glasses
- Lifestyle Stress Level (1-10): ${data.lifestyleStress || '5'}
- Current Supplements: ${data.dietSupplementsList || 'None'}
- Food Habits/Preferences: ${dietType}
- Target Goal selected by trainer: ${goal}
`;

    if (data.fitnessGoal) {
        prompt += `- General Goals declared by member: ${data.fitnessGoal}\n`;
    }
    if (data.dietMealFrequency) {
        prompt += `- Preferred Meal Frequency: ${data.dietMealFrequency} meals per day\n`;
    }
    if (data.dietEnergyDrops === 'yes') {
        prompt += `- Notes: Experiences energy drops during the day, specifically around: ${data.dietEnergyDropsWhen || 'mid-afternoon'}. Customize snacks/meals to prevent this.\n`;
    }

    prompt += `\nInstructions:
1. Provide a detailed 7-day meal plan including Breakfast, Lunch, Snack, and Dinner. Organize as DAY 1 to DAY 7.
2. The diet plan must follow ICMR (Indian Council of Medical Research) Indian food grade standards.
3. Suggest healthy, easy-to-cook options suitable for a busy professional lifestyle (quick preparation, standard Indian/continental healthy items).
4. For EACH individual meal (Breakfast, Lunch, Snack, Dinner) and for the daily total, provide a rough estimate of macronutrients (Protein, Carbohydrates, and Fats in grams).
5. Suggest hydration, recovery guidelines, and supplement recommendations based on their assessment.
6. Keep the tone encouraging, supportive, and professional.
7. The output must be written in clean, readable, professional text format, with spacing and headings, ready for copy-pasting. Do not use Markdown formatting symbols (like asterisks or hashtags) in the text itself so it looks clean in the plain textarea. Use plain CAPITAL headings (e.g. DAY 1, BREAKFAST, LUNCH) instead of markdown # or **.`;

    const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'];

    window.runGeminiWithFallbackChain = function(models, index, apiKey, prompt, btn, originalHTML) {
        if (index >= models.length) {
            alert("❌ AI Generation Failed: All model fallbacks failed. Please check your API key, region, and network connection.");
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            return;
        }

        const model = models[index];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        console.log(`[Gemini AI] Attempting generation with model: ${model}...`);

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
                    if (response.status === 404 || msg.includes("not found") || msg.includes("not supported")) {
                        console.warn(`[Gemini AI] Model ${model} failed (404/not supported), trying next fallback...`);
                        return window.runGeminiWithFallbackChain(models, index + 1, apiKey, prompt, btn, originalHTML);
                    }
                    throw new Error(msg || `API request failed with status ${response.status}`);
                });
            }
            return response.json().then(result => {
                if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0]) {
                    const generatedText = result.candidates[0].content.parts[0].text;
                    const textarea = document.getElementById('edit-diet-text');
                    if (textarea) {
                        textarea.value = generatedText;
                        textarea.classList.add('ring-2', 'ring-indigo-500');
                        setTimeout(() => {
                            textarea.classList.remove('ring-2', 'ring-indigo-500');
                        }, 1000);
                    }
                    alert("✅ 7-Day Nutrition Plan generated successfully! You can review, edit, and click 'Save Diet Chart' to apply it.");
                } else {
                    throw new Error("Invalid response format from Gemini API.");
                }
                btn.disabled = false;
                btn.innerHTML = originalHTML;
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
            });
        })
        .catch(err => {
            console.error(`[Gemini AI] Generation failed for model ${model}:`, err);
            alert(`❌ AI Generation Failed: ${err.message || 'Check your internet connection and API key.'}`);
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
        });
    };

    // First try to list available models programmatically using the API key
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
                console.log("[Gemini AI] Dynamically selected best available model: " + sorted[0]);
                window.runGeminiWithFallbackChain([sorted[0]], 0, apiKey, prompt, btn, originalHTML);
                return;
            }
        }
        throw new Error("No generateContent models found");
    })
    .catch(err => {
        console.warn("[Gemini AI] Could not query ListModels, running hardcoded fallback chain...", err);
        window.runGeminiWithFallbackChain(modelsToTry, 0, apiKey, prompt, btn, originalHTML);
    });
};

window.saveDietChart = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return alert("Error: Member not found.");

    const newDiet = document.getElementById('edit-diet-text').value.trim();
    member.dietChart = newDiet;

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .catch(e => console.error('[Firestore] Diet chart write failed:', e.message));
    }

    alert(`Diet chart for ${member.name} updated successfully.`);
    window.closeTrainerModal();
    navigateTo('trainer-portal');
};

window.generateDietDirectlyFromList = function(memberId) {
    window.openDietChartModal(memberId);
    setTimeout(() => {
        window.generateDietWithAI(memberId);
    }, 200);
};

// =========================================================================
// FIGHTER DETAIL & PRIVATE NOTES MODAL
// =========================================================================

window.showFighterProfileDetail = function(memberId) {
    const modal = document.getElementById('trainer-modal');
    if (!modal) return;

    window.renderFighterProfileModalContent(memberId);

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        if (modal.firstElementChild) {
            modal.firstElementChild.classList.remove('scale-95');
            modal.firstElementChild.classList.add('scale-100');
        }
    }, 10);
};

window.activeFighterModalTab = 'overview';

window.switchFighterModalTab = function(tabName, memberId) {
    window.activeFighterModalTab = tabName;
    window.renderFighterProfileModalContent(memberId);
};

window.renderFighterProfileModalContent = function(memberId) {
    const modal = document.getElementById('trainer-modal');
    if (!modal) return;

    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) {
        modal.innerHTML = `<div class="bg-darkBg p-6 border border-gray-800 rounded-xl text-center"><p class="text-red-500">Member not found.</p></div>`;
        return;
    }

    const medical = window.getFighterMedicalHistory ? window.getFighterMedicalHistory(member) : (member.medicalHistory || "None disclosed");
    const belt = member.beltRank || "White Belt";
    const record = member.fightRecord || "0 - 0 - 0";
    const recordParts = record.split('-').map(s => parseInt(s.trim(), 10) || 0);
    const wins = recordParts[0] !== undefined ? recordParts[0] : 0;
    const losses = recordParts[1] !== undefined ? recordParts[1] : 0;
    const draws = recordParts[2] !== undefined ? recordParts[2] : 0;
    const streak = `${member.streak || 0} Days`;
    const notes = member.privateNotes || [];

    // TABS HEADERS
    const tabHeaders = `
        <div class="flex border-b border-gray-800 pb-2 mb-4 space-x-4 sticky top-0 bg-darkBg/97 z-20 pt-1">
            <button onclick="window.switchFighterModalTab('overview', '${member.id}')" class="pb-1 text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${window.activeFighterModalTab === 'overview' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-white'}">
                Overview & Notes
            </button>
            <button onclick="window.switchFighterModalTab('performance', '${member.id}')" class="pb-1 text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${window.activeFighterModalTab === 'performance' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-white'}">
                Performance & Tracking
            </button>
        </div>
    `;

    let activeTabBody = "";

    // -------------------------------------------------------------
    // TAB: OVERVIEW & PRIVATE NOTES (Existing code, wrapped)
    // -------------------------------------------------------------
    if (window.activeFighterModalTab === 'overview') {
        const notesHtml = notes.length === 0
            ? `<p class="text-gray-600 text-[10px] italic py-4 text-center border border-dashed border-gray-800 rounded-xl bg-black/10">No private trainer notes recorded for this fighter yet.</p>`
            : notes.map((n, idx) => `
                <div class="bg-black/30 border border-gray-800/60 p-2.5 rounded-xl space-y-1 relative group">
                    <div class="text-gray-300 text-[10px] leading-relaxed whitespace-pre-wrap">${n.text}</div>
                    <div class="flex justify-between items-center text-[8px] text-gray-500 font-mono mt-1">
                        <span>Trainer Comment</span>
                        <span>${n.date}</span>
                    </div>
                </div>
            `).reverse().join('');

        activeTabBody = `
            <!-- Section 1: Fighter Profile View (Editable Belt & Record) -->
            <div class="space-y-3 mb-4">
                <h4 class="text-indigo-400 font-bold uppercase text-[9px] tracking-wider flex items-center">
                    <i class="ph ph-user-focus text-indigo-400 text-sm mr-1.5"></i>Fighter Profile Details
                </h4>
                
                <div class="grid grid-cols-2 gap-2">
                    <div class="bg-black/30 border border-gray-800/60 p-2.5 rounded-xl flex items-center space-x-2">
                        <div class="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-base"><i class="ph ph-medal"></i></div>
                        <div class="flex-1 min-w-0">
                            <p class="text-gray-500 text-[8px] uppercase font-bold mb-0.5">Belt Rank</p>
                            <select id="edit-member-belt" class="bg-black/40 border border-gray-800 rounded px-1.5 py-0.5 text-white text-[10px] font-bold font-mono focus:outline-none focus:border-indigo-500 w-full">
                                <option value="White Belt" ${belt === "White Belt" ? "selected" : ""}>White Belt</option>
                                <option value="Blue Belt" ${belt === "Blue Belt" ? "selected" : ""}>Blue Belt</option>
                                <option value="Purple Belt" ${belt === "Purple Belt" ? "selected" : ""}>Purple Belt</option>
                                <option value="Brown Belt" ${belt === "Brown Belt" ? "selected" : ""}>Brown Belt</option>
                                <option value="Black Belt" ${belt === "Black Belt" ? "selected" : ""}>Black Belt</option>
                            </select>
                        </div>
                    </div>
                    <div class="bg-black/30 border border-gray-800/60 p-2.5 rounded-xl flex items-center space-x-2">
                        <div class="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-base"><i class="ph ph-trophy"></i></div>
                        <div class="flex-1 min-w-0">
                            <p class="text-gray-500 text-[8px] uppercase font-bold mb-1">Fight Record (W - L - D)</p>
                            <div class="flex items-center space-x-1.5">
                                <input type="number" id="edit-member-wins" value="${wins}" min="0" class="bg-black/40 border border-gray-800 rounded px-1 py-0.5 text-white text-[10px] font-bold font-mono focus:outline-none focus:border-indigo-500 w-10 text-center" title="Wins">
                                <span class="text-gray-600 font-bold">-</span>
                                <input type="number" id="edit-member-losses" value="${losses}" min="0" class="bg-black/40 border border-gray-800 rounded px-1 py-0.5 text-white text-[10px] font-bold font-mono focus:outline-none focus:border-indigo-500 w-10 text-center" title="Losses">
                                <span class="text-gray-600 font-bold">-</span>
                                <input type="number" id="edit-member-draws" value="${draws}" min="0" class="bg-black/40 border border-gray-800 rounded px-1 py-0.5 text-white text-[10px] font-bold font-mono focus:outline-none focus:border-indigo-500 w-10 text-center" title="Draws">
                            </div>
                        </div>
                    </div>
                    <div class="bg-black/30 border border-gray-800/60 p-2.5 rounded-xl flex items-center space-x-2">
                        <div class="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg text-base"><i class="ph ph-fire"></i></div>
                        <div>
                            <p class="text-gray-500 text-[8px] uppercase font-bold">Attendance Streak</p>
                            <span class="text-white text-[11px] font-bold font-mono">${streak}</span>
                        </div>
                    </div>
                    <div class="bg-black/30 border border-gray-800/60 p-2.5 rounded-xl flex items-center space-x-2">
                        <div class="p-1.5 bg-red-500/10 text-red-500 rounded-lg text-base"><i class="ph ph-heartbeat"></i></div>
                        <div class="min-w-0">
                            <p class="text-gray-500 text-[8px] uppercase font-bold">Medical History</p>
                            <span class="text-white text-[10px] font-bold truncate block" title="${medical}">${medical}</span>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end mt-2">
                    <button onclick="window.saveFighterProfileFromTrainer('${member.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all shadow uppercase tracking-wide flex items-center space-x-1.5">
                        <i class="ph ph-floppy-disk text-xs"></i>
                        <span>Save Belt & Record</span>
                    </button>
                </div>
            </div>

            <!-- Section 2: Private Trainer Notes/Comments -->
            <div class="space-y-3 pt-3 border-t border-gray-800/50">
                <h4 class="text-indigo-400 font-bold uppercase text-[9px] tracking-wider flex items-center">
                    <i class="ph ph-note-pencil text-indigo-400 text-sm mr-1.5"></i>Private Trainer Comments
                </h4>
                
                <!-- Notes Scroll Log -->
                <div class="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar" id="fighter-notes-log-container">
                    ${notesHtml}
                </div>

                <!-- Add Note Input Form -->
                <div class="bg-black/30 border border-gray-800/60 p-2.5 rounded-xl space-y-1.5">
                    <label class="text-[8px] text-gray-500 font-bold uppercase block">Add Private Comment</label>
                    <textarea id="new-fighter-note-input" rows="2" placeholder="left hook weak, needs work..." class="w-full bg-black/40 border border-gray-800 focus:border-indigo-500 rounded-lg p-2 text-xs text-white resize-none outline-none font-mono"></textarea>
                    <button onclick="window.submitFighterNote('${member.id}')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition-all shadow uppercase tracking-wide">
                        Upload Note
                    </button>
                </div>
            </div>

            <!-- Section 3: Send Direct Message to Fighter (Fighter Portal Dashboard) -->
            <div class="space-y-3 pt-3 border-t border-gray-800/50">
                <h4 class="text-indigo-400 font-bold uppercase text-[9px] tracking-wider flex items-center">
                    <i class="ph ph-chat-text text-indigo-400 text-sm mr-1.5"></i>Send Direct Message to Fighter
                </h4>
                
                <!-- Messages Scroll Log (Trainer View) -->
                <div class="space-y-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar" id="fighter-direct-messages-container">
                    ${(member.trainerMessages || []).length === 0
                        ? `<p class="text-gray-600 text-[10px] italic py-4 text-center border border-dashed border-gray-800 rounded-xl bg-black/10">No direct messages sent to this fighter yet.</p>`
                        : member.trainerMessages.map(msg => `
                            <div class="bg-indigo-950/10 border border-indigo-500/20 p-2.5 rounded-xl space-y-1 relative group">
                                <div class="text-indigo-200 text-[10px] leading-relaxed whitespace-pre-wrap">${msg.message}</div>
                                <div class="flex justify-between items-center text-[8px] text-gray-500 font-mono mt-1">
                                    <span>Sent to Fighter</span>
                                    <span>${msg.date}</span>
                                </div>
                            </div>
                        `).reverse().join('')}
                </div>

                <!-- Add Message Input Form -->
                <div class="bg-black/30 border border-gray-800/60 p-2.5 rounded-xl space-y-1.5">
                    <label class="text-[8px] text-gray-500 font-bold uppercase block">New Message</label>
                    <textarea id="new-fighter-message-input" rows="2" placeholder="e.g. Bring your shin guards tomorrow..." class="w-full bg-black/40 border border-gray-800 focus:border-indigo-500 rounded-lg p-2 text-xs text-white resize-none outline-none font-mono"></textarea>
                    <button onclick="window.sendFighterDirectMessage('${member.id}')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition-all shadow uppercase tracking-wide">
                        Send Message
                    </button>
                </div>
            </div>
        `;
    }
    
    // -------------------------------------------------------------
    // TAB: PERFORMANCE & PROGRESS TRACKING (New features)
    // -------------------------------------------------------------
    else if (window.activeFighterModalTab === 'performance') {
        
        // 1. Attendance Monitor Calculations
        const attLogs = (window.MEMBER_ATTENDANCE_LOGS || []).filter(l => l.memberId === member.id && l.type === 'check-in');
        const checkInMap = {};
        attLogs.forEach(l => { checkInMap[l.date] = l.time; });

        const historyDays = [];
        let dayOffset = 0;
        while (historyDays.length < 10 && dayOffset < 30) {
            const d = new Date();
            d.setDate(d.getDate() - dayOffset);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            if (d.getDay() !== 0) { // Exclude Sundays
                historyDays.push(dateStr);
            }
            dayOffset++;
        }

        let lateStreak = 0;
        let attendanceStreak = 0;
        let isCurrentStreakBroken = false;
        let isLateStreakBroken = false;
        let totalAbsent = 0;
        let totalLate = 0;
        let totalOnTime = 0;

        const dayStatuses = historyDays.map(dateStr => {
            const checkInTime = checkInMap[dateStr];
            let status = 'Absent';
            let timeLabel = '--:--';
            
            if (checkInTime) {
                timeLabel = checkInTime;
                let cleanTime = checkInTime;
                if (checkInTime.includes(' ')) {
                    const parts = checkInTime.trim().split(' ');
                    if (parts.length === 3) cleanTime = parts[1] + ' ' + parts[2];
                    else if (parts.length === 2) cleanTime = parts[0] + ' ' + parts[1];
                }
                
                let hour = 8; let min = 0; let ampm = 'AM';
                const timeParts = cleanTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
                if (timeParts) {
                    hour = parseInt(timeParts[1], 10);
                    min = parseInt(timeParts[2], 10);
                    ampm = timeParts[3].toUpperCase();
                }
                
                let totalMinutes = hour * 60 + min;
                if (ampm === 'PM' && hour !== 12) totalMinutes += 12 * 60;
                if (ampm === 'AM' && hour === 12) totalMinutes -= 12 * 60;
                
                if (totalMinutes > 8 * 60) {
                    status = 'Late';
                    totalLate++;
                    if (!isLateStreakBroken) lateStreak++;
                } else {
                    status = 'On Time';
                    totalOnTime++;
                    isLateStreakBroken = true;
                }
                
                if (!isCurrentStreakBroken) attendanceStreak++;
            } else {
                status = 'Absent';
                totalAbsent++;
                isCurrentStreakBroken = true;
                isLateStreakBroken = true;
            }
            
            return { date: dateStr, status, time: timeLabel };
        });

        const attStrip = dayStatuses.map(ds => {
            const color = ds.status === 'On Time' ? 'text-green-400 bg-green-500/10' : ds.status === 'Late' ? 'text-amber-400 bg-amber-500/10' : 'text-red-500 bg-red-500/10';
            return `
                <div class="flex flex-col items-center p-1.5 rounded-lg border border-gray-800/80 min-w-[65px] bg-black/20 text-center font-mono">
                    <span class="text-[8px] text-gray-500">${ds.date.slice(-5)}</span>
                    <span class="text-[8px] font-bold px-1 py-0.5 rounded ${color} mt-1">${ds.status}</span>
                    <span class="text-[8px] text-gray-500 mt-0.5">${ds.time.split(' ')[0]}</span>
                </div>
            `;
        }).reverse().join('');


        // 2. Weight Cut SVG Graph & Logic
        const history = [...(member.weightHistory || [])].sort((a,b) => a.date.localeCompare(b.date)).slice(-6);
        const targetVal = member.targetWeight || 70.0;
        
        if (history.length === 0) {
            const baseW = parseFloat(member.weight) || 73.5;
            history.push({ date: '6-17', weight: baseW + 1.2 });
            history.push({ date: '6-19', weight: baseW + 0.8 });
            history.push({ date: '6-21', weight: baseW + 0.3 });
            history.push({ date: 'Today', weight: baseW });
        }

        const weights = history.map(h => h.weight);
        weights.push(targetVal);
        const minW = Math.min(...weights) - 1.5;
        const maxW = Math.max(...weights) + 1.5;
        const range = maxW - minW || 1;
        const getW_Y = (w) => 110 - ((w - minW) / range) * 75;

        const points = history.map((h, i) => {
            const x = 40 + i * (280 / Math.max(1, history.length - 1));
            const y = getW_Y(h.weight);
            return { x, y, weight: h.weight, date: h.date };
        });

        const linePath = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;
        const targetY = getW_Y(targetVal);

        let regressionLine = "";
        if (history.length >= 2) {
            let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            const n = history.length;
            for (let i = 0; i < n; i++) {
                sumX += i;
                sumY += history[i].weight;
                sumXY += i * history[i].weight;
                sumXX += i * i;
            }
            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
            const intercept = (sumY - slope * sumX) / n;
            const yStart = intercept;
            const yEnd = slope * (n - 1) + intercept;
            const ry1 = getW_Y(yStart);
            const ry2 = getW_Y(yEnd);
            regressionLine = `<line x1="${points[0].x}" y1="${ry1}" x2="${points[n-1].x}" y2="${ry2}" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3 3" />`;
        }


        // 3. Fitness Assessment (Sparring) Logs
        const sparringLogs = member.sparringLogs || [];
        if (sparringLogs.length === 0) {
            sparringLogs.push({
                date: '2026-06-15',
                round: 'Round 1',
                defense: { score: 4, notes: 'Good guard height' },
                offense: { score: 3, notes: 'Striking a bit hesitant' },
                cardio: { score: 4, notes: 'Maintained pace throughout' }
            });
            sparringLogs.push({
                date: '2026-06-20',
                round: 'Round 2',
                defense: { score: 3, notes: 'Dropped hands under pressure' },
                offense: { score: 4, notes: 'Sharp hook counters' },
                cardio: { score: 3, notes: 'Gassed in last 30s' }
            });
        }

        const sparringHtml = sparringLogs.map(log => `
            <div class="bg-black/30 border border-gray-800/80 p-2.5 rounded-xl text-[10px] space-y-1">
                <div class="flex justify-between items-center text-gray-500 font-mono text-[8px]">
                    <span class="font-bold text-indigo-400">${log.round} (${log.date})</span>
                    <span>Sparring Log</span>
                </div>
                <div class="grid grid-cols-3 gap-1 mt-1 text-center font-mono">
                    <div class="bg-blue-950/20 border border-blue-900/20 p-1 rounded">
                        <span class="text-gray-400 block text-[6px] uppercase font-sans">Defense</span>
                        <span class="text-blue-400 font-bold">${log.defense.score}/5</span>
                    </div>
                    <div class="bg-red-950/20 border border-red-900/20 p-1 rounded">
                        <span class="text-gray-400 block text-[6px] uppercase font-sans">Offense</span>
                        <span class="text-red-400 font-bold">${log.offense.score}/5</span>
                    </div>
                    <div class="bg-green-950/20 border border-green-900/20 p-1 rounded">
                        <span class="text-gray-400 block text-[6px] uppercase font-sans">Cardio</span>
                        <span class="text-green-400 font-bold">${log.cardio.score}/5</span>
                    </div>
                </div>
                <div class="text-[8px] text-gray-400 leading-relaxed mt-1 italic pl-1 border-l border-gray-850">
                    Def: ${log.defense.notes || 'None'} | Off: ${log.offense.notes || 'None'} | Cardio: ${log.cardio.notes || 'None'}
                </div>
            </div>
        `).reverse().join('');


        // 4. Technique Checklist render helper
        const checklist = member.techniqueChecklist || {};
        const renderCheckItem = (key, label) => {
            const checked = !!checklist[key];
            return `
                <label class="flex items-center space-x-1.5 bg-black/25 border border-gray-800/80 px-2.5 py-1.5 rounded-lg cursor-pointer hover:border-indigo-500/40 transition-colors">
                    <input type="checkbox" class="rounded border-gray-850 text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-transparent w-3 h-3" onclick="window.toggleTechniqueChecklist('${member.id}', '${key}')" ${checked ? 'checked' : ''}>
                    <span class="text-gray-300 font-mono text-[9px] select-none">${label}</span>
                </label>
            `;
        };

        activeTabBody = `
            <div class="space-y-4">
                
                <!-- 1. Attendance Monitor -->
                <div class="space-y-2 border-b border-gray-800/80 pb-3">
                    <h4 class="text-indigo-400 font-bold uppercase text-[9px] tracking-wider flex items-center">
                        <i class="ph ph-calendar-check text-indigo-400 text-sm mr-1.5"></i>Attendance Monitor
                    </h4>
                    <div class="grid grid-cols-3 gap-2 text-center font-mono">
                        <div class="bg-black/30 border border-gray-800/60 p-2 rounded-xl">
                            <p class="text-gray-500 text-[8px] uppercase">On-Time</p>
                            <p class="text-green-400 text-xs font-black mt-0.5">${totalOnTime}</p>
                        </div>
                        <div class="bg-black/30 border border-gray-800/60 p-2 rounded-xl">
                            <p class="text-gray-500 text-[8px] uppercase">Late</p>
                            <p class="text-amber-400 text-xs font-black mt-0.5">${totalLate}</p>
                        </div>
                        <div class="bg-black/30 border border-gray-800/60 p-2 rounded-xl">
                            <p class="text-gray-500 text-[8px] uppercase">Absent</p>
                            <p class="text-red-500 text-xs font-black mt-0.5">${totalAbsent}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-center mt-2 font-mono">
                        <div class="bg-indigo-950/20 border border-indigo-900/30 p-2 rounded-xl">
                            <p class="text-[8px] text-indigo-400 uppercase">Streak Present</p>
                            <p class="text-white text-xs font-black">${attendanceStreak} Days</p>
                        </div>
                        <div class="bg-amber-950/20 border border-amber-900/30 p-2 rounded-xl">
                            <p class="text-[8px] text-amber-400 uppercase">Streak Late</p>
                            <p class="text-white text-xs font-black">${lateStreak} Days</p>
                        </div>
                    </div>
                    <div class="flex space-x-1.5 overflow-x-auto pr-1 py-1 custom-scrollbar w-full mt-2">
                        ${attStrip}
                    </div>
                </div>

                <!-- 2. Weight Cut Graph -->
                <div class="space-y-2 border-b border-gray-800/80 pb-3">
                    <h4 class="text-indigo-400 font-bold uppercase text-[9px] tracking-wider flex items-center">
                        <i class="ph ph-trend-down text-indigo-400 text-sm mr-1.5"></i>Weight Cut progression
                    </h4>
                    
                    <!-- SVG Chart -->
                    <div class="relative w-full">
                        <svg viewBox="0 0 380 140" class="w-full h-28 overflow-visible bg-black/20 rounded-xl p-2 border border-gray-800/40">
                            <line x1="30" y1="35" x2="350" y2="35" stroke="#1F2937" stroke-dasharray="2" />
                            <line x1="30" y1="72" x2="350" y2="72" stroke="#1F2937" stroke-dasharray="2" />
                            <line x1="30" y1="110" x2="350" y2="110" stroke="#1F2937" stroke-dasharray="2" />
                            
                            <line x1="30" y1="${targetY}" x2="350" y2="${targetY}" stroke="#EF4444" stroke-width="1" stroke-dasharray="4 4" />
                            <text x="345" y="${targetY - 4}" fill="#EF4444" font-size="7" font-weight="bold" text-anchor="end">Target: ${targetVal}kg</text>
                            
                            <path d="${linePath}" fill="none" stroke="#10B981" stroke-width="2" />
                            ${regressionLine}
                            
                            ${points.map((p, idx) => `
                                <circle cx="${p.x}" cy="${p.y}" r="3" fill="#10B981" stroke="#1E1E1E" stroke-width="1" />
                                <text x="${p.x}" y="${p.y - 6}" fill="#10B981" font-size="6" text-anchor="middle" font-weight="bold" font-family="monospace">${p.weight}</text>
                                <text x="${p.x}" y="130" fill="#4B5563" font-size="6" text-anchor="middle" font-family="monospace">${p.date.slice(-5)}</text>
                            `).join('')}
                        </svg>
                        <div class="absolute top-2 left-2 flex items-center space-x-3 text-[8px] font-mono text-gray-500">
                            <div class="flex items-center space-x-1"><span class="w-2 h-0.5 bg-green-500 inline-block"></span><span>Weight Logs</span></div>
                            <div class="flex items-center space-x-1"><span class="w-2 h-0.5 bg-blue-500 stroke-dasharray-3 inline-block"></span><span>Trend line</span></div>
                        </div>
                    </div>

                    <!-- Inputs -->
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <div class="bg-black/30 border border-gray-800 p-2.5 rounded-xl">
                            <label class="text-[8px] text-gray-500 font-bold uppercase block">Log Daily Weight (KG)</label>
                            <input type="number" step="0.1" id="daily-weight-log" placeholder="e.g. 71.5" class="w-full bg-black/40 border border-gray-800 focus:border-indigo-500 rounded px-2 py-1 text-[10px] text-white outline-none mt-1 font-mono">
                        </div>
                        <div class="bg-black/30 border border-gray-800 p-2.5 rounded-xl">
                            <label class="text-[8px] text-gray-500 font-bold uppercase block">Update Target Weight (KG)</label>
                            <input type="number" step="0.1" id="target-weight-log" value="${targetVal}" class="w-full bg-black/40 border border-gray-800 focus:border-indigo-500 rounded px-2 py-1 text-[10px] text-white outline-none mt-1 font-mono">
                        </div>
                    </div>
                    <button onclick="window.logFighterWeight('${member.id}')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-2 rounded-xl transition-all shadow uppercase tracking-wide">
                        Update Weight Target & Log
                    </button>
                </div>

                <!-- 3. Fitness Assessment Log (Sparring) -->
                <div class="space-y-2 border-b border-gray-800/80 pb-3">
                    <h4 class="text-indigo-400 font-bold uppercase text-[9px] tracking-wider flex items-center">
                        <i class="ph ph-sword text-indigo-400 text-sm mr-1.5"></i>Fitness Assessment (Sparring Log)
                    </h4>
                    
                    <div class="bg-black/30 border border-gray-800 p-3 rounded-xl space-y-2">
                        <div class="grid grid-cols-4 gap-2">
                            <div class="col-span-1">
                                <label class="text-[7px] text-gray-500 font-bold uppercase">Round</label>
                                <select id="sparring-round" class="w-full bg-black/50 border border-gray-800 rounded px-1 py-1 text-[9px] text-white outline-none mt-0.5 font-mono">
                                    <option>Round 1</option><option>Round 2</option><option>Round 3</option><option>Round 4</option><option>Round 5</option>
                                </select>
                            </div>
                            <div class="col-span-1">
                                <label class="text-[7px] text-gray-500 font-bold uppercase">Defense</label>
                                <select id="sparring-defense-score" class="w-full bg-black/50 border border-gray-800 rounded px-1 py-1 text-[9px] text-white outline-none mt-0.5 font-mono">
                                    <option value="5">5/5 ★</option><option value="4" selected>4/5 ★</option><option value="3">3/5 ★</option><option value="2">2/5 ★</option><option value="1">1/5 ★</option>
                                </select>
                            </div>
                            <div class="col-span-1">
                                <label class="text-[7px] text-gray-500 font-bold uppercase">Offense</label>
                                <select id="sparring-offense-score" class="w-full bg-black/50 border border-gray-800 rounded px-1 py-1 text-[9px] text-white outline-none mt-0.5 font-mono">
                                    <option value="5">5/5 ★</option><option value="4" selected>4/5 ★</option><option value="3">3/5 ★</option><option value="2">2/5 ★</option><option value="1">1/5 ★</option>
                                </select>
                            </div>
                            <div class="col-span-1">
                                <label class="text-[7px] text-gray-500 font-bold uppercase">Cardio</label>
                                <select id="sparring-cardio-score" class="w-full bg-black/50 border border-gray-800 rounded px-1 py-1 text-[9px] text-white outline-none mt-0.5 font-mono">
                                    <option value="5">5/5 ★</option><option value="4" selected>4/5 ★</option><option value="3">3/5 ★</option><option value="2">2/5 ★</option><option value="1">1/5 ★</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-2">
                            <div>
                                <label class="text-[7px] text-gray-500 font-bold uppercase">Defense Notes</label>
                                <input type="text" id="sparring-defense-notes" placeholder="notes" class="w-full bg-black/50 border border-gray-800 rounded px-2 py-1 text-[9px] text-white outline-none mt-0.5 font-mono">
                            </div>
                            <div>
                                <label class="text-[7px] text-gray-500 font-bold uppercase">Offense Notes</label>
                                <input type="text" id="sparring-offense-notes" placeholder="notes" class="w-full bg-black/50 border border-gray-800 rounded px-2 py-1 text-[9px] text-white outline-none mt-0.5 font-mono">
                            </div>
                            <div>
                                <label class="text-[7px] text-gray-500 font-bold uppercase">Cardio Notes</label>
                                <input type="text" id="sparring-cardio-notes" placeholder="notes" class="w-full bg-black/50 border border-gray-800 rounded px-2 py-1 text-[9px] text-white outline-none mt-0.5 font-mono">
                            </div>
                        </div>
                        <button onclick="window.logFighterSparring('${member.id}')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition-all shadow uppercase tracking-wide">
                            Save Sparring Log
                        </button>
                    </div>
                    
                    <div class="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar mt-2">
                        ${sparringHtml}
                    </div>
                </div>

                <!-- 4. Technique Checklist -->
                <div class="space-y-2">
                    <h4 class="text-indigo-400 font-bold uppercase text-[9px] tracking-wider flex items-center">
                        <i class="ph ph-shield-check text-indigo-400 text-sm mr-1.5"></i>Technique Checklist
                    </h4>
                    
                    <div class="grid grid-cols-3 gap-3">
                        <div class="space-y-2">
                            <span class="text-[8px] text-gray-500 uppercase font-black tracking-wider block border-b border-gray-850 pb-1">Striking</span>
                            <div class="flex flex-col space-y-1.5">
                                ${renderCheckItem('striking_jab', 'Jab / Cross')}
                                ${renderCheckItem('striking_hook', 'Hook / Uppercut')}
                                ${renderCheckItem('striking_kick', 'Kicks (Low/Head)')}
                                ${renderCheckItem('striking_elbow', 'Elbows & Knees')}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <span class="text-[8px] text-gray-500 uppercase font-black tracking-wider block border-b border-gray-850 pb-1">Grappling</span>
                            <div class="flex flex-col space-y-1.5">
                                ${renderCheckItem('grappling_takedown', 'Takedowns')}
                                ${renderCheckItem('grappling_sprawl', 'Sprawl & Brawl')}
                                ${renderCheckItem('grappling_clinch', 'Clinch Control')}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <span class="text-[8px] text-gray-500 uppercase font-black tracking-wider block border-b border-gray-850 pb-1">Submissions</span>
                            <div class="flex flex-col space-y-1.5">
                                ${renderCheckItem('sub_rnc', 'Rear Naked Choke')}
                                ${renderCheckItem('sub_armbar', 'Armbar / Tri')}
                                ${renderCheckItem('sub_guillotine', 'Guillotine / Kim')}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[440px] max-w-full shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/97 rounded-[14px] p-5 flex flex-col relative text-xs text-left max-h-[85vh] overflow-y-auto custom-scrollbar">
                
                <button onclick="window.closeTrainerModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                
                <!-- Fighter Summary Header -->
                <div class="flex items-center space-x-3 border-b border-gray-800/80 pb-3 mb-3">
                    <img src="${member.photoUrl || 'https://images.unsplash.com/photo-1597403864947-a85709d7d4c8?w=200'}" class="w-12 h-12 rounded-xl object-cover border border-gray-800 shadow-md">
                    <div>
                        <h3 class="text-white font-bold text-sm tracking-wide">${member.name}</h3>
                        <p class="text-gray-500 text-[9px] uppercase font-mono mt-0.5">${member.plan}</p>
                        <p class="text-gray-500 text-[9px] font-mono">${member.phone || member.email}</p>
                    </div>
                </div>

                <!-- TABS SWITCHER -->
                ${tabHeaders}

                <!-- ACTIVE TAB BODY -->
                ${activeTabBody}

            </div>
        </div>
    `;
};

window.saveFighterProfileFromTrainer = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return alert("Error: Member not found.");

    const newBelt = document.getElementById('edit-member-belt').value;
    const wins = parseInt(document.getElementById('edit-member-wins').value, 10) || 0;
    const losses = parseInt(document.getElementById('edit-member-losses').value, 10) || 0;
    const draws = parseInt(document.getElementById('edit-member-draws').value, 10) || 0;

    member.beltRank = newBelt;
    member.fightRecord = `${wins} - ${losses} - ${draws}`;

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .then(() => console.log('[Firestore] Fighter belt & record updated:', member.id))
            .catch(e => console.error('[Firestore] Save member failed:', e.message));
    }

    window.renderFighterProfileModalContent(memberId);
    alert(`Success!\n${member.name}'s belt rank and fight record have been updated.`);
};

window.submitFighterNote = function(memberId) {
    const textarea = document.getElementById('new-fighter-note-input');
    if (!textarea) return;
    const noteText = textarea.value.trim();
    if (!noteText) {
        alert("Please enter note text!");
        return;
    }

    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    if (!member.privateNotes) member.privateNotes = [];
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')} ${String(today.getHours()).padStart(2,'0')}:${String(today.getMinutes()).padStart(2,'0')}`;
    
    member.privateNotes.push({
        text: noteText,
        date: dateStr
    });

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .then(() => console.log('[Firestore] Private notes saved:', member.id))
            .catch(e => console.error('[Firestore] Private notes save failed:', e.message));
    }

    textarea.value = "";
    window.renderFighterProfileModalContent(memberId);
    alert("Private note uploaded successfully!");
};

window.logFighterWeight = function(memberId) {
    const weightInput = document.getElementById('daily-weight-log');
    const targetInput = document.getElementById('target-weight-log');
    if (!weightInput || !targetInput) return;

    const weight = parseFloat(weightInput.value);
    const target = parseFloat(targetInput.value);

    if (isNaN(weight) && isNaN(target)) {
        alert("Please enter a valid weight or target weight.");
        return;
    }

    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    if (!isNaN(target)) {
        member.targetWeight = target;
    }

    if (!isNaN(weight)) {
        if (!member.weightHistory) member.weightHistory = [];
        const todayStr = new Date().toISOString().slice(0, 10);
        const existingIdx = member.weightHistory.findIndex(h => h.date === todayStr);
        if (existingIdx !== -1) {
            member.weightHistory[existingIdx].weight = weight;
        } else {
            member.weightHistory.push({ date: todayStr, weight });
        }
        member.weight = `${weight} KG`;
    }

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .then(() => {
                console.log('[Firestore] Fighter weight updated:', member.id);
                window.renderFighterProfileModalContent(memberId);
                alert("Weight details logged and updated successfully!");
            })
            .catch(e => console.error('[Firestore] Save member failed:', e.message));
    } else {
        window.renderFighterProfileModalContent(memberId);
        alert("Weight details updated successfully (offline cache)!");
    }
};

window.logFighterSparring = function(memberId) {
    const roundVal = document.getElementById('sparring-round').value;
    const defenseScore = parseInt(document.getElementById('sparring-defense-score').value, 10);
    const defenseNotes = document.getElementById('sparring-defense-notes').value.trim();
    const offenseScore = parseInt(document.getElementById('sparring-offense-score').value, 10);
    const offenseNotes = document.getElementById('sparring-offense-notes').value.trim();
    const cardioScore = parseInt(document.getElementById('sparring-cardio-score').value, 10);
    const cardioNotes = document.getElementById('sparring-cardio-notes').value.trim();

    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    if (!member.sparringLogs) member.sparringLogs = [];
    
    const newLog = {
        date: new Date().toISOString().slice(0, 10),
        round: roundVal,
        defense: { score: defenseScore, notes: defenseNotes },
        offense: { score: offenseScore, notes: offenseNotes },
        cardio: { score: cardioScore, notes: cardioNotes }
    };

    member.sparringLogs.push(newLog);

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .then(() => {
                console.log('[Firestore] Sparring log added:', member.id);
                window.renderFighterProfileModalContent(memberId);
                alert("Sparring performance log added successfully!");
            })
            .catch(e => console.error('[Firestore] Save member failed:', e.message));
    } else {
        window.renderFighterProfileModalContent(memberId);
        alert("Sparring performance log added successfully (offline cache)!");
    }
};

window.toggleTechniqueChecklist = function(memberId, key) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    if (!member.techniqueChecklist) member.techniqueChecklist = {};
    member.techniqueChecklist[key] = !member.techniqueChecklist[key];

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .then(() => {
                console.log(`[Firestore] Technique checklist item ${key} toggled`);
            })
            .catch(e => console.error('[Firestore] Save member failed:', e.message));
    }
};

window.sendFighterDirectMessage = function(memberId) {
    const textarea = document.getElementById('new-fighter-message-input');
    if (!textarea) return;
    const msgText = textarea.value.trim();
    if (!msgText) {
        alert("Please enter message text!");
        return;
    }

    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    if (!member.trainerMessages) member.trainerMessages = [];
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')} ${String(today.getHours()).padStart(2,'0')}:${String(today.getMinutes()).padStart(2,'0')}`;
    
    member.trainerMessages.push({
        message: msgText,
        date: dateStr,
        trainerName: loggedInTrainer ? loggedInTrainer.name : "Trainer"
    });

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    if (window.dbService && typeof window.dbService.setDocument === 'function') {
        window.dbService.setDocument('members', member.id, member)
            .then(() => console.log('[Firestore] Direct message saved:', member.id))
            .catch(e => console.error('[Firestore] Direct message save failed:', e.message));
    }

    textarea.value = "";
    window.renderFighterProfileModalContent(memberId);
    alert("Direct message sent successfully!");
};
