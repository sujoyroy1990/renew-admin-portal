// =========================================================================
// js/seedFirestore.js — ONE-TIME MOCK DATA SEED TO FIRESTORE
// =========================================================================
// এই ফাংশনটি একবারই চালাতে হবে। Firestore-এ সব mock data upload করবে।
// Admin dashboard-এ "Seed Data" বাটন থেকে trigger হবে।
// =========================================================================

window.seedFirestoreData = async function () {
    if (!window.dbService || !window.dbService.isReady()) {
        alert("❌ Firebase সংযোগ নেই! Firebase initialize হয়েছে কিনা দেখুন।");
        return;
    }

    const confirmed = confirm(
        "🌱 FIRESTORE SEED MIGRATION\n\n" +
        "এই action নিচের সব mock data Firestore-এ upload করবে:\n\n" +
        "• Admins (1 record)\n" +
        "• Members (5 records)\n" +
        "• Trainers (2 records)\n" +
        "• Transactions (4 records)\n" +
        "• Inventory (5 products)\n" +
        "• Leads (2 CRM leads)\n" +
        "• Attendance logs (9 records)\n" +
        "• Gym Plans config\n\n" +
        "⚠️ Existing Firestore data will be merged (not deleted).\n\n" +
        "Continue?"
    );
    if (!confirmed) return;

    // Progress দেখানোর জন্য
    const showProgress = (msg, isError = false) => {
        const el = document.getElementById('seed-progress-log');
        if (el) {
            const line = document.createElement('div');
            line.className = isError ? 'text-red-400' : 'text-green-400';
            line.textContent = msg;
            el.appendChild(line);
            el.scrollTop = el.scrollHeight;
        }
        console.log(msg);
    };

    const openModal = () => {
        let modal = document.getElementById('seed-modal-overlay');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'seed-modal-overlay';
            modal.className = 'fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                    <div class="flex items-center space-x-3 mb-4 border-b border-gray-800 pb-3">
                        <i class="ph ph-database text-2xl text-green-400"></i>
                        <h3 class="text-white font-bold text-sm uppercase tracking-widest">🌱 Firestore Seed Progress</h3>
                    </div>
                    <div id="seed-progress-log" class="font-mono text-xs space-y-1 max-h-64 overflow-y-auto bg-black/60 p-3 rounded-xl border border-gray-800"></div>
                    <div id="seed-final-msg" class="mt-4 hidden"></div>
                    <button id="seed-close-btn" onclick="document.getElementById('seed-modal-overlay').remove()" 
                        class="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2.5 rounded-lg uppercase hidden">
                        Close
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
        }
        return modal;
    };

    openModal();

    let successCount = 0;
    let errorCount = 0;

    const safeSet = async (collection, id, data) => {
        try {
            // undefined values বাদ দেওয়া (Firestore support করে না)
            const cleaned = JSON.parse(JSON.stringify(data, (k, v) => v === undefined ? null : v));
            await window.dbService.setDocument(collection, id, cleaned);
            showProgress(`  ✓ ${collection}/${id}`);
            successCount++;
        } catch (e) {
            showProgress(`  ✗ ${collection}/${id} — ${e.message}`, true);
            errorCount++;
        }
    };

    // ─── 1. ADMINS ───────────────────────────────────────────
    showProgress('📁 Seeding: admins...');
    const admins = window.ADMINS_LIST || [
        { id: "admin-001", name: "Super Admin", email: "admin@renew.com", phone: "9999999999", role: "superadmin" }
    ];
    for (const admin of admins) {
        const { password, ...safeAdmin } = admin; // password Firestore-এ রাখব না
        await safeSet('admins', safeAdmin.id || `admin-${Date.now()}`, safeAdmin);
    }

    // ─── 2. TRAINERS ─────────────────────────────────────────
    showProgress('📁 Seeding: trainers...');
    const trainers = window.ORIGINAL_MOCK_TRAINERS || window.MOCK_TRAINERS || [];
    for (const trainer of trainers) {
        const { password, ...safeTrainer } = trainer;
        await safeSet('trainers', safeTrainer.id, safeTrainer);
    }

    // ─── 3. MEMBERS ──────────────────────────────────────────
    showProgress('📁 Seeding: members...');
    const members = window.ORIGINAL_MOCK_MEMBERS || window.MOCK_MEMBERS || [];
    for (const member of members) {
        await safeSet('members', member.id, member);
    }

    // ─── 4. TRANSACTIONS ─────────────────────────────────────
    showProgress('📁 Seeding: transactions...');
    const transactions = window.ORIGINAL_MOCK_TRANSACTIONS || window.MOCK_TRANSACTIONS || [];
    for (const txn of transactions) {
        if (!txn.id) { errorCount++; continue; }
        await safeSet('transactions', txn.id, txn);
    }

    // ─── 5. INVENTORY ────────────────────────────────────────
    showProgress('📁 Seeding: inventory...');
    const inventory = window.ORIGINAL_MOCK_INVENTORY || window.MOCK_INVENTORY || [];
    for (const item of inventory) {
        await safeSet('inventory', item.id, item);
    }

    // ─── 6. CRM LEADS ────────────────────────────────────────
    showProgress('📁 Seeding: leads...');
    const leads = window.ORIGINAL_MOCK_LEADS || window.MOCK_LEADS || [];
    for (const lead of leads) {
        await safeSet('leads', lead.id, lead);
    }

    // ─── 7. MEMBER ATTENDANCE LOGS ───────────────────────────
    showProgress('📁 Seeding: attendance logs...');
    const memberAttLogs = window.ORIGINAL_MEMBER_ATTENDANCE_LOGS || window.MEMBER_ATTENDANCE_LOGS || [];
    for (let i = 0; i < memberAttLogs.length; i++) {
        const log = memberAttLogs[i];
        const logId = log.id || `att-m-${log.memberId}-${log.date}-${log.type}-${i}`;
        await safeSet('attendance', logId, { ...log, logType: 'member' });
    }

    // ─── 8. TRAINER ATTENDANCE LOGS ──────────────────────────
    showProgress('📁 Seeding: trainer attendance logs...');
    const trainerAttLogs = window.ORIGINAL_TRAINER_ATTENDANCE_LOGS || window.TRAINER_ATTENDANCE_LOGS || [];
    for (let i = 0; i < trainerAttLogs.length; i++) {
        const log = trainerAttLogs[i];
        const logId = log.id || `att-t-${log.trainerId}-${log.date}-${log.type}-${i}`;
        await safeSet('attendance', logId, { ...log, logType: 'trainer' });
    }

    // ─── 9. GYM CONFIG (Plans + Fees) ────────────────────────
    showProgress('📁 Seeding: config...');
    if (window.GYM_PLANS) {
        await safeSet('config', 'gym_plans', { plans: window.GYM_PLANS, updatedAt: new Date().toISOString() });
    }
    if (window.GYM_FEES) {
        await safeSet('config', 'gym_fees', { fees: window.GYM_FEES, updatedAt: new Date().toISOString() });
    }
    await safeSet('config', 'status', { seeded: true, updatedAt: new Date().toISOString() });

    // ─── FINAL RESULT ─────────────────────────────────────────
    const finalMsg = document.getElementById('seed-final-msg');
    const closeBtn = document.getElementById('seed-close-btn');

    if (finalMsg) {
        finalMsg.classList.remove('hidden');
        if (errorCount === 0) {
            finalMsg.innerHTML = `
                <div class="bg-green-950/40 border border-green-700/40 rounded-xl p-4 text-center">
                    <p class="text-green-400 font-bold text-sm">✅ সম্পূর্ণ সফল!</p>
                    <p class="text-green-300 text-xs mt-1">${successCount} records Firestore-এ successfully upload হয়েছে।</p>
                    <p class="text-gray-500 text-[10px] mt-2">Firebase Console → Firestore → Data tab-এ দেখুন।</p>
                </div>
            `;
        } else {
            finalMsg.innerHTML = `
                <div class="bg-amber-950/40 border border-amber-700/40 rounded-xl p-4 text-center">
                    <p class="text-amber-400 font-bold text-sm">⚠️ আংশিক সফল</p>
                    <p class="text-amber-300 text-xs mt-1">✓ ${successCount} সফল | ✗ ${errorCount} ব্যর্থ</p>
                    <p class="text-gray-500 text-[10px] mt-2">Console খুলে error details দেখুন।</p>
                </div>
            `;
        }
    }

    if (closeBtn) closeBtn.classList.remove('hidden');

    showProgress(`\n─── সম্পূর্ণ: ${successCount} uploaded, ${errorCount} failed ───`);
};
