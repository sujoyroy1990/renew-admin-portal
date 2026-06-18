// =========================================================================
// R.E.N.E.W ADMIN PORTAL — MAIN APPLICATION ROUTER & CONTROLLER (app.js)
// =========================================================================

function navigateTo(viewId) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // ১. সাইডবার একটিভ ক্লাস ম্যানেজমেন্ট
    const navButtons = document.querySelectorAll('#sidebar-nav button');
    navButtons.forEach(btn => btn.classList.remove('active-nav'));
    
    // বর্তমান বাটনে একটিভ ক্লাস যোগ করা
    const currentButton = Array.from(navButtons).find(btn => btn.getAttribute('onclick')?.includes(`'${viewId}'`));
    if (currentButton) currentButton.classList.add('active-nav');

    // ২. পেজ টাইটেল ডাইনামিকালি সেট করা
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = viewId === 'crm' ? 'CRM & Leads' : 
                                viewId === 'registration' ? 'New Member Admission' : 
                                viewId.charAt(0).toUpperCase() + viewId.slice(1);
    }

    // ৩. রাউটিং ও ভিউ ইনজেকশন
    if (viewId === 'dashboard') {
        mainContent.innerHTML = getDashboardView();
        renderDashboardMetrics();
        renderLiveStatusTracking();
        if (typeof startQRTimer === 'function') startQRTimer();
    } 
    else if (viewId === 'members') { 
        mainContent.innerHTML = getMembersView(); 
        renderMembersPage(); 
    } 
    else if (viewId === 'registration') { 
        mainContent.innerHTML = getMemberRegistrationView(); 
    } 
    else if (viewId === 'trainers') { 
        mainContent.innerHTML = getTrainersView(); 
        renderTrainersPage(); 
    } 
    else if (viewId === 'finance') { 
        mainContent.innerHTML = getFinanceView(); 
        renderFinancePage(); 
    } 
    else if (viewId === 'inventory') { 
        mainContent.innerHTML = getInventoryView(); 
        renderInventoryPage(); 
    } 
    else if (viewId === 'crm') { 
        mainContent.innerHTML = getCRMView(); 
        renderCRMPage(); 
    } 
    else if (viewId === 'reports') { 
        mainContent.innerHTML = getReportsView(); 
        renderReportsPage(); 
    } 
    else if (viewId === 'fighter-portal') { 
        mainContent.innerHTML = getFighterPortalView(); 
    }
    else {
        mainContent.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center space-y-4 border border-dashed border-gray-800 rounded-2xl p-8 bg-darkSurface/30">
                <div class="p-4 bg-brandRed/10 text-brandRed rounded-full text-4xl animate-bounce"><i class="ph ph-wrench"></i></div>
                <div class="text-center">
                    <h3 class="text-white font-bold tracking-wide uppercase text-sm">${viewId} Module</h3>
                    <p class="text-xs text-gray-500 mt-1">This workspace is currently under development.</p>
                </div>
            </div>
        `;
    }
}

// ডিফল্টভাবে ড্যাশবোর্ড পেজটি লোড করা
document.addEventListener('DOMContentLoaded', () => { 
    navigateTo('dashboard'); 
});