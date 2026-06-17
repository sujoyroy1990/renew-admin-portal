// =========================================================================
// R.E.N.E.W ADMIN PORTAL — MAIN APPLICATION ROUTER & CONTROLLER (app.js)
// =========================================================================

/**
 * MOBILE RESPONSIVE FUNCTIONS
 */

// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Close sidebar (called when navigating or clicking overlay)
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// =========================================================================

/**
 * SPA Router: সাইডবার মেনুতে ক্লিক করলে এই ফাংশনটি অন-ডিমান্ড 
 * নির্দিষ্ট কম্পোনেন্টের HTML এবং লজিককে মেইন স্ক্রিনে ইনজেক্ট করে।
 * @param {string} viewId - দ্য আইডি অফ দ্য ভিউ (e.g., 'dashboard', 'members', 'trainers', 'finance', 'crm')
 */
function navigateTo(viewId) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Close sidebar on mobile when navigating
    closeSidebar();

    // ১. সাইডবারের বাটনের লাল হাইলাইট অ্যাক্টিভ ক্লাস পরিবর্তন করা
    const navButtons = document.querySelectorAll('#sidebar-nav button');
    navButtons.forEach(btn => btn.classList.remove('active-nav'));

    // যে বাটনটিতে ক্লিক করা হয়েছে সেটি খুঁজে বের করে হাইলাইট ('active-nav') করা
    const currentButton = Array.from(navButtons).find(btn => 
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${viewId}'`)
    );
    if (currentButton) currentButton.classList.add('active-nav');

    // ২. ওপরে টপবারের পেজ টাইটেল ডাইনামিকালি পরিবর্তন করা
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        if (viewId === 'crm') {
            pageTitle.textContent = 'CRM & Leads';
        } else {
            // প্রথম অক্ষর বড় হাতের করা (যেমন: finance -> Finance)
            pageTitle.textContent = viewId.charAt(0).toUpperCase() + viewId.slice(1);
        }
    }

    // ৩. ডাইনামিক ভিউ ইনজেকশন ও কম্পোনেন্ট ইনিশিয়ালাইজেশন রাউটার লজিক
    
    // --- ড্যাশবোর্ড মডিউল ---
    if (viewId === 'dashboard') {
        mainContent.innerHTML = getDashboardView(); // dashboard.js থেকে এইচটিএমএল স্ট্রাকচার আনা
        renderDashboardMetrics();                   // মেট্রিক্স রেন্ডার
        renderLiveStatusTracking();                 // লাইভ স্ক্যান মনিটর টেবিল রেন্ডার
        
        // কিউআর কোডের নিচে কাউন্টডাউন টাইমার উইজেটটি তৈরি করা (যদি না থাকে)
        if (!document.getElementById('qr-timer')) {
            const qrBox = document.getElementById('qr-token');
            if (qrBox) {
                const timerSpan = document.createElement('p');
                timerSpan.id = 'qr-timer';
                timerSpan.className = 'text-[10px] text-brandRed font-mono mt-1';
                qrBox.parentNode.appendChild(timerSpan);
            }
        }
        startQRTimer(); // ডাইনামিক কিউআর জেনারেশন ও টাইমার রান করা
    } 
    
    // --- মেম্বার্স মডিউল ---
    else if (viewId === 'members') {
        mainContent.innerHTML = getMembersView(); // members.js থেকে এইচটিএমএল স্ট্রাকচার আনা
        renderMembersPage();                     // সার্চ, ফিল্টার সাব-ট্যাব ও টেবিল ইনিশিয়ালাইজ
    } 
    
    // --- TRT/ট্রেইনার্স মডিউল ---
    else if (viewId === 'trainers') {
        mainContent.innerHTML = getTrainersView(); // trainers.js থেকে এইচটিএমএল স্ট্রাকচার আনা
        renderTrainersPage();                     // প্রোফাইল, KPIs, ফাইটার্স ও এডমিন অ্যাকশন রেন্ডার
    } 
    
    // --- ফিন্যান্স ও বিলিং মডিউল ---
    else if (viewId === 'finance') {
        mainContent.innerHTML = getFinanceView(); // finance.js থেকে এইচটিএমএল স্ট্রাকচার আনা
        renderFinancePage();                     // ক্যাশফ্লো উইজেটস, ইনভয়েস টেবিল ও ফিল্টারস ইনিশিয়ালাইজ
    } 
    
    // --- নতুন যুক্ত হওয়া অ্যাক্টিভ মডিউল: CRM & LEADS পাইপলাইন ---
    else if (viewId === 'crm') {
        mainContent.innerHTML = getCRMView();     // crm.js থেকে এইচটিএমএল স্ট্রাকচার আনা
        renderCRMPage();                         // সিআরএম এর মেট্রিক্স, ওমনি মোডাল ও টেবিল সচল করা
    }

    // --- ই-কমার্স ইনভেন্টরি ও রিটেল মডিউল ---
    else if (viewId === 'inventory') {
        mainContent.innerHTML = getInventoryView(); // inventory.js থেকে লেআউট নিয়ে আসবে
        renderInventoryPage();  
    }
    //reports download
    else if (viewId === 'reports') {
        mainContent.innerHTML = getReportsView(); // reports.js theke layout niye asbe
        renderReportsPage();                      // 10-types of graphs and micro reports load korbe
     }                   // ই-কমার্স গ্রিড ও ফিল্টার লোড করবে
    }
    //
    // --- ফিউচার মডিউল ব্যাকআপ (অন্যান্য মডিউল যা এখনও তৈরি হয়নি) ---
    else {
        mainContent.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center space-y-4 border border-dashed border-gray-800 rounded-2xl p-8 bg-darkSurface/30">
                <div class="p-4 bg-brandRed/10 text-brandRed rounded-full text-4xl animate-bounce">
                    <i class="ph ph-wrench"></i>
                </div>
                <div class="text-center">
                    <h3 class="text-white font-bold tracking-wide uppercase text-sm">${viewId} Module</h3>
                    <p class="text-xs text-gray-500 mt-1">This workspace is currently under development or scheduled for the next release step.</p>
                </div>
            </div>
        `;
    }
}

// =========================================================================
// APPLICATION INITIALIZER
// =========================================================================
// পেজ প্রথমবার ব্রাউজারে লোড হওয়ার সাথে সাথে ডিফল্টভাবে ড্যাশবোর্ড পেজটি সিলেক্ট হয়ে সচল থাকবে
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main page
    navigateTo('dashboard');
    
    // Mobile menu toggle event listener
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when overlay is clicked
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar when window is resized to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeSidebar();
        }
    });
});