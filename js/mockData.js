// js/mockData.js

// ১. ট্রেইনারদের ডামি ডেটা (Mock Trainers)
const MOCK_TRAINERS = [
    {
        id: "t1",
        name: "Rahul Sharma",
        photoUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150",
        email: "rahul@renew.com",
        phone: "9876543210",
        password: "password123",
        address: "Birati, Kolkata",
        joiningDate: "2025-01-10",
        dob: "1995-05-15",
        status: "active",
        assignedFighterIds: ["m1", "m2"],
        kpis: { totalAssigned: 2, retentionRate: 95, satisfaction: 4.8, attendanceRate: 98, fighterRatings: [] },
        revenue: { ptSales: 15000, dietPlanSales: 3000, supplementSales: 5000, totalRevenue: 23000 },
        todayAttendance: { checkIn: "06:00 AM", checkOut: "11:00 AM", workingHours: 5 },
        monthlyStats: { daysPresent: 24, lateArrivals: 2, absentDays: 1 }
    },
    {
        id: "t2",
        name: "Vikram Das",
        photoUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=150",
        email: "vikram@renew.com",
        phone: "9876543211",
        password: "password123",
        address: "Dum Dum, Kolkata",
        joiningDate: "2025-03-22",
        dob: "1992-08-20",
        status: "active",
        assignedFighterIds: ["m3"],
        kpis: { totalAssigned: 1, retentionRate: 88, satisfaction: 4.2, attendanceRate: 92, fighterRatings: [] },
        revenue: { ptSales: 8000, dietPlanSales: 1500, supplementSales: 2000, totalRevenue: 11500 },
        todayAttendance: { checkIn: "07:15 AM", checkOut: null, workingHours: 0 }, // এখনো চেক-আউট করেনি
        monthlyStats: { daysPresent: 22, lateArrivals: 5, absentDays: 3 }
    }
];

// ২. মেম্বারদের ডামি ডেটা (Mock Members)
// স্ট্যাটাস লজিক: active, expiring (১৫ দিনের মধ্যে শেষ হবে), at_risk (২ মাস ডিউ), expired (৩ মাস ডিউ)
const MOCK_MEMBERS = [
    { id: "m-001", name: "Subham Das", phone: "+91 98300 11223", email: "subham@gmail.com", plan: "Monthly Regular Track", expiryDate: "2026-07-12", status: "active", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", checkedInToday: true, lastCheckIn: "2026-06-17 08:30 AM", registrationDate: "2026-05-10", trainerId: "t1" },
    { id: "m-002", name: "Joydeep Pal", phone: "+91 91632 55443", email: "joydeep@gmail.com", plan: "Fighter Premium Track", expiryDate: "Pending First Scan", status: "inactive", photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", checkedInToday: false, portalLocked: true, registrationDate: "2026-06-15", trainerId: "" },
    { id: "m-003", name: "Sourav Ganguly", phone: "+91 98311 99887", email: "sourav@gmail.com", plan: "PT Combo Track", expiryDate: "2026-06-22", status: "expiring", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", checkedInToday: true, lastCheckIn: "2026-06-17 07:15 AM", registrationDate: "2026-05-22", trainerId: "t1" },
    { id: "m-004", name: "Anirban Das", phone: "+91 97482 33445", email: "anirban@gmail.com", plan: "Elite Annual Pack", expiryDate: "Pending First Scan", status: "inactive", photoUrl: "https://images.unsplash.com/photo-1620122303020-43ec4b6cf7f8?w=150", checkedInToday: false, portalLocked: false, registrationDate: "2026-05-01", trainerId: "" },
    { id: "m-005", name: "Rohan Das", phone: "9433011223", email: "rohan@gmail.com", plan: "Quarterly Track", expiryDate: "2026-04-10", status: "at_risk", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", checkedInToday: false, registrationDate: "2025-10-10", trainerId: "t2" }
];
window.MOCK_MEMBERS = MOCK_MEMBERS;
window.MOCK_TRAINERS = MOCK_TRAINERS;

// MOCK_MEMBERS_DB থেকে পূর্বে সেভ করা members ডাটা লোড করা
const _savedMembers = localStorage.getItem('MOCK_MEMBERS_DB');
if (_savedMembers) {
    try {
        const parsed = JSON.parse(_savedMembers);
        if (Array.isArray(parsed) && parsed.length > 0) {
            window.MOCK_MEMBERS = parsed;
        }
    } catch(e) {}
}

// RENEW_TRAINERS_DB থেকে পূর্বে সেভ করা trainers ডাটা লোড করা
const _savedTrainers = localStorage.getItem('RENEW_TRAINERS_DB');
if (_savedTrainers) {
    try {
        const parsed = JSON.parse(_savedTrainers);
        if (Array.isArray(parsed) && parsed.length > 0) {
            window.MOCK_TRAINERS = parsed;
        }
    } catch(e) {}
}

// ৩. ফিন্যান্স বা ক্যাশ ফ্লো ডামি ডেটা (Mock Transactions)
const MOCK_TRANSACTIONS = [
    { id: "tx1", type: "income", description: "Sourav Ganguly - PT Combo Fee", amount: 5000, mode: "UPI", date: "2026-06-01", category: "Fees", trainerId: "t1", memberId: "m1" },
    { id: "tx2", type: "income", description: "Supplement Sales (Whey Protein)", amount: 6500, mode: "Card", date: "2026-06-10", category: "Supplement Sales", trainerId: "t1" },
    { id: "tx3", type: "expense", description: "Electricity Bill Gym", amount: 4500, mode: "Bank Transfer", date: "2026-06-05", category: "Utility" },
    { id: "tx4", type: "expense", description: "Trainer Salary - Rahul Sharma", amount: 12000, mode: "Bank Transfer", date: "2026-06-02", category: "Salary", trainerId: "t1" }
];

// ৪. লিড বা সিআরএম ডামি ডেটা (Mock CRM Leads)
const MOCK_LEADS = [
    { id: "l1", name: "Amit Paul", phone: "9883377665", status: "New", date: "2026-06-14" },
    { id: "l2", name: "Joydeep Roy", phone: "9007711223", status: "Trial", date: "2026-06-12" }
];

// ৫. ড্যাশবোর্ডের ওভারভিউ মেট্রিক্স অটো-ক্যালকুলেশন অবজেক্ট
const getDashboardMetrics = () => {
    const totalMembers = MOCK_MEMBERS.length;
    const dailyPresent = MOCK_MEMBERS.filter(m => m.checkedInToday).length;
    const expiringSoon = MOCK_MEMBERS.filter(m => m.status === 'expiring').length;
    
    return {
        totalMembers,
        dailyPresent,
        avgAttendance: "84%", // মক পার্সেন্টেজ
        expiringSoon
    };
};

// =========================================================================
// ৬. শেয়ার্ড রেভিনিউ শেয়ারিং ইঞ্জিন — Admin ও Trainer উভয় পোর্টাল ব্যবহার করে
// =========================================================================

// কমিশন রুলস: category → share rate
window.COMMISSION_RULES = {
    'pt':           0.20,  // 20% — Personal Training
    'diet plan':    0.10,  // 10% — Diet Plan Chart
    'supplement':   0.05,  // 5%  — Supplement Sales
};

/**
 * calculateTrainerEarnings(trainerId, month)
 * @param {string} trainerId  — e.g. "t1"
 * @param {string} month      — e.g. "2026-06" (YYYY-MM prefix)
 * @returns {{ totalRevenue, totalCommission, breakdown: [{category, revenue, commission, rate}] }}
 *
 * শেয়ার্ড লজিক: Admin Finance module এবং Trainer Portal দুটোই এই ফাংশনটি call করে।
 * window.MOCK_TRANSACTIONS সবসময় একই shared array — তাই Admin এন্ট্রি করলে
 * Trainer Portal সাথে সাথে নতুন ডেটা দেখায়।
 */
window.calculateTrainerEarnings = function(trainerId, month) {
    const txns = window.MOCK_TRANSACTIONS || [];
    const relevant = txns.filter(t =>
        t.trainerId === trainerId &&
        t.type === 'income' &&
        t.status === 'paid' &&
        (!month || t.date.startsWith(month))
    );

    let totalRevenue = 0;
    let totalCommission = 0;
    const categoryMap = {};

    relevant.forEach(t => {
        const catKey = (t.category || '').toLowerCase();
        const rate = window.COMMISSION_RULES[catKey] || 0;
        const commission = t.amount * rate;

        totalRevenue += t.amount;
        totalCommission += commission;

        if (!categoryMap[catKey]) {
            categoryMap[catKey] = { category: t.category, revenue: 0, commission: 0, rate };
        }
        categoryMap[catKey].revenue += t.amount;
        categoryMap[catKey].commission += commission;
    });

    const breakdown = Object.values(categoryMap);
    return { totalRevenue, totalCommission, breakdown };
};

// localStorage থেকে পূর্বে সেভ করা transactions লোড করা
const _savedTxns = localStorage.getItem('RENEW_TRANSACTIONS_DB');
if (_savedTxns) {
    try {
        const parsed = JSON.parse(_savedTxns);
        if (Array.isArray(parsed) && parsed.length > 0) {
            // merge: localStorage entries আগে, তারপর mock entries (duplicate id বাদে)
            const existingIds = new Set(parsed.map(t => t.id));
            const merged = [...parsed, ...(window.MOCK_TRANSACTIONS || []).filter(t => !existingIds.has(t.id))];
            window.MOCK_TRANSACTIONS = merged;
        }
    } catch(e) { /* ignore parse errors */ }
}

// ৭. ট্রেইনার ও মেম্বারদের চেক-ইন/আউট হিস্ট্রি ও ডেইলি টোকেন জেনারেটর
window.generateDailyToken = function() {
    const today = new Date();
    return `RNW-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-9932`; 
};

// ট্রেইনারদের চেক-ইন/আউট হিস্ট্রি লগ
window.TRAINER_ATTENDANCE_LOGS = [
    { trainerId: "t1", trainerName: "Rahul Sharma", type: "check-in", date: "2026-06-18", time: "06:00 AM" },
    { trainerId: "t1", trainerName: "Rahul Sharma", type: "check-out", date: "2026-06-18", time: "11:00 AM" },
    { trainerId: "t2", trainerName: "Vikram Das", type: "check-in", date: "2026-06-18", time: "07:15 AM" },
    { trainerId: "t2", trainerName: "Vikram Das", type: "check-out", date: "2026-06-18", time: "12:30 PM" },
    { trainerId: "t1", trainerName: "Rahul Sharma", type: "check-in", date: "2026-06-19", time: "06:00 AM" },
    { trainerId: "t1", trainerName: "Rahul Sharma", type: "check-out", date: "2026-06-19", time: "11:00 AM" }
];

// মেম্বারদের চেক-ইন/আউট হিস্ট্রি লগ
window.MEMBER_ATTENDANCE_LOGS = [
    { memberId: "m-001", memberName: "Subham Das", type: "check-in", date: "2026-06-18", time: "08:30 AM", method: "QR Scan" },
    { memberId: "m-001", memberName: "Subham Das", type: "check-out", date: "2026-06-18", time: "10:15 AM", method: "QR Scan" },
    { memberId: "m-003", memberName: "Sourav Ganguly", type: "check-in", date: "2026-06-18", time: "07:15 AM", method: "Desk Scan" },
    { memberId: "m-003", memberName: "Sourav Ganguly", type: "check-out", date: "2026-06-18", time: "09:00 AM", method: "Desk Scan" },
    { memberId: "m-001", memberName: "Subham Das", type: "check-in", date: "2026-06-19", time: "08:30 AM", method: "Token PIN" }
];

// LocalStorage থেকে হিস্ট্রি রিস্টোর করা
const _savedTrainerAttendance = localStorage.getItem('RENEW_TRAINER_ATTENDANCE_DB');
if (_savedTrainerAttendance) {
    try { window.TRAINER_ATTENDANCE_LOGS = JSON.parse(_savedTrainerAttendance); } catch(e) {}
}
const _savedMemberAttendance = localStorage.getItem('RENEW_MEMBER_ATTENDANCE_DB');
if (_savedMemberAttendance) {
    try { window.MEMBER_ATTENDANCE_LOGS = JSON.parse(_savedMemberAttendance); } catch(e) {}
}

// মেম্বারদের checkInHistory অবজেক্ট ইনিশিয়ালাইজ করা
if (window.MOCK_MEMBERS) {
    window.MOCK_MEMBERS.forEach(m => {
        if (!m.checkInHistory) {
            m.checkInHistory = window.MEMBER_ATTENDANCE_LOGS.filter(l => l.memberId === m.id).map(l => ({
                type: l.type === 'check-in' ? 'in' : 'out',
                date: l.date,
                time: l.time,
                method: l.method
            }));
        }
    });
}

// ৮. এডমিনদের ডামি ও সেভ করা ডাটা লোড করা
window.ADMINS_LIST = [
    { id: "admin", name: "Super Admin", email: "admin@renew.com", phone: "9999999999", password: "admin" }
];
const _savedAdmins = localStorage.getItem('RENEW_ADMINS_DB');
if (_savedAdmins) {
    try {
        const parsed = JSON.parse(_savedAdmins);
        if (Array.isArray(parsed) && parsed.length > 0) {
            window.ADMINS_LIST = parsed;
        }
    } catch(e) {}
}

// ৯. Fighter Product Orders — Shared global store (Fighter Portal + Admin Inventory sync)
// প্রতিটি order object:
// { id, memberId, memberName, productId, productName, productCategory, price, qty, paymentMode, orderDate, status }
// status: 'pending_payment' | 'paid_pending_dispatch' | 'delivered'
window.FIGHTER_PRODUCT_ORDERS = [];

const _savedOrders = localStorage.getItem('FIGHTER_ORDERS_DB');
if (_savedOrders) {
    try {
        const parsed = JSON.parse(_savedOrders);
        if (Array.isArray(parsed)) {
            window.FIGHTER_PRODUCT_ORDERS = parsed;
        }
    } catch(e) {}
}

// Helper: Orders সেভ করার utility function
window.saveFighterOrders = function() {
    try {
        localStorage.setItem('FIGHTER_ORDERS_DB', JSON.stringify(window.FIGHTER_PRODUCT_ORDERS));
    } catch(e) {}
};