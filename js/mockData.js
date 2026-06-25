// js/mockData.js

// ১. ট্রেইনারদের ডামি ডেটা (Mock Trainers)
const MOCK_TRAINERS = [];

// ২. মেম্বারদের ডামি ডেটা (Mock Members)
// স্ট্যাটাস লজিক: active, expiring (১৫ দিনের মধ্যে শেষ হবে), at_risk (২ মাস ডিউ), expired (৩ মাস ডিউ)
const MOCK_MEMBERS = [];
const MOCK_LEADS = [
    { id: "LED-101", name: "Anupam Sarkar", phone: "+91 98321 44552", source: "Facebook Ads", status: "new", date: "2026-06-12", notes: "Interested in MMA Fighter Track. Wants evening slots." },
    { id: "LED-102", name: "Subhadip Dutta", phone: "+91 91632 77881", source: "Walk-in", status: "trial", date: "2026-06-13", notes: "Scheduled Free Boxing Trial for tomorrow morning." },
    { id: "LED-103", name: "Priya Roy", phone: "+91 98300 11223", source: "Member Referral", status: "new", date: "2026-06-15", notes: "Wants to join with her friend.", referredBy: "m-8899", referrerName: "Rohan Karmakar" },
    { id: "LED-104", name: "Debasmita Sen", phone: "+91 89021 55664", source: "Instagram", status: "lost", date: "2026-06-05", notes: "Distance issue. Gym is too far from her location." }
];

const MOCK_INVENTORY = [
    { id: "PRD-201", name: "Premium Whey Isolate (1kg)", category: "supplements", price: 3500, stock: 15, maxStock: 50, image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=300" },
    { id: "PRD-202", name: "Pro Boxing Leather Gloves", category: "gear", price: 2200, stock: 4, maxStock: 20, image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=300" },
    { id: "PRD-203", name: "RENEW Fighter Stringer/T-Shirt", category: "apparel", price: 650, stock: 32, maxStock: 100, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300" },
    { id: "PRD-204", name: "Pre-Workout Energy Explode", category: "supplements", price: 1800, stock: 0, maxStock: 30, image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300" },
    { id: "PRD-205", name: "Smart Neon Shaker Bottle", category: "gear", price: 450, stock: 8, maxStock: 25, image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300" }
];

const GYM_EVENTS = [
    { id: "evt-01", eventNo: "EVT-101", title: "MMA Cage Fighting Masterclass", date: "2026-06-25", time: "06:00 PM", amount: 1500, description: "Special striking and takedown defense seminar with Coach Rahul Sharma. Free for active fighters.", venue: "Main Ring Floor Zone A" },
    { id: "evt-02", eventNo: "EVT-102", title: "Keto & Weight Cut Nutrition Seminar", date: "2026-07-02", time: "11:00 AM", amount: 800, description: "Learn how to optimize macro counting and manage weight cuts before tournaments.", venue: "Cafeteria Lounge" }
];

// ৩. ফিন্যান্স বা ক্যাশ ফ্লো ডামি ডেটা (Mock Transactions)
const MOCK_TRANSACTIONS = [
    { id: "tx1", type: "income", description: "Sourav Ganguly - PT Combo Fee", amount: 5000, mode: "UPI", date: "2026-06-01", category: "pt", trainerId: "t1", memberId: "m1", status: "paid" },
    { id: "tx2", type: "income", description: "Supplement Sales (Whey Protein)", amount: 6500, mode: "Card", date: "2026-06-10", category: "supplement", trainerId: "t1", status: "paid" },
    { id: "tx3", type: "expense", description: "Electricity Bill Gym", amount: 4500, mode: "Bank Transfer", date: "2026-06-05", category: "Utility", status: "paid" },
    { id: "tx4", type: "expense", description: "Trainer Salary - Rahul Sharma", amount: 12000, mode: "Bank Transfer", date: "2026-06-02", category: "Salary", trainerId: "t1", status: "paid" }
];

// Restore from LocalStorage helper
const restoreFromStorage = (key, globalVarName, defaultVal) => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                window[globalVarName] = parsed;
                return;
            }
        } catch(e) {}
    }
    window[globalVarName] = defaultVal;
};

// Restore all global collections
restoreFromStorage('MOCK_MEMBERS_DB', 'MOCK_MEMBERS', MOCK_MEMBERS);
restoreFromStorage('RENEW_TRAINERS_DB', 'MOCK_TRAINERS', MOCK_TRAINERS);
restoreFromStorage('RENEW_TRANSACTIONS_DB', 'MOCK_TRANSACTIONS', MOCK_TRANSACTIONS);
restoreFromStorage('MOCK_LEADS_DB', 'MOCK_LEADS', MOCK_LEADS);
restoreFromStorage('MOCK_INVENTORY_DB', 'MOCK_INVENTORY', MOCK_INVENTORY);
restoreFromStorage('GYM_EVENTS_DB', 'GYM_EVENTS', GYM_EVENTS);

// ৫. ড্যাশবোর্ডের ওভারভিউ মেট্রিক্স অটো-ক্যালকুলেশন অবজেক্ট
const getDashboardMetrics = () => {
    const members = window.MOCK_MEMBERS || [];
    const totalMembers = members.length;
    const dailyPresent = members.filter(m => m.checkedInToday).length;
    const expiringSoon = members.filter(m => m.status === 'expiring').length;
    
    let avgAttendance = "0%";
    if (totalMembers > 0) {
        const presentPct = Math.round((dailyPresent / totalMembers) * 100);
        const activeMembers = members.filter(m => m.status === 'active').length;
        const activePct = Math.round((activeMembers / totalMembers) * 85);
        avgAttendance = `${Math.max(presentPct, activePct, 15)}%`;
    }
    
    return {
        totalMembers,
        dailyPresent,
        avgAttendance,
        expiringSoon
    };
};
window.getDashboardMetrics = getDashboardMetrics;

// =========================================================================
// ৬. শেয়ার্ড রেভিনিউ শেয়ারিং ইঞ্জিন — Admin ও Trainer উভয় পোর্টাল ব্যবহার করে
// =========================================================================

// কমিশন রুলস: category → share rate
window.COMMISSION_RULES = {
    'pt':           0.20,  // 20% — Personal Training
    'diet plan':    0.10,  // 10% — Diet Plan Chart
    'supplement':   0.05,  // 5%  — Supplement Sales
    'supplements':  0.05,  // 5%
    'gear':         0.05,  // 5%
    'apparel':      0.05,  // 5%
};

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

// ৭. ট্রেইনার ও মেম্বারদের চেক-ইন/আউট হিস্ট্রি ও ডেইলি টোকেন জেনারেটর
window.generateDailyToken = function() {
    const today = new Date();
    return `RNW-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-9932`; 
};

// ট্রেইনারদের চেক-ইন/আউট হিস্ট্রি লগ
window.TRAINER_ATTENDANCE_LOGS = [];

// মেম্বারদের চেক-ইন/আউট হিস্ট্রি লগ
window.MEMBER_ATTENDANCE_LOGS = [];

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
        if (m.streak === undefined) {
            if (m.attendanceStreak) {
                m.streak = parseInt(m.attendanceStreak) || 0;
            } else {
                m.streak = m.lastCheckIn ? 1 : 0;
            }
        }
        if (!m.attendanceStreak) {
            m.attendanceStreak = `${m.streak || 0} Days`;
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

// Backup original mock data for manual seeding
window.ORIGINAL_MOCK_TRANSACTIONS = JSON.parse(JSON.stringify(MOCK_TRANSACTIONS));
window.ORIGINAL_MOCK_LEADS = JSON.parse(JSON.stringify(MOCK_LEADS));