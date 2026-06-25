// =========================================================================
// R.E.N.E.W ADMIN PORTAL — MAIN APPLICATION ROUTER & CONTROLLER (app.js)
// =========================================================================

window.loggedInRole = null; // 'admin', 'trainer', 'fighter'

window.checkAuthAndNavigate = function() {
    const sidebar = document.getElementById('sidebar');
    const header = document.querySelector('main header');
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const role = localStorage.getItem('RENEW_LOGGED_IN_ROLE');
    const userId = localStorage.getItem('RENEW_LOGGED_IN_USER_ID');

    if (role && userId) {
        window.loggedInRole = role;
        
        if (role === 'admin') {
            // Restore Admin interface
            if (sidebar) {
                sidebar.classList.remove('hidden');
                sidebar.classList.remove('-translate-x-full');
                sidebar.classList.add('md:translate-x-0');
            }
            if (header) header.classList.remove('hidden');
            
            const lastView = localStorage.getItem('RENEW_LAST_VIEW') || 'dashboard';
            navigateTo(lastView);
        } else if (role === 'trainer') {
            // Restore Trainer interface (No sidebar or admin header)
            if (sidebar) sidebar.classList.add('hidden');
            if (header) header.classList.add('hidden');
            
            const trainer = window.MOCK_TRAINERS.find(t => t.id === userId);
            if (trainer) {
                window.loggedInTrainer = trainer;
                navigateTo('trainer-portal');
            } else {
                window.clearSession();
            }
        } else if (role === 'fighter') {
            // Restore Fighter interface (No sidebar or admin header)
            if (sidebar) sidebar.classList.add('hidden');
            if (header) header.classList.add('hidden');
            
            const fighter = window.MOCK_MEMBERS.find(m => m.id === userId);
            if (fighter) {
                window.loggedInFighter = fighter;
                navigateTo('fighter-portal');
            } else {
                window.clearSession();
            }
        }
    } else {
        // Render unified auth page
        if (sidebar) sidebar.classList.add('hidden');
        if (header) header.classList.add('hidden');
        
        mainContent.innerHTML = getUnifiedLoginView();
    }
};

window.clearSession = function() {
    localStorage.removeItem('RENEW_LOGGED_IN_ROLE');
    localStorage.removeItem('RENEW_LOGGED_IN_USER_ID');
    window.loggedInRole = null;
    window.loggedInTrainer = null;
    window.loggedInFighter = null;
    window.checkAuthAndNavigate();
};

function navigateTo(viewId) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Check if navigation is authorized. If not logged in, force check.
    const role = localStorage.getItem('RENEW_LOGGED_IN_ROLE');
    if (!role) {
        window.checkAuthAndNavigate();
        return;
    }

    // Save last view for Admin persistence
    if (role === 'admin' && viewId !== 'trainer-portal' && viewId !== 'fighter-portal') {
        localStorage.setItem('RENEW_LAST_VIEW', viewId);
    }

    // ১. সাইডবার একটিভ ক্লাস ম্যানেজমেন্ট
    const navButtons = document.querySelectorAll('#sidebar-nav button');
    navButtons.forEach(btn => btn.classList.remove('active-nav'));
    
    // বর্তমান বাটনে একটিভ ক্লাস যোগ করা
    const currentButton = Array.from(navButtons).find(btn => btn.getAttribute('onclick')?.includes(`'${viewId}'`));
    if (currentButton) currentButton.classList.add('active-nav');

    // ২. পেজ টাইটেল ডাইনামিকালি সেট করা — Fixed: proper names for all routes
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        const titleMap = {
            'dashboard':      'Dashboard',
            'members':        'Members',
            'trainers':       'Trainers',
            'finance':        'Finance',
            'crm':            'CRM & Leads',
            'inventory':      'Gym Store Inventory',
            'reports':        'Report Generate',
            'registration':   'New Member Admission',
            'fighter-portal': 'Fighter Portal',
            'trainer-portal': 'Trainer Portal',
            'trainer-signup': 'Trainer Sign Up',
        };
        pageTitle.textContent = titleMap[viewId] || viewId.charAt(0).toUpperCase() + viewId.slice(1).replace(/-/g, ' ');
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
    else if (viewId === 'trainer-portal') { 
        mainContent.innerHTML = getTrainerPortalView(); 
    }
    else if (viewId === 'trainer-signup') { 
        mainContent.innerHTML = getTrainerSignupView(); 
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

document.addEventListener('DOMContentLoaded', () => { 
    window.checkAuthAndNavigate(); 

    // Mobile Sidebar Toggle Handler
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });

        // Close sidebar on navigation click on mobile
        const navButtons = sidebar.querySelectorAll('#sidebar-nav button');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        });
    }
});