// =========================================================================
// js/components/dashboard.js — MASTER ADMIN DASHBOARD WITH UNIQUE EVENT NO
// =========================================================================

let currentDashboardTab = 'present'; 

// ১. সেন্ট্রালাইজড গ্লোবাল ইভেন্ট ডাটাবেস (Unique Event Number ও Amount সহ)
if (!window.GYM_EVENTS) {
    window.GYM_EVENTS = [
        { id: "evt-01", eventNo: "EVT-101", title: "MMA Cage Fighting Masterclass", date: "2026-06-25", time: "06:00 PM", amount: 1500, description: "Special striking and takedown defense seminar with Coach Rahul Sharma. Free for active fighters.", venue: "Main Ring Floor Zone A" },
        { id: "evt-02", eventNo: "EVT-102", title: "Keto & Weight Cut Nutrition Seminar", date: "2026-07-02", time: "11:00 AM", amount: 800, description: "Learn how to optimize macro counting and manage weight cuts before tournaments.", venue: "Cafeteria Lounge" }
    ];
}

if (!window.PENDING_TRAINERS) {
    window.PENDING_TRAINERS = [
        { id: "req-01", name: "Souvik Roy", email: "souvik@renew.com", phone: "+91 98765 43210", specialty: "Bodybuilding & MMA", experience: "5 Years" },
        { id: "req-02", name: "Priya Banerjee", email: "priya@renew.com", phone: "+91 91234 56789", specialty: "Yoga & Pilates", experience: "3 Years" }
    ];
}

function getDashboardView() {
    return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-metrics">
                <p class="text-gray-500">Loading metrics...</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 bg-darkSurface border border-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4">
                    <h4 class="text-gray-400 font-semibold tracking-wide text-xs uppercase">Smart Reception QR</h4>
                    <div class="w-44 h-44 bg-white rounded-xl flex items-center justify-center p-3 shadow-lg" id="qr-code-box">
                        <div class="text-black font-bold text-xs tracking-wide animate-pulse">Generating QR...</div>
                    </div>
                    <p class="text-xs text-gray-500 bg-black/30 px-3 py-1 rounded-full font-mono" id="qr-token">Token: Generating...</p>
                    <p id="qr-timer" class="text-[10px] text-brandRed font-mono mt-1"></p>
                </div>
                <div class="lg:col-span-2 bg-darkSurface border border-gray-800 p-6 rounded-2xl flex flex-col" id="live-scan-container">
                    <p class="text-gray-500 text-sm">Loading Live Scan Monitor...</p>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div class="xl:col-span-2 bg-darkSurface border border-gray-800 p-6 rounded-2xl flex flex-col justify-between" id="admin-events-board"></div>
                <div class="xl:col-span-1 bg-darkSurface border border-gray-800 p-6 rounded-2xl flex flex-col justify-between" id="trainer-approvals-container"></div>
            </div>
            <div id="dashboard-local-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"></div>
        </div>
    `;
}

function renderDashboardMetrics() {
    const metrics = getDashboardMetrics(); 
    const metricsContainer = document.getElementById('dashboard-metrics');
    if (metricsContainer) {
        metricsContainer.innerHTML = `
            <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4">
                <div class="p-3 bg-blue-500/10 text-blue-500 rounded-xl text-2xl"><i class="ph ph-users"></i></div>
                <div><p class="text-gray-400 text-xs font-medium">Total Members</p><h4 class="text-2xl font-bold mt-1">${metrics.totalMembers}</h4></div>
            </div>
            <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4">
                <div class="p-3 bg-green-500/10 text-green-400 rounded-xl text-2xl"><i class="ph ph-calendar-check"></i></div>
                <div><p class="text-gray-400 text-xs font-medium">Daily Present</p><h4 class="text-2xl font-bold mt-1">${metrics.dailyPresent}</h4></div>
            </div>
            <div class="bg-darkSurface border border-gray-800 p-5 rounded-2xl flex items-center space-x-4">
                <div class="p-3 bg-purple-500/10 text-purple-400 rounded-xl text-2xl"><i class="ph ph-chart-bar"></i></div>
                <div><p class="text-gray-400 text-xs font-medium">Avg Attendance</p><h4 class="text-2xl font-bold mt-1">${metrics.avgAttendance}</h4></div>
            </div>
            <div class="bg-darkSurface border border-brandRed/10 p-5 rounded-2xl flex items-center space-x-4">
                <div class="p-3 bg-brandRed/10 text-brandRed rounded-xl text-2xl"><i class="ph ph-clock-countdown"></i></div>
                <div><p class="text-gray-400 text-xs font-medium">Expiring Soon</p><h4 class="text-2xl font-bold mt-1">${metrics.expiringSoon}</h4></div>
            </div>
        `;
    }
}

function renderLiveStatusTracking() {
    const container = document.getElementById('live-scan-container'); 
    if (!container) return;

    const presentMembers = MOCK_MEMBERS.filter(m => m.checkedInToday);
    const expiringMembers = MOCK_MEMBERS.filter(m => m.status === 'expiring' || m.status === 'at_risk');

    const tableHeaders = currentDashboardTab === 'present' 
        ? `<th class="py-3 px-4">Member</th><th class="py-3 px-4">In Time</th><th class="py-3 px-4">Out Time</th><th class="py-3 px-4">Live Status</th>`
        : `<th class="py-3 px-4">Member</th><th class="py-3 px-4">Plan / Expiry</th><th class="py-3 px-4">Alert Type</th>`;

    container.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h4 class="text-gray-400 font-semibold tracking-wide text-xs uppercase">Live Scan Monitor</h4>
            <div class="flex space-x-2 bg-black/40 p-1 rounded-lg border border-gray-800">
                <button onclick="window.switchDashboardTab('present')" class="px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${currentDashboardTab === 'present' ? 'bg-brandRed text-white shadow' : 'text-gray-400 hover:text-white'}">Today's Present (${presentMembers.length})</button>
                <button onclick="window.switchDashboardTab('expiring')" class="px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${currentDashboardTab === 'expiring' ? 'bg-brandRed text-white shadow' : 'text-gray-400 hover:text-white'}">Alerts / Expiring (${expiringMembers.length})</button>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-400">
                <thead class="text-xs uppercase bg-black/20 text-gray-500 border-b border-gray-800"><tr>${tableHeaders}</tr></thead>
                <tbody class="divide-y divide-gray-800/50">${currentDashboardTab === 'present' ? renderPresentRows(presentMembers) : renderExpiringRows(expiringMembers)}</tbody>
            </table>
        </div>
    `;
    renderTrainerApprovals();
    renderAdminEventsBoard();
}

function renderPresentRows(members) {
    if(members.length === 0) return `<tr><td colspan="4" class="p-4 text-center text-gray-600 text-xs">No scan activity recorded today.</td></tr>`;
    return members.map(m => {
        const inTime = m.lastCheckIn ? m.lastCheckIn.trim().slice(-8) : 'N/A';
        const outTime = m.lastCheckOut ? m.lastCheckOut.trim().slice(-8) : '--:--';
        return `<tr class="hover:bg-white/[0.02] transition-colors"><td class="py-3 px-4 flex items-center space-x-3"><img src="${m.photoUrl}" class="w-8 h-8 rounded-full border border-gray-700 object-cover"><div><p class="text-white font-medium text-sm">${m.name}</p><p class="text-[10px] text-gray-500 font-mono">${m.plan}</p></div></td><td class="py-3 px-4 text-gray-300 font-mono text-xs">${inTime}</td><td class="py-3 px-4 text-gray-500 font-mono text-xs">${outTime}</td><td class="py-3 px-4">${!m.lastCheckOut ? '<span class="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center w-20"><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>Inside</span>' : '<span class="text-[10px] bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded-full font-bold uppercase w-16 text-center block">Left</span>'}</td></tr>`;
    }).join('');
}

function renderExpiringRows(members) {
    if(members.length === 0) return `<tr><td colspan="3" class="p-4 text-center text-gray-600 text-xs">No critical expiry alerts at this moment.</td></tr>`;
    return members.map(m => `<tr class="hover:bg-white/[0.02] transition-colors"><td class="py-3 px-4 flex items-center space-x-3"><img src="${m.photoUrl}" class="w-8 h-8 rounded-full border border-gray-700 object-cover"><span class="text-white font-medium">${m.name}</span></td><td class="py-3 px-4 text-xs">Expiry: <span class="font-mono text-gray-300">${m.expiryDate}</span></td><td class="py-3 px-4"><span class="text-[10px] border px-2 py-0.5 rounded-full uppercase font-bold ${m.status === 'at_risk' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-red-500/10 text-brandRed border-red-500/20'}">${m.status === 'at_risk' ? 'At Risk' : 'Expiring'}</span></td></tr>`).join('');
}

function renderAdminEventsBoard() {
    const container = document.getElementById('admin-events-board');
    if (!container) return;

    container.innerHTML = `
        <div class="flex justify-between items-center border-b border-gray-800/60 pb-3 mb-4">
            <h4 class="text-gray-400 font-semibold tracking-wide text-xs uppercase flex items-center">
                <i class="ph ph-calendar-plus text-brandRed text-base mr-1.5"></i>Official Events Bulletin Center (${window.GYM_EVENTS.length})
            </h4>
            <button onclick="window.openCreateEventModal()" class="text-[10px] bg-brandRed hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-md transition-colors shadow flex items-center space-x-1">
                <i class="ph ph-plus-circle text-xs"></i><span>Publish New Event</span>
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            ${window.GYM_EVENTS.length === 0 ? `<p class="text-gray-600 text-xs italic py-4">No active events published.</p>` : window.GYM_EVENTS.map(evt => `
                <div class="bg-black/30 border border-gray-800/80 p-3.5 rounded-xl flex flex-col justify-between space-y-2 relative overflow-hidden group hover:border-gray-700 transition-colors">
                    <div class="absolute top-0 right-0 bg-brandRed/10 text-brandRed text-[8px] font-bold px-2 py-0.5 uppercase rounded-bl tracking-wider border-l border-b border-gray-800/40 font-mono">${evt.eventNo}</div>
                    <div>
                        <h5 class="text-white font-bold text-sm tracking-wide group-hover:text-brandRed transition-colors">${evt.title}</h5>
                        <div class="flex space-x-3 text-[10px] text-gray-500 font-mono mt-1">
                            <span class="text-blue-400"><i class="ph ph-calendar inline mr-0.5"></i>${evt.date}</span>
                            <span class="text-amber-400"><i class="ph ph-clock inline mr-0.5"></i>${evt.time}</span>
                            <span class="text-green-400 font-bold"><i class="ph ph-tag inline mr-0.5"></i>₹${evt.amount}</span>
                        </div>
                        <p class="text-gray-400 text-xs mt-2 leading-relaxed line-clamp-2">${evt.description}</p>
                    </div>
                    <div class="text-[10px] text-gray-500 bg-black/40 px-2 py-1 rounded border border-gray-800/30 flex items-center">
                        <i class="ph ph-map-pin text-brandRed mr-1"></i><span class="truncate">Venue: ${evt.venue || "Main Floor Arena"}</span>
                    </div>
                </div>
            `).reverse().join('')}
        </div>
    `;
}

window.openCreateEventModal = function() {
    const modal = document.getElementById('dashboard-local-modal');
    if (!modal) return;

    // অটোমেটিক ইউনিক ইভেন্ট কোড জেনারেশন (যেমন: EVT-103)
    const nextCode = `EVT-${window.GYM_EVENTS.length + 101}`;

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[360px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-5 flex flex-col relative text-xs">
                <button onclick="window.closeDashboardModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg z-50"><i class="ph ph-x"></i></button>
                
                <div class="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4">
                    <i class="ph ph-megaphone text-xl text-brandRed animate-pulse"></i>
                    <h3 class="font-bold text-white text-sm tracking-wide">Dispatch Event Bulletin</h3>
                </div>

                <div class="space-y-3 text-left">
                    <div class="grid grid-cols-3 gap-2">
                        <div class="col-span-1">
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Event No.</label>
                            <input type="text" id="evt-form-no" value="${nextCode}" class="w-full bg-black/60 border border-gray-800 rounded-lg px-2 py-2 text-brandRed focus:outline-none font-mono text-xs font-bold text-center uppercase">
                        </div>
                        <div class="col-span-2">
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Event Ticket Price (₹)</label>
                            <input type="number" id="evt-form-amount" placeholder="e.g. 500" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-green-400 font-bold focus:outline-none focus:border-brandRed font-mono text-xs">
                        </div>
                    </div>
                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Event Title</label>
                        <input type="text" id="evt-form-title" placeholder="e.g. Boxing Sparring Night" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-brandRed transition-colors">
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Date</label>
                            <input type="date" id="evt-form-date" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-brandRed text-xs font-mono">
                        </div>
                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Time</label>
                            <input type="text" id="evt-form-time" placeholder="e.g. 07:00 PM" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-brandRed text-xs font-mono">
                        </div>
                    </div>
                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Venue / Arena Area</label>
                        <input type="text" id="evt-form-venue" placeholder="e.g. Zone B Cage Floor" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-brandRed transition-colors">
                    </div>
                    <div>
                        <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Event Bulletins / Details</label>
                        <textarea id="evt-form-desc" rows="3" placeholder="Write specific rule sets or workshop details..." class="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-gray-300 focus:outline-none focus:border-brandRed resize-none transition-colors"></textarea>
                    </div>
                </div>

                <button onclick="window.submitPublishedEvent()" class="w-full bg-brandRed hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-lg mt-5 tracking-wide uppercase shadow">Broadcast Event & Alert Members</button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.remove('scale-95'); modal.firstElementChild.classList.add('scale-100'); }, 10);
    modal.onclick = window.closeDashboardModal;
};

window.submitPublishedEvent = function() {
    const eventNo = document.getElementById('evt-form-no').value.trim().toUpperCase();
    const amount = parseFloat(document.getElementById('evt-form-amount').value);
    const title = document.getElementById('evt-form-title').value.trim();
    const date = document.getElementById('evt-form-date').value;
    const time = document.getElementById('evt-form-time').value.trim();
    const venue = document.getElementById('evt-form-venue').value.trim();
    const desc = document.getElementById('evt-form-desc').value.trim();

    if (!eventNo || isNaN(amount) || !title || !date || !time || !desc) {
        alert("Authorization Denied:\nPlease fill all fields including Ticket Price before broadcasting!");
        return;
    }

    const newEvent = {
        id: `evt-${Date.now().toString().slice(-4)}`,
        eventNo: eventNo,
        title: title,
        date: date,
        time: time,
        amount: amount,
        venue: venue || "Main Floor Arena",
        description: desc
    };

    window.GYM_EVENTS.push(newEvent);
    alert(`Success!\nEvent Bulletin "${eventNo}: ${title}" has been authorized and linked to the master ledger code structure.`);
    window.closeDashboardModal();
    renderAdminEventsBoard(); 
};

window.closeDashboardModal = function() {
    const modal = document.getElementById('dashboard-local-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    if (modal.firstElementChild) { modal.firstElementChild.classList.remove('scale-100'); modal.firstElementChild.classList.add('scale-95'); }
    setTimeout(() => { modal.classList.add('hidden'); }, 200);
};

function renderTrainerApprovals() {
    const container = document.getElementById('trainer-approvals-container');
    if (!container) return;

    if (window.PENDING_TRAINERS.length === 0) {
        container.innerHTML = `
            <h4 class="text-gray-400 font-semibold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-3 flex items-center"><i class="ph ph-user-plus text-gray-600 mr-2"></i>Trainer Approvals (0)</h4>
            <div class="flex items-center space-x-2 text-gray-600 text-xs py-4 justify-center"><i class="ph ph-check-circle text-green-500"></i><span>All requests resolved.</span></div>`;
        return;
    }

    container.innerHTML = `
        <h4 class="text-gray-400 font-semibold tracking-wide text-xs uppercase border-b border-gray-800/60 pb-3 mb-3 flex items-center"><i class="ph ph-user-plus text-brandRed mr-2"></i>Pending Registrations (${window.PENDING_TRAINERS.length})</h4>
        <div class="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            ${window.PENDING_TRAINERS.map(req => `
                <div class="bg-black/30 border border-gray-800 p-3 rounded-xl flex flex-col justify-between space-y-2">
                    <div>
                        <h5 class="text-white font-semibold text-xs">${req.name}</h5>
                        <p class="text-[10px] text-gray-500 font-mono">${req.specialty} | Exp: ${req.experience}</p>
                    </div>
                    <div class="flex space-x-1.5 pt-1">
                        <button onclick="window.approveTrainer('${req.id}')" class="flex-1 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/20 text-[10px] font-bold py-1 rounded transition-all">Approve</button>
                        <button onclick="window.declineTrainer('${req.id}')" class="flex-1 bg-brandRed/10 hover:bg-brandRed text-brandRed hover:text-white border border-brandRed/20 text-[10px] font-bold py-1 rounded transition-all">Decline</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

window.approveTrainer = function(reqId) {
    const index = window.PENDING_TRAINERS.findIndex(r => r.id === reqId);
    if (index === -1) return;
    
    const req = window.PENDING_TRAINERS[index];
    
    // নতুন ট্রেইনারকে রেন্ডার করা ট্রেইনার্স ডাটাবেসে যুক্ত করা
    window.MOCK_TRAINERS.push({
        id: `t-${Date.now().toString().slice(-4)}`,
        name: req.name,
        email: req.email,
        phone: req.phone,
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        joiningDate: new Date().toLocaleDateString('en-GB'),
        status: "active", // পেন্ডিং থেকে সরাসরি অ্যাক্টিভ হয়ে গেল
        todayAttendance: { checkIn: "--:--", checkOut: null },
        kpis: { satisfaction: 5.0 },
        address: "Birati, Kolkata"
    });

    // পেন্ডিং লিস্ট থেকে রিমুভ করা
    window.PENDING_TRAINERS.splice(index, 1);
    
    alert(`Success: ${req.name} is now an active trainer.`);
    
    // রেন্ডার করা (ড্যাশবোর্ড রিফ্রেশ হবে)
    renderLiveStatusTracking(); // এটি আপনার বিদ্যমান ট্রেইনার অ্যাপ্রুভাল প্যানেল আপডেট করবে
};

window.declineTrainer = function(reqId) {
    const index = window.PENDING_TRAINERS.findIndex(r => r.id === reqId);
    if (index === -1) return;
    window.PENDING_TRAINERS.splice(index, 1);
    alert("Application declined.");
    renderLiveStatusTracking();
};

window.switchDashboardTab = function(tabName) {
    currentDashboardTab = tabName; renderLiveStatusTracking();
};

function generateDailyToken() {
    const today = new Date();
    return `RNW-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-9932`; 
}

function startQRTimer() {
    const tokenElement = document.getElementById('qr-token');
    if (!tokenElement) return;
    const token = generateDailyToken();
    tokenElement.textContent = `Token: ${token}`;
    const qrBox = document.getElementById('qr-code-box');
    if (qrBox) { qrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${token}" class="w-full h-full object-contain" alt="Gym QR">`; }
    setInterval(() => {
        const now = new Date(); const midnight = new Date(); midnight.setHours(24, 0, 0, 0); const diff = midnight - now;
        const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'); const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0'); const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        const timerText = document.getElementById('qr-timer'); if (timerText) timerText.textContent = `Regen in: ${hours}:${minutes}:${seconds}`;
    }, 1000);
}