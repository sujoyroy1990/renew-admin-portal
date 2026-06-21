// =========================================================================
// js/components/trainer_portal.js — TRAINER PORTAL HUB (DEMO)
// =========================================================================

let loggedInTrainer = null;
let trainerCurrentTab = 'dashboard';

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
    const assignedFighters = MOCK_MEMBERS.filter(m => m.trainerId === t.id);

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
                                                    <h5 class="text-white font-bold text-xs">${f.name}</h5>
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
                                    <h5 class="text-white font-bold text-xs">${f.name}</h5>
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
                        <button onclick="window.openDietChartModal('${f.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow">
                            Update Diet
                        </button>
                    `;
                }

                return `
                    <div class="bg-black/20 border border-gray-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/40 transition-all shadow-md">
                        <div class="flex items-center space-x-3.5">
                            <img src="${f.photoUrl}" class="w-12 h-12 rounded-full border border-gray-800 object-cover shadow-sm">
                            <div>
                                <div class="flex items-center space-x-2">
                                    <h5 class="text-white font-bold text-xs">${f.name}</h5>
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
                                <input type="text" id="edit-t-phone" value="${t.phone}" class="w-full bg-black/50 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
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

    const commissionRules = window.COMMISSION_RULES || { 'pt': 0.20, 'diet plan': 0.10, 'supplement': 0.05 };
    const rateLabels = { 'pt': '20%', 'diet plan': '10%', 'supplement': '5%' };

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

    if (!window.TRAINER_ATTENDANCE_LOGS) window.TRAINER_ATTENDANCE_LOGS = [];
    window.TRAINER_ATTENDANCE_LOGS.push({
        trainerId: loggedInTrainer.id,
        trainerName: loggedInTrainer.name,
        type: "check-in",
        date: todayStr,
        time: timeFormatted
    });

    try {
        localStorage.setItem('RENEW_TRAINER_ATTENDANCE_DB', JSON.stringify(window.TRAINER_ATTENDANCE_LOGS));
        localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(window.MOCK_TRAINERS));
    } catch(e) {}

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

    if (!window.TRAINER_ATTENDANCE_LOGS) window.TRAINER_ATTENDANCE_LOGS = [];
    window.TRAINER_ATTENDANCE_LOGS.push({
        trainerId: loggedInTrainer.id,
        trainerName: loggedInTrainer.name,
        type: "check-out",
        date: todayStr,
        time: timeFormatted
    });

    try {
        localStorage.setItem('RENEW_TRAINER_ATTENDANCE_DB', JSON.stringify(window.TRAINER_ATTENDANCE_LOGS));
        localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(window.MOCK_TRAINERS));
    } catch(e) {}

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

window.saveDietChart = function(memberId) {
    const member = window.MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return alert("Error: Member not found.");

    const newDiet = document.getElementById('edit-diet-text').value.trim();
    member.dietChart = newDiet;

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
    } catch(e) {}

    alert(`Diet chart for ${member.name} updated successfully.`);
    window.closeTrainerModal();
    navigateTo('trainer-portal');
};
