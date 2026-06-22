// js/components/trainers.js
if (!window.MOCK_TRAINERS) {
    window.MOCK_TRAINERS = [
        {
            id: "t1", name: "Rajat Sharma", email: "rajat@gym.com", phone: "9830011223",
            photoUrl: "https://images.unsplash.com/photo-1597403864947-a85709d7d4c8?w=200",
            joiningDate: "12 Jan 2024", status: "active",
            todayAttendance: { checkIn: "06:00", checkOut: null },
            kpis: { satisfaction: 4.8 }, address: "Birati, Kolkata"
        },
        {
            id: "t2", name: "Vikram Singh", email: "vikram@gym.com", phone: "9831199887",
            photoUrl: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=200",
            joiningDate: "15 Feb 2025", status: "pending",
            todayAttendance: { checkIn: "--:--", checkOut: null },
            kpis: { satisfaction: 4.5 }, address: "Madhyamgram, Kolkata"
        }
    ];
}
// ১. এডমিন কমান্ড ও কমিউনিকেশন লগ ডাটাবেস (গ্লোবাল স্কোপ)
if (!window.TRAINER_LOGS) {
    window.TRAINER_LOGS = [
        { id: "log-1", trainerId: "t1", type: "task", content: "Check client attendance for the morning MMA batch.", date: "15/06/2026", deadline: "2026-06-18" },
        { id: "log-2", trainerId: "all", type: "announcement", content: "Gym will remain closed on 21st June for maintenance.", date: "16/06/2026" }
    ];
}

// ২. ট্রেইনার্স পেজের মূল লেআউট টেমপ্লেট
function getTrainersView() {
    return `
        <div class="space-y-6">
            <div class="flex justify-between items-center bg-darkSurface border border-gray-800 p-4 rounded-xl">
                <div>
                    <h3 class="text-white font-semibold">Trainer Command Center</h3>
                    <p class="text-xs text-gray-500">Live stats synced dynamically with Billing & Finance.</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="openTrainerActionModal('new', 'registration')" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow">
                        <i class="ph ph-user-plus text-base"></i>
                        <span>New Trainer Entry</span>
                    </button>
                    <button onclick="openTrainerActionModal('all', 'announcement')" class="bg-brandRed hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow">
                        <i class="ph ph-megaphone text-base"></i>
                        <span>Broadcast Announcement</span>
                    </button>
                </div>
            </div>
            
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6" id="trainers-container">
                <p class="text-gray-500 text-center py-8">Loading Trainers Profiles...</p>
            </div>

            <div id="trainer-action-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"></div>
        </div>
    `;
}

function calculateTrainerSales(trainerId) {
    const invoices = window.MOCK_INVOICES || [];
    const trainerPaidInvoices = invoices.filter(inv => inv.trainerId === trainerId && inv.status === 'paid');

    const ptSales = trainerPaidInvoices.filter(inv => inv.category === 'pt').reduce((sum, inv) => sum + inv.amount, 0);
    const dietPlanSales = trainerPaidInvoices.filter(inv => inv.category === 'diet').reduce((sum, inv) => sum + inv.amount, 0);
    const supplementSales = trainerPaidInvoices.filter(inv => inv.category === 'supplement').reduce((sum, inv) => sum + inv.amount, 0);
    const totalRevenue = ptSales + dietPlanSales + supplementSales;

    return { ptSales, dietPlanSales, supplementSales, totalRevenue };
}

// ৪. মেইন রেন্ডারার ফাংশন
function renderTrainersPage() {
    const container = document.getElementById('trainers-container');
    if (!container) return;

    const trainers = window.MOCK_TRAINERS || [];

    container.innerHTML = trainers.map(t => {
        const hasLeft = t.todayAttendance.checkOut !== null;
        let statusBadge = '';
        if (t.status === 'blocked') {
            statusBadge = `<span class="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Blocked</span>`;
        } else if (hasLeft) {
            statusBadge = `<span class="text-[10px] bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Shift Ended</span>`;
        } else {
            statusBadge = `<span class="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>`;
        }

        const stars = '★'.repeat(Math.round(t.kpis.satisfaction)) + '☆'.repeat(5 - Math.round(t.kpis.satisfaction));
        const address = t.address || "Birati, Kolkata";
        const joiningDate = t.joiningDate || "12 Jan 2024";
        const assignedFighters = (window.MOCK_MEMBERS || []).filter(m => m.trainerId === t.id).map(m => m.name);

        const liveSales = calculateTrainerSales(t.id);

        // এই নির্দিষ্ট ট্রেইনারের পার্সোনাল মেসেজ/টাস্ক এবং গ্লোবাল অ্যানাউন্সমেন্ট ফিল্টার করা
        const myLogs = window.TRAINER_LOGS.filter(log => log.trainerId === t.id || log.trainerId === 'all');

        return `
            <div class="bg-darkSurface border border-gray-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl space-y-5">
                
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800/60 pb-4">
                    <div class="flex items-center space-x-4">
                        <img src="${t.photoUrl}" class="w-14 h-14 rounded-2xl object-cover border-2 border-gray-800 shadow-md">
                        <div>
                            <div class="flex items-center space-x-2">
                                <h3 class="text-lg font-bold text-white tracking-wide">${t.name}</h3>
                                ${statusBadge}
                            </div>
                            <p class="text-xs text-gray-500 font-mono mt-0.5">${t.email} | ${t.phone}</p>
                        </div>
                    </div>

                    
                    <div class="text-right font-mono text-xs text-gray-500 bg-black/20 px-3 py-1.5 rounded-lg border border-gray-800/40">
                        In: ${t.todayAttendance.checkIn} | Out: ${t.todayAttendance.checkOut ? t.todayAttendance.checkOut : '--:--'}
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-black/20 border border-gray-800/40 p-3 rounded-xl">
                    <div class="flex items-start space-x-2"><i class="ph ph-map-pin text-brandRed text-base mt-0.5"></i><div><p class="text-gray-500 text-[9px] uppercase font-bold">Address</p><p class="text-gray-300 mt-0.5">${address}</p></div></div>
                    <div class="flex items-start space-x-2"><i class="ph ph-calendar text-blue-400 text-base mt-0.5"></i><div><p class="text-gray-500 text-[9px] uppercase font-bold">Joining Date</p><p class="text-gray-300 font-mono mt-0.5">${joiningDate}</p></div></div>
                </div>

                <div>
                    <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center"><i class="ph ph-sword text-brandRed mr-1.5"></i>Assigned Active Fighters (${assignedFighters.length})</h4>
                    <div class="flex flex-wrap gap-1.5">
                        ${assignedFighters.map(f => `<span class="text-[11px] bg-brandRed/10 text-brandRed border border-brandRed/20 font-medium px-2.5 py-1 rounded-md flex items-center"><span class="w-1 h-1 bg-brandRed rounded-full mr-1.5"></span>${f}</span>`).join('')}
                    </div>
                </div>

                <div class="bg-black/30 border border-gray-800 p-4 rounded-xl relative overflow-hidden">
                    <div class="absolute top-0 right-0 bg-brandRed/10 text-brandRed text-[9px] font-bold px-2 py-0.5 uppercase rounded-bl border-l border-b border-brandRed/20 tracking-wider">Live Billing Sync</div>
                    <div class="flex justify-between items-center border-b border-gray-800 pb-2 mb-3">
                        <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Monthly Revenue Share</h4>
                        <span class="text-sm font-bold text-brandRed font-mono">Total: ₹${liveSales.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-center text-xs">
                        <div class="border-r border-gray-800/60"><p class="text-gray-500 text-[10px]">PT Sales</p><p class="font-semibold text-gray-300 font-mono mt-0.5">₹${liveSales.ptSales.toLocaleString()}</p></div>
                        <div class="border-r border-gray-800/60"><p class="text-gray-500 text-[10px]">Diet Plans</p><p class="font-semibold text-gray-300 font-mono mt-0.5">₹${liveSales.dietPlanSales.toLocaleString()}</p></div>
                        <div><p class="text-gray-500 text-[10px]">Supplements</p><p class="font-semibold text-gray-300 font-mono mt-0.5">₹${liveSales.supplementSales.toLocaleString()}</p></div>
                    </div>
                </div>

                <div class="bg-black/20 border border-gray-800/60 p-3 rounded-xl space-y-2">
                    <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 flex items-center">
                        <i class="ph ph-activity text-brandRed mr-1.5"></i>Recent Activity Logs (${myLogs.length})
                    </h4>
                    <div class="max-h-28 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        ${myLogs.length === 0 ? `<p class="text-gray-600 text-[11px] italic">No logs or commands issued yet.</p>` : myLogs.map(log => {
            let icon = "ph-chat-text text-blue-400";
            if (log.type === 'task') icon = "ph-clipboard-text text-amber-400";
            if (log.type === 'notice') icon = "ph-note text-purple-400";
            if (log.type === 'announcement') icon = "ph-megaphone text-brandRed";

            const deadlineText = log.deadline ? `<span class="text-amber-500/80 font-mono text-[9px] block">Deadline: ${log.deadline}</span>` : '';

            return `
                                <div class="bg-black/30 p-2 rounded border border-gray-800/50 flex items-start space-x-2 text-[11px]">
                                    <i class="ph ${icon} text-sm mt-0.5"></i>
                                    <div class="flex-1">
                                        <div class="flex justify-between items-center text-gray-500 text-[9px] font-mono">
                                            <span class="uppercase font-bold text-gray-400">${log.type}</span>
                                            <span>${log.date}</span>
                                        </div>
                                        <p class="text-gray-300 mt-0.5">${log.content}</p>
                                        ${deadlineText}
                                    </div>
                                </div>
                            `;
        }).reverse().join('')}
                    </div>
                </div>

                <div class="pt-2 border-t border-gray-800/60 flex flex-wrap gap-2">
                    <button onclick="openTrainerActionModal('${t.id}', 'message')" class="flex-1 bg-black/40 hover:bg-black border border-gray-800 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"><i class="ph ph-chat-text text-blue-400"></i><span>Message</span></button>
                    <button onclick="openTrainerActionModal('${t.id}', 'task')" class="flex-1 bg-black/40 hover:bg-black border border-gray-800 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"><i class="ph ph-clipboard-text text-amber-400"></i><span>Assign Task</span></button>
                    <button onclick="openTrainerActionModal('${t.id}', 'notice')" class="flex-1 bg-black/40 hover:bg-black border border-gray-800 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"><i class="ph ph-note text-purple-400"></i><span>Send Notice</span></button>
                    <button onclick="window.toggleTrainerStatus('${t.id}')" class="flex-1 bg-black/40 hover:bg-brandRed/20 hover:text-white border border-gray-800 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors" title="${t.status === 'blocked' ? 'Unblock Access' : 'Block Access'}">
                        <i class="ph ${t.status === 'blocked' ? 'ph-lock-open text-green-400' : 'ph-lock text-red-500'}"></i>
                        <span>${t.status === 'blocked' ? 'Unblock' : 'Block'}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}
// ==========================================
// ৫. ডাইনামিক অ্যাকশন মোডাল জেনারেটর লজিক
// ==========================================
function openTrainerActionModal(trainerId, actionType) {
    const modal = document.getElementById('trainer-action-modal');
    if (!modal) return;

    let targetName = "All Trainers (Global Broadcast)";
    if (trainerId !== 'all') {
        const trainer = MOCK_TRAINERS.find(t => t.id === trainerId);
        targetName = trainer ? trainer.name : "Trainer";
    }

    let title = ""; let iconClass = ""; let placeholderText = ""; let inputFields = "";

    if (actionType === 'message') {
        title = `Direct Message to ${targetName}`; iconClass = "ph ph-chat-text text-blue-400"; placeholderText = "Type your private message here...";
    } else if (actionType === 'task') {
        title = `Assign Task to ${targetName}`; iconClass = "ph ph-clipboard-text text-amber-400"; placeholderText = "Describe specific tasks, instructions or milestones...";
        inputFields = `
            <div class="mb-3 text-left">
                <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Task Deadline</label>
                <input type="date" id="action-deadline" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-brandRed font-mono">
            </div>
        `;
    } else if (actionType === 'notice') {
        title = `Issue Official Notice to ${targetName}`; iconClass = "ph ph-note text-purple-400"; placeholderText = "Write the official compliance or gym notice details here...";
    } else if (actionType === 'announcement') {
        title = `Broadcast Announcement for Trainers`; iconClass = "ph ph-megaphone text-brandRed"; placeholderText = "Type the public announcement that every trainer will see instantly...";
    }

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[400px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[14px] p-5 flex flex-col relative">
                <button onclick="closeTrainerActionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg transition-colors"><i class="ph ph-x"></i></button>
                <div class="flex items-center space-x-2.5 mb-4 border-b border-gray-800/60 pb-3"><i class="${iconClass} text-2xl"></i><h3 class="text-sm font-bold text-white tracking-wide">${title}</h3></div>
                ${inputFields}
                <div class="mb-4 text-left">
                    <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Content / Message</label>
                    <textarea id="action-content" rows="4" placeholder="${placeholderText}" class="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 focus:outline-none focus:border-brandRed resize-none transition-colors"></textarea>
                </div>
                <button onclick="submitTrainerAction('${trainerId}', '${actionType}')" class="w-full bg-brandRed hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow">Send Command</button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild.classList.remove('scale-95');
        modal.firstElementChild.classList.add('scale-100');
    }, 10);

    modal.onclick = closeTrainerActionModal;
}

function closeTrainerActionModal() {
    const modal = document.getElementById('trainer-action-modal');
    if (modal) { modal.classList.add('opacity-0'); setTimeout(() => modal.classList.add('hidden'), 300); }
}

// ৬. সাবমিট করার সাথে সাথে ডেটা পুশ করার আসল অ্যাক্টিভ লজিক
function submitTrainerAction(trainerId, actionType) {
    const content = document.getElementById('action-content').value.trim();
    if (!content) { alert("Please write a message before sending!"); return; }

    const deadlineInput = document.getElementById('action-deadline');
    const deadline = deadlineInput ? deadlineInput.value : null;

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    // নতুন অ্যাকশন লগ অবজেক্ট তৈরি করে গ্লোবাল অ্যারেতে পুশ করা
    const newLog = {
        id: `log-${Date.now()}`,
        trainerId: trainerId,
        type: actionType,
        content: content,
        date: formattedDate,
        deadline: deadline
    };

    window.TRAINER_LOGS.push(newLog); // ডাটা সেভ হলো

    alert(`Command Authorized! ${actionType.toUpperCase()} dispatched and logged successfully.`);
    closeTrainerActionModal();
    renderTrainersPage(); // পুরো পেজ ও লগ হিস্ট্রি ইনস্ট্যান্ট রিয়েল-টাইমে রি-রেন্ডার হবে!
}
// =========================================================================
// ৭. নিউ ট্রেইনার রেজিস্ট্রেশন ফর্ম (মোডাল এর ভেতরে)
// =========================================================================
// এই অংশটি আপনার বিদ্যমান openTrainerActionModal ফাংশনের ভেতরে 'registration' টাইপের জন্য কাজ করবে

// আপনার openTrainerActionModal ফাংশনটি আপডেট করুন অথবা এই লজিকটি খেয়াল করুন:
const originalOpenModal = window.openTrainerActionModal; // আগের ফাংশনটি রেফারেন্স হিসেবে রাখা (ঐচ্ছিক)

window.openTrainerActionModal = function (trainerId, actionType) {
    const modal = document.getElementById('trainer-action-modal');
    if (!modal) return;

    if (actionType === 'registration') {
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[450px] shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
                <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col relative">
                    <button onclick="closeTrainerActionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg transition-colors"><i class="ph ph-x"></i></button>
                    
                    <div class="flex items-center space-x-2.5 mb-6 border-b border-gray-800/60 pb-3">
                        <i class="ph ph-user-plus text-2xl text-indigo-400"></i>
                        <h3 class="text-sm font-bold text-white tracking-wide uppercase">Register New Expert Trainer</h3>
                    </div>

                    <div class="space-y-4 text-left">
                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Full Name</label>
                            <input type="text" id="new-t-name" placeholder="e.g. Rahul Sharma" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Email Address</label>
                                <input type="email" id="new-t-email" placeholder="rahul@example.com" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
                            </div>
                            <div>
                                <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Phone Number</label>
                                <input type="text" id="new-t-phone" placeholder="98300XXXXX" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10)" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
                            </div>
                        </div>

                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Specialization / Expertise</label>
                            <select id="new-t-specialty" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
                                <option value="MMA & Kickboxing">MMA & Kickboxing</option>
                                <option value="Bodybuilding & Strength">Bodybuilding & Strength</option>
                                <option value="Yoga & Flexibility">Yoga & Flexibility</option>
                                <option value="Crossfit Specialist">Crossfit Specialist</option>
                            </select>
                        </div>

                        <div>
                            <label class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Photo URL (Optional)</label>
                            <input type="text" id="new-t-photo" placeholder="https://unsplash.com/photo-..." class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2.5 text-xs text-gray-300 focus:border-indigo-500 outline-none">
                        </div>
                    </div>

                    // openTrainerActionModal ফাংশনের ভেতরে বাটনটি এভাবে আপডেট করুন://

                     <button onclick="submitTrainerRegistration()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-lg mt-6 uppercase tracking-widest shadow-lg transition-all">
                     Deploy to Roster
                    </button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.firstElementChild.classList.remove('scale-95');
            modal.firstElementChild.classList.add('scale-100');
        }, 10);
        modal.onclick = closeTrainerActionModal;
    } else {
        // যদি অন্য কোনো actionType হয়, তবে আগের লজিক কাজ করবে
        // (আপনার বর্তমান কোডের modal.innerHTML লজিকটি এখানে থাকবে)
    }
}

// ৮. ডাটা সেভ করার ফাংশন (বানান সংশোধন করা হয়েছে)
window.submitTrainerRegistration = function () {

    const name = document.getElementById('new-t-name').value.trim();
    const email = document.getElementById('new-t-email').value.trim();
    const phone = document.getElementById('new-t-phone').value.trim();
    const specialtySelect = document.getElementById('new-t-specialty');
    const specialty = specialtySelect ? specialtySelect.value.trim() : "MMA & Kickboxing";

    if (!name || !email || !phone) {
        alert("Please fill in all mandatory fields!");
        return;
    }

    // Check duplicate phone across all segments
    const cleanPhone = num => num ? num.replace(/[^0-9]/g, '') : '';
    const phoneMatch = (dbPhone, inputPhone) => {
        if (!dbPhone || !inputPhone) return false;
        const cleanDb = cleanPhone(dbPhone);
        const cleanInput = cleanPhone(inputPhone);
        if (cleanDb.length >= 10 && cleanInput.length >= 10) {
            return cleanDb.slice(-10) === cleanInput.slice(-10);
        }
        return cleanDb === cleanInput;
    };

    if ((window.MOCK_TRAINERS || []).some(t => phoneMatch(t.phone, phone)) ||
        (window.ADMINS_LIST || []).some(a => phoneMatch(a.phone, phone)) ||
        (window.MOCK_MEMBERS || []).some(m => phoneMatch(m.phone, phone))) {
        alert("Registration Failure: Phone number is already registered under another account.");
        return;
    }
    const newPending = {
        id: `req-${Date.now().toString().slice(-4)}`,
        name: name,
        email: email,
        phone: phone,
        specialty: specialty,
        experience: "New Entry"
    };

    if (typeof window.PENDING_TRAINERS === 'undefined') {
        window.PENDING_TRAINERS = [];
    }

    window.PENDING_TRAINERS.push(newPending);

    alert(`⚡ REGISTRATION SUBMITTED:\nTrainer "${name}" has been added to Pending Registrations for Admin approval.`);

    closeTrainerActionModal();
    renderTrainersPage();
};

/// ৯. ইউনিফাইড মোডাল হ্যান্ডলার (সব অ্যাকশন এখানে)
window.openTrainerActionModal = function (trainerId, actionType) {
    const modal = document.getElementById('trainer-action-modal');
    if (!modal) return;

    // যদি রেজিস্ট্রেশন মোড হয়
    if (actionType === 'registration') {
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-2xl w-[450px] shadow-2xl relative transform transition-all duration-300" onclick="event.stopPropagation()">
                <div class="bg-darkBg/95 rounded-[14px] p-6 flex flex-col relative text-left">
                    <button onclick="closeTrainerActionModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-lg"><i class="ph ph-x"></i></button>
                    <h3 class="text-sm font-bold text-white mb-6 uppercase border-b border-gray-800 pb-3">Register New Expert Trainer</h3>
                    <div class="space-y-4">
                        <input type="text" id="new-t-name" placeholder="Full Name" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 outline-none">
                        <div class="grid grid-cols-2 gap-4">
                            <input type="email" id="new-t-email" placeholder="Email" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 outline-none">
                            <input type="text" id="new-t-phone" placeholder="Phone" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10)" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 outline-none">
                        </div>
                        <select id="new-t-specialty" class="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 outline-none">
                            <option>MMA & Kickboxing</option><option>Bodybuilding</option>
                        </select>
                    </div>
                    <button onclick="window.submitTrainerRegistration()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-lg mt-6 uppercase shadow-lg">Deploy to Roster</button>
                </div>
            </div>
        `;
    }
    // যদি মেসেজ, টাস্ক বা অ্যানাউন্সমেন্ট হয়
    else {
        // এখানে আপনার আগের মোডাল লজিক (যা এই ফাংশনের শুরুতে ছিল)
        let targetName = (trainerId !== 'all') ? (window.MOCK_TRAINERS.find(t => t.id === trainerId)?.name || "Trainer") : "All Trainers";
        let iconClass = actionType === 'announcement' ? "ph ph-megaphone text-brandRed" : "ph ph-chat-text text-blue-400";

        modal.innerHTML = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-2xl w-[400px] shadow-2xl relative" onclick="event.stopPropagation()">
                <button onclick="closeTrainerActionModal()" class="absolute top-4 right-4 text-gray-500"><i class="ph ph-x"></i></button>
                <div class="flex items-center space-x-2 mb-4"><i class="${iconClass} text-2xl"></i><h3 class="text-sm font-bold text-white">${actionType.toUpperCase()} to ${targetName}</h3></div>
                <textarea id="action-content" rows="4" class="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-xs text-gray-300"></textarea>
                <button onclick="submitTrainerAction('${trainerId}', '${actionType}')" class="w-full bg-brandRed text-white text-xs font-bold py-2.5 rounded-lg mt-4">Send Command</button>
            </div>
        `;
    }

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
};

// =========================================================================
// 🔒 TRAINER BLOCK/ACCESS CONTROL ENGINE
// =========================================================================
window.toggleTrainerStatus = function(trainerId) {
    const trainers = window.MOCK_TRAINERS || [];
    const trainer = trainers.find(t => t.id === trainerId);
    if (!trainer) return;

    if (trainer.status === 'blocked') {
        trainer.status = 'active';
        alert(`Trainer "${trainer.name}" has been unblocked successfully.`);
    } else {
        trainer.status = 'blocked';
        alert(`Trainer "${trainer.name}" has been blocked. They will no longer be able to log in to the trainer portal.`);
    }

    try { localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(trainers)); } catch (e) {}

    // Firestore save (fire-and-forget)
    if (window.dbService && window.dbService.setDocument) {
        window.dbService.setDocument('trainers', trainer.id, trainer)
            .catch(e => console.error('[Firestore] toggleTrainerStatus failed:', e.message));
    }

    renderTrainersPage();
};