// =========================================================================
// js/components/member_registration.js — NEW MEMBER ADMISSION (FINAL)
// =========================================================================

function getMemberRegistrationView() {
    // এখানে আমরা একটি সেফটি চেক দিচ্ছি (যদি GYM_FEES না থাকে, তবে 1000 ধরবে)
    const admissionFee = (window.GYM_FEES && window.GYM_FEES.admissionFee) ? window.GYM_FEES.admissionFee : 1000;
    
    const planOptions = window.GYM_PLANS.map(p => 
        `<option value="${p.name}" data-fee="${p.fee}">${p.name} - ₹${p.fee}</option>`
    ).join('');

    return `
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
    `;
}

// আপডেট ফাংশনটিও আপডেট করে নিন:
window.updateFeePreview = function() {
    const select = document.getElementById('reg-plan-select');
    const fee = parseFloat(select.options[select.selectedIndex].getAttribute('data-fee')) || 0;
    const admission = (window.GYM_FEES && window.GYM_FEES.admissionFee) ? window.GYM_FEES.admissionFee : 1000;
    
    document.getElementById('fee-preview').textContent = `₹${admission + fee}`;
};

window.updateFeePreview = function() {
    const select = document.getElementById('reg-plan-select');
    const fee = parseFloat(select.options[select.selectedIndex].getAttribute('data-fee')) || 0;
    
    // সরাসরি লেটেস্ট গ্লোবাল ভ্যালু নেওয়া
    const admission = window.GYM_FEES?.admissionFee || 1000;
    
    document.getElementById('fee-preview').textContent = `₹${admission + fee}`;
    document.getElementById('adm-fee-display').textContent = `₹${admission}`; // নতুন লাইন: Admission Fee ও আপডেট হবে
};

window.submitNewRegistration = function() {
    const ADMISSION_FEE = window.GYM_FEES.admissionFee; 
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const planSelect = document.getElementById('reg-plan-select');
    
    const planName = planSelect.value;
    const planFee = parseFloat(planSelect.options[planSelect.selectedIndex].getAttribute('data-fee'));
    const totalDue = ADMISSION_FEE + planFee;

    if (!name || !phone) return alert("Please fill all fields!");

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

window.updateAdmissionFee = function(newFee) {
    window.GYM_FEES.admissionFee = parseFloat(newFee);
    alert("Admission fee updated system-wide!");
};