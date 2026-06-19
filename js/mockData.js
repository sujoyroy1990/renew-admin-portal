// js/mockData.js

// ১. ট্রেইনারদের ডামি ডেটা (Mock Trainers)
const MOCK_TRAINERS = [
    {
        id: "t1",
        name: "Rahul Sharma",
        photoUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150",
        email: "rahul@renew.com",
        phone: "9876543210",
        address: "Birati, Kolkata",
        joiningDate: "2025-01-10",
        dob: "1995-05-15",
        assignedFighterIds: ["m1", "m2"],
        kpis: { totalAssigned: 2, retentionRate: 95, satisfaction: 4.8, attendanceRate: 98 },
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
        address: "Dum Dum, Kolkata",
        joiningDate: "2025-03-22",
        dob: "1992-08-20",
        assignedFighterIds: ["m3"],
        kpis: { totalAssigned: 1, retentionRate: 88, satisfaction: 4.2, attendanceRate: 92 },
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