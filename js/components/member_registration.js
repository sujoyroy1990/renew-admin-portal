// =========================================================================
// js/components/member_registration.js — NEW MEMBER ADMISSION
// =========================================================================

function getMemberRegistrationView() {
    const planOptions = window.GYM_PLANS.map(p => 
        `<option value="${p.name}" data-fee="${p.fee}" data-duration="${p.duration}">${p.name} - ₹${p.fee} (${p.duration} Days)</option>`
    ).join('');

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
                        <input type="text" id="reg-phone" placeholder="+91 XXXXX XXXXX" class="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white mt-1 focus:border-brandRed outline-none">
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
                        <span class="text-gray-200 font-mono">₹1000</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-xs uppercase font-bold">Total Advance Due:</span>
                        <span id="fee-preview" class="text-green-400 font-mono text-xl font-bold">₹1000 + Plan Fee</span>
                    </div>
                </div>

                <button onclick="window.submitNewRegistration()" class="w-full bg-brandRed hover:bg-red-700 text-white font-bold py-4 rounded-xl uppercase tracking-widest mt-4 transition-all">Submit Registration</button>
            </div>
        </div>
    `;
}

window.updateFeePreview = function() {
    const select = document.getElementById('reg-plan-select');
    const fee = parseFloat(select.options[select.selectedIndex].getAttribute('data-fee'));
    document.getElementById('fee-preview').textContent = `₹${1000 + fee}`;
};

window.submitNewRegistration = function() {
    const ADMISSION_FEE = 1000; 
    
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const planSelect = document.getElementById('reg-plan-select');
    
    const planName = planSelect.value;
    const planFee = parseFloat(planSelect.options[planSelect.selectedIndex].getAttribute('data-fee'));
    
    const totalDue = ADMISSION_FEE + planFee;

    if (!name || !phone) return alert("Please fill all fields!");

    // মেম্বার অবজেক্ট
    const newMember = {
        id: `m-${Date.now().toString().slice(-4)}`,
        name: name,
        phone: phone,
        plan: planName,
        status: 'inactive',
        expiryDate: 'Pending Payment Clearance',
        portalLocked: true, 
        photoUrl: 'https://ui-avatars.com/api/?name=' + name
    };

    window.MOCK_MEMBERS.push(newMember);

    // ১. অ্যাডমিশন ফি এন্ট্রি
    window.MOCK_TRANSACTIONS.unshift({
        id: `TXN-${Date.now().toString().slice(-4)}-AD`,
        type: "income",
        category: "admission",
        amount: ADMISSION_FEE,
        date: new Date().toISOString().slice(0,10),
        status: "pending",
        description: `Admission Fee - ${name}`
    });

    // ২. মান্থলি অ্যাডভান্স ফি এন্ট্রি
    window.MOCK_TRANSACTIONS.unshift({
        id: `TXN-${Date.now().toString().slice(-4)}-PF`,
        type: "income",
        category: "advance fee",
        amount: planFee,
        date: new Date().toISOString().slice(0,10),
        status: "pending",
        description: `Advance Membership Fee (${planName}) - ${name}`,
        portalLocked: true
    });

    alert(`✅ Registration Successful!\nTotal Due: ₹${totalDue} (Admission: ₹${ADMISSION_FEE} + Plan: ₹${planFee}).`);
    navigateTo('finance'); 
};