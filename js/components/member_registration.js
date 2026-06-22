// =========================================================================
// js/components/member_registration.js — NEW MEMBER ADMISSION (OPTIMIZED)
// =========================================================================

function getMemberRegistrationView() {
    // সেফটি চেক: গ্লোবাল ভ্যালু পাওয়া না গেলে ডিফল্ট ১০০০ ধরবে
    const admissionFee = (window.GYM_FEES && typeof window.GYM_FEES.admissionFee !== 'undefined') ? window.GYM_FEES.admissionFee : 1000;
    
    const planOptions = window.GYM_PLANS.map(p => 
        `<option value="${p.name}" data-fee="${p.fee}">${p.name} - ₹${p.fee}</option>`
    ).join('');

    // ফর্ম রেন্ডার হওয়ার পর যাতে ডিফল্ট ক্যালকুলেশন দেখায়, সেজন্য ৫ মিলি-সেকেন্ড ডিলে
    setTimeout(() => { window.updateFeePreview(); }, 5);

    return `
        <div class="max-w-lg mx-auto bg-darkSurface border border-gray-800 p-8 rounded-2xl shadow-2xl animate-fadeIn">
            <h2 class="text-white font-black text-xl mb-1">New Fighter Registration</h2>
            <p class="text-gray-500 text-xs mb-8">Initiate member onboarding.</p>
            
            <div class="space-y-4">
                <div>
                    <label class="text-[10px] text-gray-500 uppercase font-bold">Full Name</label>
                    <input type="text" id="reg-name" placeholder="Enter Full Name" class="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white mt-1 focus:border-brandRed outline-none">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-[10px] text-gray-500 uppercase font-bold">WhatsApp Number</label>
                        <input type="text" id="reg-phone" placeholder="98300XXXXX" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10)" class="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white mt-1 focus:border-brandRed outline-none">
                    </div>
                    <div>
                        <label class="text-[10px] text-gray-500 uppercase font-bold">Date of Birth</label>
                        <input type="date" id="reg-dob" class="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white mt-1 focus:border-brandRed outline-none">
                    </div>
                </div>

                <div>
                    <label class="text-[10px] text-gray-500 uppercase font-bold">Select Membership Plan</label>
                    <select id="reg-plan-select" onchange="window.updateFeePreview()" class="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white mt-1 focus:border-brandRed outline-none">
                        ${planOptions}
                    </select>
                </div>

                <div class="bg-black/40 p-4 rounded-xl border border-gray-800">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-400 text-xs uppercase font-bold">Admission Fee:</span>
                        <span id="adm-fee-display" class="text-gray-200 font-mono">₹${admissionFee}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-xs uppercase font-bold">Total Advance Due:</span>
                        <span id="fee-preview" class="text-green-400 font-mono text-xl font-bold">₹${admissionFee} + Plan Fee</span>
                    </div>
                </div>

                <button onclick="window.submitNewRegistration()" class="w-full bg-brandRed hover:bg-red-700 text-white font-bold py-4 rounded-xl uppercase tracking-widest mt-4 transition-all">Submit Registration</button>
            </div>
        </div>
    `;
}

// ফি প্রিভিউ আপডেট ফাংশন
window.updateFeePreview = function() {
    const select = document.getElementById('reg-plan-select');
    if (!select) return;
    
    const fee = parseFloat(select.options[select.selectedIndex].getAttribute('data-fee')) || 0;
    const admission = (window.GYM_FEES && typeof window.GYM_FEES.admissionFee !== 'undefined') ? window.GYM_FEES.admissionFee : 1000;
    
    const feePreview = document.getElementById('fee-preview');
    const admDisplay = document.getElementById('adm-fee-display');
    
    if (feePreview) feePreview.textContent = `₹${admission + fee}`;
    if (admDisplay) admDisplay.textContent = `₹${admission}`;
};

window.submitNewRegistration = function() {
    const ADMISSION_FEE = (window.GYM_FEES && typeof window.GYM_FEES.admissionFee !== 'undefined') ? window.GYM_FEES.admissionFee : 1000;
    
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const planSelect = document.getElementById('reg-plan-select');
    
    const planName = planSelect.value;
    const planFee = parseFloat(planSelect.options[planSelect.selectedIndex].getAttribute('data-fee'));
    const totalDue = ADMISSION_FEE + planFee;

    if (!name || !phone) return alert("Please fill all fields!");

    // Check duplicate phone
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
    
    if ((window.MOCK_MEMBERS || []).some(m => phoneMatch(m.phone, phone)) ||
        (window.MOCK_TRAINERS || []).some(t => phoneMatch(t.phone, phone)) ||
        (window.ADMINS_LIST || []).some(a => phoneMatch(a.phone, phone))) {
        alert("Registration Failure: Phone number is already registered under another account.");
        return;
    }
    // মেম্বার অবজেক্ট
    const newMember = {
        id: `m-${Date.now().toString().slice(-4)}`,
        name: name,
        phone: phone,
        email: '',
        plan: planName,
        status: 'inactive',
        expiryDate: 'Pending Payment Clearance',
        portalLocked: true, 
        photoUrl: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=1e1e1e&color=ffffff&bold=true',
        checkedInToday: false,
        registrationDate: new Date().toISOString().slice(0, 10),
        trainerId: '',
        weight: '',
        height: '',
        age: '',
        formUploaded: false,
        assessmentData: {}
    };

    window.MOCK_MEMBERS.push(newMember);

    const txnAdm = {
        id: `TXN-${Date.now().toString().slice(-4)}-AD`,
        type: "income",
        category: "admission",
        amount: ADMISSION_FEE,
        date: new Date().toISOString().slice(0,10),
        status: "pending",
        description: `Admission Fee - ${name}`
    };
    const txnPlan = {
        id: `TXN-${Date.now().toString().slice(-4)}-PF`,
        type: "income",
        category: "advance fee",
        amount: planFee,
        date: new Date().toISOString().slice(0,10),
        status: "pending",
        description: `Advance Membership Fee (${planName}) - ${name}`,
        portalLocked: true
    };

    // ১. অ্যাডমিশন ফি এন্ট্রি
    window.MOCK_TRANSACTIONS.unshift(txnAdm);
    // ২. মান্থলি অ্যাডভান্স ফি এন্ট্রি
    window.MOCK_TRANSACTIONS.unshift(txnPlan);

    try {
        localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
        localStorage.setItem('RENEW_TRANSACTIONS_DB', JSON.stringify(window.MOCK_TRANSACTIONS));
    } catch(e) {}

    // Firestore save (fire-and-forget)
    if (window.dbService && window.dbService.setDocument) {
        window.dbService.setDocument('members', newMember.id, newMember)
            .then(() => console.log('[Firestore] Member registration saved:', newMember.id))
            .catch(e => console.error('[Firestore] member_registration member:', e.message));
        window.dbService.setDocument('transactions', txnAdm.id, txnAdm)
            .catch(e => console.error('[Firestore] member_registration txnAdm:', e.message));
        window.dbService.setDocument('transactions', txnPlan.id, txnPlan)
            .catch(e => console.error('[Firestore] member_registration txnPlan:', e.message));
    }

    alert(`\u2705 Registration Successful!\nTotal Due: \u20b9${totalDue} (Admission: \u20b9${ADMISSION_FEE} + Plan: \u20b9${planFee}).`);
    navigateTo('finance'); 
};