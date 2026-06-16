// js/components/trainers.js

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
                <button onclick="openTrainerActionModal('all', 'announcement')" class="bg-brandRed hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow">
                    <i class="ph ph-megaphone text-base"></i>
                    <span>Broadcast Announcement for Trainer</span>
                </button>
            </div>
            
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6" id="trainers-container">
                <p class="text-gray-500 text-center py-8">Loading Trainers Profiles...</p>
            </div>

            <div id="trainer-action-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"></div>
        </div>
    `;
}

// ৩. ফিন্যান্স খাতা ঘেঁটে ট্রেইনারের নিখুঁত লাইভ সেলস ট্র্যাক করার ফাংশন
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

    container.innerHTML = MOCK_TRAINERS.map(t => {
        const hasLeft = t.todayAttendance.checkOut !== null;
        const attendanceBadge = hasLeft
            ? `<span class="text-[10px] bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Shift Ended</span>`
            : `<span class="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center"><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>On Duty</span>`;

        const stars = '★'.repeat(Math.round(t.kpis.satisfaction)) + '☆'.repeat(5 - Math.round(t.kpis.satisfaction));
        const address = t.address || "Birati, Kolkata";
        const joiningDate = t.joiningDate || "12 Jan 2024";
        const assignedFighters = MOCK_MEMBERS.filter(m => m.trainerId === t.id).map(m => m.name);

        const liveSales = calculateTrainerSales(t.id);

        // এই নির্দিষ্ট ট্রেইনারের পার্সোনাল মেসেজ/টাস্ক এবং গ্লোবাল অ্যানাউন্সমেন্ট ফিল্টার করা
        const myLogs = window.TRAINER_LOGS.filter(log => log.trainerId === t.id || log.trainerId === 'all');

        return `
            <div class="bg-darkSurface border border-gray-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl space-y-5">
                
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800/60 pb-4">
                    <div class="flex items-center space-x-4">
                        <img src="${t.photoUrl}" class="w-14 h-14 rounded-2xl object-cover border-2 border-gray-800 shadow-md">
                        <div>
                            <div class="flex items-center space-x-2"><h3 class="text-lg font-bold text-white tracking-wide">${t.name}</h3>${attendanceBadge}</div>
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
                            if(log.type === 'task') icon = "ph-clipboard-text text-amber-400";
                            if(log.type === 'notice') icon = "ph-note text-purple-400";
                            if(log.type === 'announcement') icon = "ph-megaphone text-brandRed";

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