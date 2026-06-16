// js/components/members.js

// মেম্বার্স পেজের জন্য গ্লোবাল ভেরিয়েবল
let currentMemberTab = 'all'; 
let memberSearchQuery = '';   

// ১. মেম্বার পেজের মূল লেআউট টেমপ্লেট
function getMembersView() {
    return `
        <div class="space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-darkSurface border border-gray-800 p-4 rounded-xl">
                <div class="relative flex-1 max-w-md">
                    <i class="ph ph-magnifying-glass absolute left-3 top-3.5 text-gray-500 text-lg"></i>
                    <input type="text" id="member-search" oninput="handleMemberSearch()" placeholder="Search by name or phone..." class="w-full bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-brandRed transition-colors">
                </div>
                
                <div class="flex flex-wrap gap-2" id="member-subtabs"></div>
            </div>

            <div class="bg-darkSurface border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-400">
                        <thead class="text-xs uppercase bg-black/30 text-gray-500 border-b border-gray-800">
                            <tr>
                                <th class="py-3.5 px-6">Member</th>
                                <th class="py-3.5 px-6">Phone</th>
                                <th class="py-3.5 px-6">Plan Type</th>
                                <th class="py-3.5 px-6">Expiry Date</th>
                                <th class="py-3.5 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800/50" id="members-table-body"></tbody>
                    </table>
                </div>
            </div>

            <div id="membership-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"></div>
        </div>
    `;
}

// ২. মেম্বার পেজ ইনিশিয়ালাইজ করার মেইন ফাংশন
function renderMembersPage() {
    renderMemberSubtabs();
    renderMembersTable();
}

// ৩. সাব-ট্যাব ফিল্টার বাটন জেনারেটর
function renderMemberSubtabs() {
    const tabContainer = document.getElementById('member-subtabs');
    if (!tabContainer) return;

    const tabs = ['all', 'active', 'expiring', 'at_risk', 'expired'];
    const counts = {
        all: MOCK_MEMBERS.length,
        active: MOCK_MEMBERS.filter(m => m.status === 'active').length,
        expiring: MOCK_MEMBERS.filter(m => m.status === 'expiring').length,
        at_risk: MOCK_MEMBERS.filter(m => m.status === 'at_risk').length,
        expired: MOCK_MEMBERS.filter(m => m.status === 'expired').length
    };

    tabContainer.innerHTML = tabs.map(tab => {
        const isActive = currentMemberTab === tab;
        const displayName = tab === 'at_risk' ? 'At Risk' : tab.charAt(0).toUpperCase() + tab.slice(1);
        return `
            <button onclick="switchMemberTab('${tab}')" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${isActive ? 'bg-brandRed border-brandRed text-white' : 'bg-black/20 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'}">
                ${displayName} (${counts[tab]})
            </button>
        `;
    }).join('');
}

// ৪. মেম্বার টেবিল ডেটা রেন্ডারার
function renderMembersTable() {
    const tbody = document.getElementById('members-table-body');
    if (!tbody) return;

    let filtered = MOCK_MEMBERS;
    if (currentMemberTab !== 'all') {
        filtered = MOCK_MEMBERS.filter(m => m.status === currentMemberTab);
    }
    if (memberSearchQuery) {
        filtered = filtered.filter(m => m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || m.phone.includes(memberSearchQuery));
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-gray-600">No members found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(m => {
        let statusBadge = m.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : (m.status === 'expiring' ? 'bg-red-500/10 text-brandRed border-red-500/20' : (m.status === 'at_risk' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'));
        return `
            <tr onclick="openMembershipCard('${m.id}')" class="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                <td class="py-3.5 px-6 flex items-center space-x-3">
                    <img src="${m.photoUrl}" class="w-9 h-9 rounded-full border border-gray-700 object-cover group-hover:border-brandRed transition-colors">
                    <span class="text-white font-medium group-hover:text-brandRed transition-colors">${m.name}</span>
                </td>
                <td class="py-3.5 px-6 font-mono text-xs">${m.phone}</td>
                <td class="py-3.5 px-6"><span class="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">${m.plan}</span></td>
                <td class="py-3.5 px-6 font-mono text-xs">${m.expiryDate}</td>
                <td class="py-3.5 px-6"><span class="text-[10px] uppercase font-bold border px-2.5 py-1 rounded-full ${statusBadge}">${m.status === 'at_risk' ? 'At Risk' : m.status}</span></td>
            </tr>
        `;
    }).join('');
}

function handleMemberSearch() {
    const input = document.getElementById('member-search');
    if (input) { memberSearchQuery = input.value; renderMembersTable(); }
}
function switchMemberTab(tab) {
    currentMemberTab = tab; renderMemberSubtabs(); renderMembersTable();
}

// ==========================================
// ৫. DIGITAL ID CARD LOGIC WITH DYNAMIC TRAINER ASSIGNMENT DROPDOWN
// ==========================================
function openMembershipCard(memberId) {
    const member = MOCK_MEMBERS.find(m => m.id === memberId);
    const modal = document.getElementById('membership-modal');
    if (!member || !modal) return;

    // ট্রেইনারদের লিস্ট থেকে ড্রপডাউন অপশন তৈরি করা
    const trainerOptions = MOCK_TRAINERS.map(t => {
        const isSelected = t.id === member.trainerId ? 'selected' : '';
        return `<option value="${t.id}" ${isSelected}>${t.name}</option>`;
    }).join('');

    const noTrainerSelected = !member.trainerId ? 'selected' : '';

    // কাস্টম ডার্ক থিম সিলেক্ট ড্রপডাউন উইজেট
    const trainerSelectDropdown = `
        <select onchange="assignTrainerToMember('${member.id}', this.value)" class="w-full bg-black/60 border border-gray-800 text-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-brandRed mt-0.5 font-medium transition-colors cursor-pointer">
            <option value="" ${noTrainerSelected}>Unassigned / No PT</option>
            ${trainerOptions}
        </select>
    `;

    const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${member.id.toUpperCase()}&scale=3&height=12&alttext=${member.id.toUpperCase()}`;

    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-[2px] rounded-3xl w-80 shadow-2xl relative transform scale-95 transition-transform duration-300" onclick="event.stopPropagation()">
            <div class="bg-darkBg/95 rounded-[22px] p-6 flex flex-col items-center text-center relative overflow-hidden">
                
                <button onclick="closeMembershipCard()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-xl transition-colors"><i class="ph ph-x"></i></button>

                <div class="text-[10px] tracking-widest bg-brandRed text-white font-bold px-2 py-0.5 rounded mb-4 shadow">R.E.N.E.W DIGITAL ID</div>

                <img src="${member.photoUrl}" class="w-24 h-24 rounded-full object-cover border-2 border-brandRed shadow-lg mb-3">

                <h3 class="text-xl font-bold text-white tracking-wide">${member.name}</h3>
                <p class="text-xs text-gray-500 font-mono mt-0.5">ID: ${member.id.toUpperCase()}</p>
                
                <div class="w-full h-[1px] bg-gray-800 my-4"></div>

                <div class="w-full grid grid-cols-2 gap-y-3 gap-x-2 text-left text-xs">
                    <div>
                        <p class="text-gray-500 text-[10px] uppercase font-medium">Plan</p>
                        <p class="text-gray-300 font-semibold mt-1">${member.plan}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 text-[10px] uppercase font-medium">Personal Trainer</p>
                        ${trainerSelectDropdown} </div>
                    <div>
                        <p class="text-gray-500 text-[10px] uppercase font-medium">Phone</p>
                        <p class="text-gray-300 font-mono mt-1">${member.phone}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 text-[10px] uppercase font-medium">Valid Till</p>
                        <p class="text-brandRed font-mono font-semibold mt-1">${member.expiryDate}</p>
                    </div>
                </div>

                <div class="w-full bg-white p-1 rounded-xl mt-5 flex items-center justify-center shadow-inner overflow-hidden">
                    <img src="${barcodeUrl}" class="h-14 w-full object-fill rounded-lg" alt="Member Barcode">
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

    modal.onclick = closeMembershipCard;
}

function closeMembershipCard() {
    const modal = document.getElementById('membership-modal');
    if (modal) { modal.classList.add('opacity-0'); setTimeout(() => modal.classList.add('hidden'), 300); }
}

// ==========================================
// ৬. NEW ACTIVE FEATURE: DYNAMIC ASSIGNMENT HANDLER
// ==========================================
function assignTrainerToMember(memberId, selectedTrainerId) {
    const member = MOCK_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    // মেম্বারের আন্ডারে ট্রেইনার আইডি চেঞ্জ করা
    member.trainerId = selectedTrainerId;

    let successMessage = `Success! ${member.name} has been unassigned from personal training.`;
    if (selectedTrainerId) {
        const trainer = MOCK_TRAINERS.find(t => t.id === selectedTrainerId);
        successMessage = `Authorized! ${member.name} has been successfully assigned to coach ${trainer ? trainer.name : 'Trainer'}.`;
    }

    alert(successMessage);
    
    // টেবিলে লাইভ ডেটা রিফ্রেশ করা
    renderMembersTable();
}