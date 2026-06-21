// =========================================================================
// js/components/unified_auth.js — UNIFIED TAB-BASED PORTAL LOGIN & SIGNUP
// =========================================================================

let activeAuthMode = 'login'; // 'login' or 'register'
let activeRoleTab = 'admin';  // 'admin', 'trainer', 'fighter'

function getUnifiedLoginView() {
    const plans = window.GYM_PLANS || [
        { id: "PLN-1", name: "Monthly Regular Track", fee: 1500 },
        { id: "PLN-2", name: "Fighter Premium Track", fee: 2500 }
    ];
    const planOptions = plans.map(p => 
        `<option value="${p.name}" data-fee="${p.fee}">${p.name} - ₹${p.fee}</option>`
    ).join('');

    setTimeout(() => {
        // Initialize dynamic visibility states
        window.updateAuthUI();
    }, 10);

    return `
        <div class="min-h-[85vh] flex flex-col items-center justify-center py-6 px-4 animate-fadeIn neon-font w-full">
            
            <!-- Bulb/Light Component -->
            <div class="bulb-container">
                <div class="bulb" id="bulb"></div>
            </div>

            <div class="relative w-full max-w-lg bg-gradient-to-br from-gray-950 via-darkSurface to-black border border-cyan-500/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(0,255,255,0.15)] overflow-hidden group">
                
                <!-- Scanlines effect -->
                <div class="scanlines"></div>
                
                <!-- Background decorative glowing circles -->
                <div class="absolute -top-16 -right-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                <div class="absolute -bottom-20 -left-16 w-48 h-48 bg-brandRed/5 rounded-full blur-3xl group-hover:bg-brandRed/10 transition-all duration-700"></div>

                <!-- TITLE & GATEWAY SUBHEADER -->
                <div class="text-center mb-6 relative z-10">
                    <div class="w-14 h-14 bg-gradient-to-tr from-brandRed to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                        <i class="ph ph-shield-check text-white text-3xl"></i>
                    </div>
                    <h2 class="text-white font-black text-2xl tracking-widest uppercase neon-glow-text">R.E.N.E.W Portal Gateway</h2>
                    <p class="text-gray-500 text-xs mt-1 uppercase tracking-widest" id="auth-subtitle">Roster Sign-in System</p>
                </div>

                <!-- Status Box (Initially hidden) -->
                <div class="terminal-status-box hidden mb-6 relative z-10" id="statusBox">
                    <span id="statusText"></span>
                </div>

                <!-- MODE SELECTOR (LOGIN VS REGISTER TABS) -->
                <div id="auth-mode-selector-container" class="flex bg-black/40 border border-gray-800/80 p-1 rounded-2xl mb-6 relative z-10">
                    <button onclick="window.switchAuthMode('login')" id="mode-login-btn" class="flex-1 text-center py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 bg-indigo-600 text-white shadow-md">
                        Login to Portal
                    </button>
                    <button onclick="window.switchAuthMode('register')" id="mode-register-btn" class="flex-1 text-center py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 text-gray-500 hover:text-white">
                        Add to Club (Register)
                    </button>
                </div>

                <!-- ROLE SELECTOR TABS -->
                <div id="auth-role-tabs-container" class="flex justify-center space-x-1.5 bg-black/20 p-1 border border-gray-850/60 rounded-xl mb-6 relative z-10">
                    <button onclick="window.switchRoleTab('admin')" id="role-admin-btn" class="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 bg-white/5 border border-white/10 text-white shadow-inner">
                        <i class="ph ph-user-gear mr-1 text-sm"></i> Admin
                    </button>
                    <button onclick="window.switchRoleTab('trainer')" id="role-trainer-btn" class="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 text-gray-500 hover:text-white">
                        <i class="ph ph-barbell mr-1 text-sm"></i> Trainer
                    </button>
                    <button onclick="window.switchRoleTab('fighter')" id="role-fighter-btn" class="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 text-gray-500 hover:text-white">
                        <i class="ph ph-user-focus mr-1 text-sm"></i> Fighter
                    </button>
                </div>

                <!-- ==================== LOGIN FORM CONTAINER ==================== -->
                <div id="login-form-container" class="space-y-4 relative z-10">
                    <div class="space-y-3.5">
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider" id="login-id-label">Credential ID</label>
                            <input type="text" id="login-id-input" placeholder="e.g. admin" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-3 text-white text-xs mt-1 focus:outline-none transition-colors font-mono">
                            <div class="underline-green"></div>
                        </div>
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Access PIN / Password</label>
                            <input type="password" id="login-password-input" placeholder="••••••" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-3 text-white text-xs mt-1 focus:outline-none transition-colors font-mono">
                            <div class="underline-cyan"></div>
                            <p class="text-[9px] text-gray-600 mt-2 italic font-medium" id="login-desc-text">* PIN required for Admin. Trainers/Fighters use password.</p>
                            <div class="flex justify-between items-center text-[10px] mt-2 px-1">
                                <span class="text-gray-500 italic">Secure session auth</span>
                                <a href="javascript:void(0)" onclick="window.triggerAuthRecovery()" id="auth-recovery-link" class="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-colors">Forgot Password?</a>
                            </div>
                        </div>
                    </div>

                    <button onclick="window.submitAuthLogin()" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-lg hover:shadow-indigo-500/10 transition-all mt-6 flex justify-center items-center gap-1.5">
                        <i class="ph ph-sign-in text-base"></i> Authenticate Credentials
                    </button>
                </div>

                <!-- ==================== RECOVERY FORM CONTAINER ==================== -->
                <div id="recovery-form-container" class="space-y-4 hidden relative z-10 animate-fadeIn">
                    <div class="text-center mb-4">
                        <h3 class="text-white font-extrabold text-lg uppercase tracking-wider neon-glow-text" id="recovery-title">Account Recovery</h3>
                        <p class="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5" id="recovery-subtitle">Restore access using registered phone number</p>
                    </div>

                    <div class="space-y-3.5" id="recovery-step-1">
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider" id="recovery-phone-label">Registered Phone Number</label>
                            <input type="text" id="recovery-phone-input" placeholder="e.g. 9876543210" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-3 text-white text-xs mt-1 focus:outline-none transition-colors font-mono">
                            <div class="underline-green"></div>
                        </div>
                        <button onclick="window.submitRecoveryPhone()" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg hover:shadow-indigo-500/10 transition-all mt-4">
                            Verify Phone Number
                        </button>
                    </div>

                    <!-- Step 2 (Simulated OTP verification for Admin/Trainer password recovery) -->
                    <div class="space-y-3.5 hidden" id="recovery-step-2">
                        <div class="p-3 bg-indigo-950/40 border border-indigo-900/60 rounded-xl">
                            <p class="text-[10px] text-indigo-300 font-medium leading-relaxed">
                                <i class="ph ph-info mr-1"></i> SIMULATION NOTE: An OTP code has been simulated for your registered number. Use code <span class="font-bold text-white tracking-widest bg-indigo-900/80 px-2 py-0.5 rounded font-mono">123456</span> to authorize password reset.
                            </p>
                        </div>
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Simulated 6-Digit OTP</label>
                            <input type="text" id="recovery-otp-input" placeholder="Enter 123456" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-3 text-white text-xs mt-1 focus:outline-none transition-colors font-mono text-center tracking-widest text-lg font-bold">
                            <div class="underline-cyan"></div>
                        </div>
                        <button onclick="window.submitRecoveryOTP()" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg hover:shadow-indigo-500/10 transition-all mt-2">
                            Verify OTP Code
                        </button>
                    </div>

                    <!-- Step 3 (Password Reset Form for Admin/Trainer) -->
                    <div class="space-y-3.5 hidden" id="recovery-step-3">
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Choose New Password</label>
                            <input type="password" id="recovery-new-pass" placeholder="••••••" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-3 text-white text-xs mt-1 focus:outline-none transition-colors font-mono">
                            <div class="underline-green"></div>
                        </div>
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Confirm New Password</label>
                            <input type="password" id="recovery-confirm-pass" placeholder="••••••" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-3 text-white text-xs mt-1 focus:outline-none transition-colors font-mono">
                            <div class="underline-cyan"></div>
                        </div>
                        <button onclick="window.submitRecoveryNewPassword()" class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-extrabold py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg hover:shadow-green-500/10 transition-all mt-2">
                            Update Account Password
                        </button>
                    </div>

                    <!-- Result screen for Fighter ID Recovery -->
                    <div class="space-y-3.5 hidden text-center" id="recovery-result-fighter">
                        <div class="p-4 bg-green-950/40 border border-green-900/60 rounded-2xl inline-block w-full text-left space-y-2">
                            <div class="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-wider">
                                <i class="ph ph-check-circle text-lg"></i> Fighter Profile Found
                            </div>
                            <div class="border-t border-green-900/40 pt-2">
                                <p class="text-[10px] text-gray-400 uppercase font-semibold">Fighter ID (Use for Login)</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <span id="recovered-fighter-id" class="text-white font-black text-xl tracking-wider font-mono">m-001</span>
                                    <button onclick="window.copyRecoveredFighterID()" class="p-1.5 bg-black/40 hover:bg-black/60 rounded border border-gray-850 text-indigo-400 hover:text-white transition-colors" title="Copy to clipboard">
                                        <i class="ph ph-copy text-sm"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="pt-1 text-[11px] text-gray-300 font-mono">
                                <p>Name: <span id="recovered-fighter-name" class="font-semibold text-white">Subham Das</span></p>
                                <p>Plan: <span id="recovered-fighter-plan" class="font-semibold text-white">Monthly Regular Track</span></p>
                            </div>
                        </div>
                        <button onclick="window.closeAuthRecovery()" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg hover:shadow-indigo-500/10 transition-all mt-4">
                            Proceed to Login
                        </button>
                    </div>

                    <button onclick="window.closeAuthRecovery()" class="w-full mt-2 bg-transparent text-gray-500 hover:text-white text-[11px] uppercase tracking-wider font-black py-2.5 transition-colors">
                        ← Back to Sign-in
                    </button>
                </div>

                <!-- ==================== REGISTRATION FORM CONTAINER ==================== -->
                <div id="register-form-container" class="space-y-4 hidden relative z-10">
                    
                    <!-- ADMIN REGISTER FIELDS -->
                    <div id="reg-fields-admin" class="space-y-3">
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Admin Full Name</label>
                            <input type="text" id="reg-admin-name" placeholder="Super Administrator" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none transition-colors">
                            <div class="underline-green"></div>
                        </div>
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Admin Phone (Unique ID)</label>
                            <input type="text" id="reg-admin-phone" placeholder="e.g. 9999999999" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none transition-colors font-mono">
                            <div class="underline-cyan"></div>
                        </div>
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Admin Email</label>
                            <input type="email" id="reg-admin-email" placeholder="admin@renew.com" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none transition-colors">
                            <div class="underline-green"></div>
                        </div>
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Admin Password</label>
                            <input type="password" id="reg-admin-pass" placeholder="••••••" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none transition-colors font-mono">
                            <div class="underline-cyan"></div>
                        </div>
                    </div>

                    <!-- TRAINER REGISTER FIELDS -->
                    <div id="reg-fields-trainer" class="space-y-3 hidden">
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Trainer Full Name</label>
                            <input type="text" id="reg-trainer-name" placeholder="Rajat Sharma" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none transition-colors">
                            <div class="underline-green"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Desired Trainer ID</label>
                                <input type="text" id="reg-trainer-id" placeholder="e.g. t3" readonly class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none font-mono cursor-not-allowed opacity-70">
                                <div class="underline-green"></div>
                            </div>
                            <div>
                                <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">WhatsApp Phone (Unique ID)</label>
                                <input type="text" id="reg-trainer-phone" placeholder="9876543212" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none font-mono">
                                <div class="underline-cyan"></div>
                            </div>
                        </div>
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Specialty / Expertise</label>
                            <input type="text" id="reg-trainer-spec" placeholder="e.g. MMA Striking & Conditioning" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none transition-colors">
                            <div class="underline-green"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Trainer Email</label>
                                <input type="email" id="reg-trainer-email" placeholder="trainer@renew.com" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none transition-colors">
                                <div class="underline-green"></div>
                            </div>
                            <div>
                                <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Password</label>
                                <input type="password" id="reg-trainer-pass" placeholder="••••••" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none font-mono">
                                <div class="underline-cyan"></div>
                            </div>
                        </div>
                    </div>

                    <!-- FIGHTER REGISTER FIELDS -->
                    <div id="reg-fields-fighter" class="space-y-3 hidden">
                        <div>
                            <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Fighter Full Name</label>
                            <input type="text" id="reg-fighter-name" placeholder="Subham Das" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none transition-colors">
                            <div class="underline-green"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Desired Fighter ID</label>
                                <input type="text" id="reg-fighter-id" placeholder="e.g. m-006" readonly class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none font-mono cursor-not-allowed opacity-70">
                                <div class="underline-green"></div>
                            </div>
                            <div>
                                <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">WhatsApp Phone (Unique ID)</label>
                                <input type="text" id="reg-fighter-phone" placeholder="+91 XXXXX XXXXX" class="w-full bg-black/50 border-0 rounded-t-xl px-4 py-2.5 text-white text-xs mt-1 focus:outline-none font-mono">
                                <div class="underline-cyan"></div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Date of Birth</label>
                                <input type="date" id="reg-fighter-dob" class="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2 text-white text-xs mt-1 focus:outline-none focus:border-indigo-500 transition-colors">
                            </div>
                            <div>
                                <label class="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Membership Plan</label>
                                <select id="reg-fighter-plan" class="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2 text-white text-xs mt-1 focus:outline-none focus:border-indigo-500 transition-colors font-mono">
                                    ${planOptions}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button onclick="window.submitAuthRegister()" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-lg hover:shadow-indigo-500/10 transition-all mt-6 flex justify-center items-center gap-1.5">
                        <i class="ph ph-plus-circle text-base animate-pulse"></i> Submit & Register Profile
                    </button>
                </div>

                <!-- GOOGLE OAUTH FUTURISTIC BTN -->
                <div class="mt-6 pt-5 border-t border-gray-800/80 relative z-10 flex flex-col items-center">
                    <button onclick="window.initGoogleAuthDemo()" class="w-full bg-black/30 border border-gray-850 hover:border-gray-700 text-gray-400 hover:text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-xs font-semibold group/google">
                        <svg class="w-4 h-4 group-hover/google:scale-110 transition-transform" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 0, 0)">
                                <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.05,3.1l3.2,2.48c1.87,-1.72 2.95,-4.26 2.95,-7.23C21.48,11.75 21.43,11.41 21.35,11.1z" fill="#4285F4"/>
                                <path d="M12,20.67c2.34,0 4.3,-0.78 5.73,-2.1l-3.2,-2.48c-0.89,0.6 -2.03,0.95 -3.53,0.95 -2.71,0 -5,-1.82 -5.82,-4.27L1.87,15.22C3.31,18.09 6.36,20.67 12,20.67z" fill="#34A853"/>
                                <path d="M6.18,12.78c-0.21,-0.6 -0.33,-1.24 -0.33,-1.9s0.12,-1.3 0.33,-1.9L2.83,6.38C2,8.04 1.5,9.88 1.5,11.88s0.5,3.84 1.33,5.5L6.18,12.78z" fill="#FBBC05"/>
                                <path d="M12,4.88c1.54,0 2.91,0.53 4,1.57l3,-3C17.15,1.72 14.84,1.08 12,1.08c-5.64,0 -8.69,2.58 -10.13,5.45l4.31,3.4C6.99,6.7 9.29,4.88 12,4.88z" fill="#EA4335"/>
                            </g>
                        </svg>
                        <span>Continue with Google</span>
                    </button>
                    <p class="text-[9px] text-gray-600 mt-2 font-mono uppercase tracking-widest">Database Sync Placeholder</p>
                </div>
            </div>
        </div>
    `;
}

// Automated ID Generation helpers
window.generateNextTrainerId = function() {
    const trainers = window.MOCK_TRAINERS || [];
    let maxNum = 0;
    trainers.forEach(t => {
        if (t.id && typeof t.id === 'string' && t.id.startsWith('t')) {
            const num = parseInt(t.id.substring(1), 10);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });
    return 't' + (maxNum + 1);
};

window.generateNextFighterId = function() {
    const members = window.MOCK_MEMBERS || [];
    let maxNum = 0;
    members.forEach(m => {
        if (m.id && typeof m.id === 'string') {
            let idStr = m.id;
            if (idStr.startsWith('m-')) {
                idStr = idStr.substring(2);
            } else if (idStr.startsWith('m')) {
                idStr = idStr.substring(1);
            }
            const num = parseInt(idStr, 10);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });
    const nextNum = maxNum + 1;
    return 'm-' + String(nextNum).padStart(3, '0');
};

// Global functions for state management
window.switchAuthMode = function(mode) {
    activeAuthMode = mode;
    
    // Hide recovery if open
    const recoveryForm = document.getElementById('recovery-form-container');
    if (recoveryForm) recoveryForm.classList.add('hidden');
    
    const modeSelector = document.getElementById('auth-mode-selector-container');
    if (modeSelector) modeSelector.classList.remove('hidden');
    
    const roleTabs = document.getElementById('auth-role-tabs-container');
    if (roleTabs) roleTabs.classList.remove('hidden');

    // Reset status box and bulb state
    const bulb = document.getElementById('bulb');
    if (bulb) bulb.className = 'bulb';
    const statusBox = document.getElementById('statusBox');
    if (statusBox) statusBox.classList.add('hidden');

    const loginBtn = document.getElementById('mode-login-btn');
    const registerBtn = document.getElementById('mode-register-btn');
    const loginForm = document.getElementById('login-form-container');
    const registerForm = document.getElementById('register-form-container');
    const subtitle = document.getElementById('auth-subtitle');

    if (mode === 'login') {
        if (loginBtn) loginBtn.className = "flex-1 text-center py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 bg-indigo-600 text-white shadow-md";
        if (registerBtn) registerBtn.className = "flex-1 text-center py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 text-gray-500 hover:text-white";
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
        if (subtitle) subtitle.textContent = "Roster Sign-in System";
    } else {
        if (loginBtn) loginBtn.className = "flex-1 text-center py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 text-gray-500 hover:text-white";
        if (registerBtn) registerBtn.className = "flex-1 text-center py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 bg-indigo-600 text-white shadow-md";
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
        if (subtitle) subtitle.textContent = "Membership Registration Roster";
    }
    
    window.updateAuthUI();
};

window.switchRoleTab = function(role) {
    activeRoleTab = role;
    
    // Hide recovery if open
    const recoveryForm = document.getElementById('recovery-form-container');
    if (recoveryForm) recoveryForm.classList.add('hidden');
    
    const modeSelector = document.getElementById('auth-mode-selector-container');
    if (modeSelector) modeSelector.classList.remove('hidden');
    
    const roleTabs = document.getElementById('auth-role-tabs-container');
    if (roleTabs) roleTabs.classList.remove('hidden');

    // Reset status box and bulb state
    const bulb = document.getElementById('bulb');
    if (bulb) bulb.className = 'bulb';
    const statusBox = document.getElementById('statusBox');
    if (statusBox) statusBox.classList.add('hidden');

    const adminBtn = document.getElementById('role-admin-btn');
    const trainerBtn = document.getElementById('role-trainer-btn');
    const fighterBtn = document.getElementById('role-fighter-btn');

    const tabs = [
        { key: 'admin', element: adminBtn },
        { key: 'trainer', element: trainerBtn },
        { key: 'fighter', element: fighterBtn }
    ];

    tabs.forEach(t => {
        if (t.element) {
            if (t.key === role) {
                t.element.className = "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-250 bg-white/5 border border-white/10 text-white shadow-inner";
            } else {
                t.element.className = "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-250 text-gray-500 hover:text-white";
            }
        }
    });

    window.updateAuthUI();
};

window.updateAuthUI = function() {
    const idLabel = document.getElementById('login-id-label');
    const idInput = document.getElementById('login-id-input');

    if (idLabel && idInput) {
        if (activeRoleTab === 'admin') {
            idLabel.textContent = "Admin Phone Number";
            idInput.placeholder = "e.g. 9999999999";
        } else if (activeRoleTab === 'trainer') {
            idLabel.textContent = "Trainer Phone Number";
            idInput.placeholder = "e.g. 9876543210";
        } else {
            idLabel.textContent = "Fighter Phone Number / ID";
            idInput.placeholder = "e.g. 9830011223 or m-001";
        }
    }

    const recoveryLink = document.getElementById('auth-recovery-link');
    if (recoveryLink) {
        if (activeRoleTab === 'fighter') {
            recoveryLink.textContent = "Forgot Fighter ID?";
        } else {
            recoveryLink.textContent = "Forgot Password?";
        }
    }

    // Toggle register fields containers
    const fieldsAdmin = document.getElementById('reg-fields-admin');
    const fieldsTrainer = document.getElementById('reg-fields-trainer');
    const fieldsFighter = document.getElementById('reg-fields-fighter');

    if (fieldsAdmin && fieldsTrainer && fieldsFighter) {
        fieldsAdmin.classList.add('hidden');
        fieldsTrainer.classList.add('hidden');
        fieldsFighter.classList.add('hidden');

        if (activeRoleTab === 'admin') {
            fieldsAdmin.classList.remove('hidden');
        } else if (activeRoleTab === 'trainer') {
            fieldsTrainer.classList.remove('hidden');
            const trainerIdInput = document.getElementById('reg-trainer-id');
            if (trainerIdInput) {
                trainerIdInput.value = window.generateNextTrainerId();
                trainerIdInput.readOnly = true;
                trainerIdInput.classList.add('cursor-not-allowed', 'opacity-70');
            }
        } else if (activeRoleTab === 'fighter') {
            fieldsFighter.classList.remove('hidden');
            const fighterIdInput = document.getElementById('reg-fighter-id');
            if (fighterIdInput) {
                fighterIdInput.value = window.generateNextFighterId();
                fighterIdInput.readOnly = true;
                fighterIdInput.classList.add('cursor-not-allowed', 'opacity-70');
            }
        }
    }
};

// Phone helper functions for robust matching
function cleanPhone(num) {
    return num ? num.replace(/[^0-9]/g, '') : '';
}

function phoneMatch(dbPhone, inputPhone) {
    if (!dbPhone || !inputPhone) return false;
    const cleanDb = cleanPhone(dbPhone);
    const cleanInput = cleanPhone(inputPhone);
    if (cleanDb.length >= 10 && cleanInput.length >= 10) {
        return cleanDb.slice(-10) === cleanInput.slice(-10);
    }
    return cleanDb === cleanInput;
}

// Terminal typing effect helper
function typeTerminalText(text, isError, callback) {
    const statusBox = document.getElementById('statusBox');
    const statusText = document.getElementById('statusText');
    if (!statusBox || !statusText) {
        if (callback) callback();
        return;
    }

    statusBox.classList.remove('hidden', 'error');
    if (isError) {
        statusBox.classList.add('error');
    }

    let i = 0;
    statusText.innerHTML = "";

    if (window.activeTypingInterval) {
        clearInterval(window.activeTypingInterval);
    }

    window.activeTypingInterval = setInterval(() => {
        if (i < text.length) {
            statusText.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(window.activeTypingInterval);
            window.activeTypingInterval = null;

            const cursor = document.createElement('span');
            cursor.classList.add('terminal-cursor');
            statusText.appendChild(cursor);

            if (callback) callback();
        }
    }, 40);
}

async function refreshAuthCache() {
    if (window.dbService && typeof window.dbService.bootstrapCaches === 'function') {
        try {
            await window.dbService.bootstrapCaches();
        } catch (e) {
            console.warn('Auth cache refresh failed:', e);
        }
    }

    return {
        admins: Array.isArray(window.ADMINS_LIST) ? window.ADMINS_LIST : [],
        trainers: Array.isArray(window.MOCK_TRAINERS) ? window.MOCK_TRAINERS : [],
        members: Array.isArray(window.MOCK_MEMBERS) ? window.MOCK_MEMBERS : []
    };
}

// LOGIN LOGIC WITH TERMINAL BULB FEEDBACK
window.submitAuthLogin = async function() {
    const inputId = document.getElementById('login-id-input').value.trim();
    const inputPass = document.getElementById('login-password-input').value.trim();

    const bulb = document.getElementById('bulb');
    if (bulb) bulb.className = 'bulb';

    if (!inputId) {
        if (bulb) bulb.classList.add('denied');
        typeTerminalText("ERROR: PHONE NUMBER / ID CANNOT BE BLANK.", true);
        return;
    }

    const authData = await refreshAuthCache();

    if (activeRoleTab === 'admin') {
        const admins = authData.admins || [];
        const adminUser = admins.find(a => {
            const idMatch = a && a.id && a.id.toLowerCase() === inputId.toLowerCase();
            const phoneMatchValue = phoneMatch(a.phone, inputId);
            const emailMatchValue = a && a.email && a.email.toLowerCase() === inputId.toLowerCase();
            return phoneMatchValue || idMatch || emailMatchValue;
        });
        
        if (!adminUser) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ACCESS DENIED: ADMIN PROFILE NOT REGISTERED.", true);
            return;
        }

        const storedPass = adminUser.password || 'admin';
        if (inputPass !== storedPass) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ACCESS DENIED: SECURE PIN IS INCORRECT.", true);
            return;
        }
        
        if (bulb) bulb.classList.add('granted');
        typeTerminalText("ACCESS GRANTED. DEPLOYING ADMIN SESSION...", false, () => {
            setTimeout(() => {
                localStorage.setItem('RENEW_LOGGED_IN_ROLE', 'admin');
                localStorage.setItem('RENEW_LOGGED_IN_USER_ID', adminUser.id || adminUser.phone);
                window.loggedInRole = 'admin';
                window.checkAuthAndNavigate();
            }, 1000);
        });
        
    } else if (activeRoleTab === 'trainer') {
        const trainers = authData.trainers || [];
        const matched = trainers.find(t => {
            const idMatch = t && t.id && t.id.toLowerCase() === inputId.toLowerCase();
            const phoneMatchValue = phoneMatch(t.phone, inputId);
            const emailMatchValue = t && t.email && t.email.toLowerCase() === inputId.toLowerCase();
            return phoneMatchValue || idMatch || emailMatchValue;
        });

        if (!matched) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ACCESS DENIED: COACH PHONE/ID NOT REGISTERED.", true);
            return;
        }

        if (matched.status === 'pending') {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ACCESS DEFERRED: APPROVAL STATUS IS PENDING.", true);
            return;
        }

        if (matched.status === 'blocked' || matched.status === 'suspended' || matched.status === 'inactive') {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText(`ACCESS DENIED: ACCOUNT STATUS IS ${matched.status.toUpperCase()}.`, true);
            return;
        }

        const storedPass = matched.password || 'password123';
        if (inputPass !== storedPass) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ACCESS DENIED: ACCOUNT PASSWORD INCORRECT.", true);
            return;
        }

        if (bulb) bulb.classList.add('granted');
        typeTerminalText(`ACCESS GRANTED. WELCOME COACH ${matched.name.toUpperCase()}...`, false, () => {
            setTimeout(() => {
                localStorage.setItem('RENEW_LOGGED_IN_ROLE', 'trainer');
                localStorage.setItem('RENEW_LOGGED_IN_USER_ID', matched.id);
                window.loggedInRole = 'trainer';
                window.loggedInTrainer = matched;
                window.checkAuthAndNavigate();
            }, 1000);
        });

    } else if (activeRoleTab === 'fighter') {
        const members = authData.members || [];
        const matched = members.find(m => {
            const idMatch = m && m.id && m.id.toLowerCase() === inputId.toLowerCase();
            const phoneMatchValue = phoneMatch(m.phone, inputId);
            return phoneMatchValue || idMatch;
        });

        if (!matched) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ACCESS DENIED: FIGHTER PROFILE NOT REGISTERED.", true);
            return;
        }

        if (bulb) bulb.classList.add('granted');
        typeTerminalText(`ACCESS GRANTED. LOADING ARENA STATS FOR ${matched.name.toUpperCase()}...`, false, () => {
            setTimeout(() => {
                localStorage.setItem('RENEW_LOGGED_IN_ROLE', 'fighter');
                localStorage.setItem('RENEW_LOGGED_IN_USER_ID', matched.id);
                window.loggedInRole = 'fighter';
                window.loggedInFighter = matched;
                window.checkAuthAndNavigate();
            }, 1000);
        });
    }
};

// REGISTRATION SIGNUP LOGIC
window.submitAuthRegister = async function() {
    const bulb = document.getElementById('bulb');
    if (bulb) bulb.className = 'bulb';

    if (activeRoleTab === 'admin') {
        const name = document.getElementById('reg-admin-name').value.trim();
        const phone = document.getElementById('reg-admin-phone').value.trim();
        const email = document.getElementById('reg-admin-email').value.trim();
        const pass = document.getElementById('reg-admin-pass').value.trim();

        if (!name || !phone || !email || !pass) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ERROR: PLEASE FILL IN ALL REGISTER FIELDS.", true);
            return;
        }

        await refreshAuthCache();

        // Check duplicate phone across all segments
        if ((window.ADMINS_LIST || []).some(a => phoneMatch(a.phone, phone)) ||
            (window.MOCK_TRAINERS || []).some(t => phoneMatch(t.phone, phone)) ||
            (window.MOCK_MEMBERS || []).some(m => phoneMatch(m.phone, phone))) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ERROR: PHONE IS ALREADY REGISTERED.", true);
            return;
        }

        const newAdmin = { id: phone, name, email, phone, password: pass };
        window.ADMINS_LIST = Array.isArray(window.ADMINS_LIST) ? [...window.ADMINS_LIST, newAdmin] : [newAdmin];

        try {
            if (window.dbService && typeof window.dbService.setDocument === 'function') {
                await window.dbService.setDocument('admins', newAdmin.id, newAdmin);
            }
            localStorage.setItem('RENEW_ADMINS_DB', JSON.stringify(window.ADMINS_LIST));
        } catch(e) {}

        if (bulb) bulb.classList.add('granted');
        typeTerminalText("SUCCESS: ADMIN REGISTERED. REDIRECTING...", false, () => {
            setTimeout(() => {
                window.switchAuthMode('login');
            }, 1200);
        });

    } else if (activeRoleTab === 'trainer') {
        const name = document.getElementById('reg-trainer-name').value.trim();
        const trainerId = document.getElementById('reg-trainer-id').value.trim();
        const phone = document.getElementById('reg-trainer-phone').value.trim();
        const specialty = document.getElementById('reg-trainer-spec').value.trim() || 'General Fitness';
        const email = document.getElementById('reg-trainer-email').value.trim();
        const pass = document.getElementById('reg-trainer-pass').value.trim();

        if (!name || !trainerId || !phone || !email || !pass) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ERROR: PLEASE FILL IN ALL REGISTER FIELDS.", true);
            return;
        }

        // Check duplicate phone across all segments
        if ((window.MOCK_TRAINERS || []).some(t => phoneMatch(t.phone, phone)) ||
            (window.ADMINS_LIST || []).some(a => phoneMatch(a.phone, phone)) ||
            (window.MOCK_MEMBERS || []).some(m => phoneMatch(m.phone, phone))) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ERROR: PHONE IS ALREADY REGISTERED.", true);
            return;
        }

        const newTrainer = {
            id: trainerId,
            name: name,
            photoUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150",
            email: email,
            phone: phone,
            password: pass,
            address: "Kolkata Hub",
            joiningDate: new Date().toISOString().slice(0, 10),
            dob: "1994-01-01",
            status: "active",
            assignedFighterIds: [],
            kpis: { totalAssigned: 0, retentionRate: 100, satisfaction: 5.0, attendanceRate: 100 },
            revenue: { ptSales: 0, dietPlanSales: 0, supplementSales: 0, totalRevenue: 0 },
            todayAttendance: { checkIn: "--:--", checkOut: null, workingHours: 0 },
            monthlyStats: { daysPresent: 0, lateArrivals: 0, absentDays: 0 }
        };

        window.MOCK_TRAINERS.push(newTrainer);
        
        try {
            localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(window.MOCK_TRAINERS));
        } catch(e) {}

        if (bulb) bulb.classList.add('granted');
        typeTerminalText("SUCCESS: TRAINER REGISTERED. REDIRECTING...", false, () => {
            setTimeout(() => {
                window.switchAuthMode('login');
            }, 1200);
        });

    } else if (activeRoleTab === 'fighter') {
        const name = document.getElementById('reg-fighter-name').value.trim();
        const fighterId = document.getElementById('reg-fighter-id').value.trim();
        const phone = document.getElementById('reg-fighter-phone').value.trim();
        const dob = document.getElementById('reg-fighter-dob').value.trim();
        const planSelect = document.getElementById('reg-fighter-plan');
        const planName = planSelect.value;
        const planFee = parseFloat(planSelect.options[planSelect.selectedIndex].getAttribute('data-fee')) || 1500;
        const ADMISSION_FEE = 1000;
        const totalDue = ADMISSION_FEE + planFee;

        if (!name || !fighterId || !phone || !dob) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ERROR: PLEASE FILL IN ALL REQUIRED FIELDS.", true);
            return;
        }

        // Check duplicate phone across all segments
        if ((window.MOCK_MEMBERS || []).some(m => phoneMatch(m.phone, phone)) ||
            (window.MOCK_TRAINERS || []).some(t => phoneMatch(t.phone, phone)) ||
            (window.ADMINS_LIST || []).some(a => phoneMatch(a.phone, phone))) {
            if (bulb) bulb.classList.add('denied');
            typeTerminalText("ERROR: PHONE IS ALREADY REGISTERED.", true);
            return;
        }

        const newFighter = {
            id: fighterId,
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

        window.MOCK_MEMBERS.push(newFighter);

        if (!window.MOCK_TRANSACTIONS) window.MOCK_TRANSACTIONS = [];
        
        window.MOCK_TRANSACTIONS.unshift({
            id: `TXN-${Date.now().toString().slice(-4)}-AD`,
            type: "income",
            category: "admission",
            amount: ADMISSION_FEE,
            date: new Date().toISOString().slice(0,10),
            status: "pending",
            description: `Admission Fee - ${name}`
        });

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

        try {
            localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
            localStorage.setItem('RENEW_TRANSACTIONS_DB', JSON.stringify(window.MOCK_TRANSACTIONS));
        } catch(e) {}

        if (bulb) bulb.classList.add('granted');
        typeTerminalText(`SUCCESS: REGISTRATION REGISTERED. TOTAL DUE: ₹${totalDue}...`, false, () => {
            setTimeout(() => {
                window.switchAuthMode('login');
            }, 1500);
        });
    }
};

// DEMO GOOGLE AUTH MESSAGE
window.initGoogleAuthDemo = function() {
    alert("🤖 Google Sign-in Triggered (Simulation):\n\n\"Sign in with Google\" will be fully operational in a future release once backend servers and Google Firebase Auth / Google Identity services are integrated.");
};

// ACCOUNT RECOVERY CONTROLLER & STATE
window.recoveryTargetUser = null;
window.recoveryTargetRole = null;

window.triggerAuthRecovery = function() {
    window.recoveryTargetUser = null;
    window.recoveryTargetRole = null;

    const bulb = document.getElementById('bulb');
    if (bulb) bulb.className = 'bulb';
    const statusBox = document.getElementById('statusBox');
    if (statusBox) statusBox.classList.add('hidden');

    // Hide Login inputs and Mode/Tab selectors
    const loginForm = document.getElementById('login-form-container');
    if (loginForm) loginForm.classList.add('hidden');
    
    const modeSelector = document.getElementById('auth-mode-selector-container');
    if (modeSelector) modeSelector.classList.add('hidden');
    
    const roleTabs = document.getElementById('auth-role-tabs-container');
    if (roleTabs) roleTabs.classList.add('hidden');

    // Show Recovery interface
    const recoveryForm = document.getElementById('recovery-form-container');
    if (recoveryForm) recoveryForm.classList.remove('hidden');

    // Clear Recovery Forms
    const step1 = document.getElementById('recovery-step-1');
    const step2 = document.getElementById('recovery-step-2');
    const step3 = document.getElementById('recovery-step-3');
    const fighterResult = document.getElementById('recovery-result-fighter');

    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.add('hidden');
    if (step3) step3.classList.add('hidden');
    if (fighterResult) fighterResult.classList.add('hidden');

    const phoneInput = document.getElementById('recovery-phone-input');
    const otpInput = document.getElementById('recovery-otp-input');
    const newPassInput = document.getElementById('recovery-new-pass');
    const confirmPassInput = document.getElementById('recovery-confirm-pass');

    if (phoneInput) phoneInput.value = '';
    if (otpInput) otpInput.value = '';
    if (newPassInput) newPassInput.value = '';
    if (confirmPassInput) confirmPassInput.value = '';

    // Update headings dynamically
    const recoveryTitle = document.getElementById('recovery-title');
    const recoverySubtitle = document.getElementById('recovery-subtitle');

    if (recoveryTitle && recoverySubtitle) {
        if (activeRoleTab === 'fighter') {
            recoveryTitle.textContent = "Fighter ID Recovery";
            recoverySubtitle.textContent = "Find your Fighter ID using registered phone";
        } else if (activeRoleTab === 'trainer') {
            recoveryTitle.textContent = "Trainer PIN Reset";
            recoverySubtitle.textContent = "Recover account password using registered phone";
        } else {
            recoveryTitle.textContent = "Admin PIN Reset";
            recoverySubtitle.textContent = "Recover account password using registered phone";
        }
    }
};

window.closeAuthRecovery = function() {
    const bulb = document.getElementById('bulb');
    if (bulb) bulb.className = 'bulb';
    const statusBox = document.getElementById('statusBox');
    if (statusBox) statusBox.classList.add('hidden');

    const recoveryForm = document.getElementById('recovery-form-container');
    if (recoveryForm) recoveryForm.classList.add('hidden');

    const modeSelector = document.getElementById('auth-mode-selector-container');
    if (modeSelector) modeSelector.classList.remove('hidden');
    
    const roleTabs = document.getElementById('auth-role-tabs-container');
    if (roleTabs) roleTabs.classList.remove('hidden');

    const loginForm = document.getElementById('login-form-container');
    if (loginForm) loginForm.classList.remove('hidden');

    window.updateAuthUI();
};

window.submitRecoveryPhone = function() {
    const phoneInput = document.getElementById('recovery-phone-input').value.trim();
    const bulb = document.getElementById('bulb');
    if (bulb) bulb.className = 'bulb';

    if (!phoneInput) {
        if (bulb) bulb.classList.add('denied');
        typeTerminalText("ERROR: PHONE NUMBER FIELD CANNOT BE BLANK.", true);
        return;
    }

    let matched = null;
    if (activeRoleTab === 'admin') {
        const admins = window.ADMINS_LIST || [];
        matched = admins.find(a => phoneMatch(a.phone, phoneInput));
    } else if (activeRoleTab === 'trainer') {
        const trainers = window.MOCK_TRAINERS || [];
        matched = trainers.find(t => phoneMatch(t.phone, phoneInput));
    } else if (activeRoleTab === 'fighter') {
        const members = window.MOCK_MEMBERS || [];
        matched = members.find(m => phoneMatch(m.phone, phoneInput));
    }

    if (!matched) {
        if (bulb) bulb.classList.add('denied');
        typeTerminalText("RECOVERY DENIED: PHONE NUMBER NOT FOUND.", true);
        return;
    }

    window.recoveryTargetUser = matched;
    window.recoveryTargetRole = activeRoleTab;

    if (bulb) bulb.classList.add('granted');
    
    if (activeRoleTab === 'fighter') {
        typeTerminalText("MATCH FOUND: RETRIEVING FIGHTER PROFILE...", false, () => {
            setTimeout(() => {
                const step1 = document.getElementById('recovery-step-1');
                const fighterResult = document.getElementById('recovery-result-fighter');
                const recoveredId = document.getElementById('recovered-fighter-id');
                const recoveredName = document.getElementById('recovered-fighter-name');
                const recoveredPlan = document.getElementById('recovered-fighter-plan');

                if (recoveredId) recoveredId.textContent = matched.id;
                if (recoveredName) recoveredName.textContent = matched.name;
                if (recoveredPlan) recoveredPlan.textContent = matched.plan;

                if (step1) step1.classList.add('hidden');
                if (fighterResult) fighterResult.classList.remove('hidden');
                if (bulb) bulb.className = 'bulb';
                const statusBox = document.getElementById('statusBox');
                if (statusBox) statusBox.classList.add('hidden');
            }, 800);
        });
    } else {
        typeTerminalText("MATCH FOUND: GENERATING SIMULATED SECURITY OTP...", false, () => {
            setTimeout(() => {
                const step1 = document.getElementById('recovery-step-1');
                const step2 = document.getElementById('recovery-step-2');
                if (step1) step1.classList.add('hidden');
                if (step2) step2.classList.remove('hidden');
                if (bulb) bulb.className = 'bulb';
                const statusBox = document.getElementById('statusBox');
                if (statusBox) statusBox.classList.add('hidden');
            }, 800);
        });
    }
};

window.submitRecoveryOTP = function() {
    const otpVal = document.getElementById('recovery-otp-input').value.trim();
    const bulb = document.getElementById('bulb');
    if (bulb) bulb.className = 'bulb';

    if (otpVal !== '123456') {
        if (bulb) bulb.classList.add('denied');
        typeTerminalText("VERIFICATION DENIED: INVALID OTP SECURITY CODE.", true);
        return;
    }

    if (bulb) bulb.classList.add('granted');
    typeTerminalText("OTP SECURELY VERIFIED. PROCEEDING TO RESET...", false, () => {
        setTimeout(() => {
            const step2 = document.getElementById('recovery-step-2');
            const step3 = document.getElementById('recovery-step-3');
            if (step2) step2.classList.add('hidden');
            if (step3) step3.classList.remove('hidden');
            if (bulb) bulb.className = 'bulb';
            const statusBox = document.getElementById('statusBox');
            if (statusBox) statusBox.classList.add('hidden');
        }, 800);
    });
};

window.submitRecoveryNewPassword = function() {
    const newPass = document.getElementById('recovery-new-pass').value.trim();
    const confirmPass = document.getElementById('recovery-confirm-pass').value.trim();
    const bulb = document.getElementById('bulb');
    if (bulb) bulb.className = 'bulb';

    if (!newPass || !confirmPass) {
        if (bulb) bulb.classList.add('denied');
        typeTerminalText("ERROR: PASSWORD INPUTS CANNOT BE BLANK.", true);
        return;
    }

    if (newPass !== confirmPass) {
        if (bulb) bulb.classList.add('denied');
        typeTerminalText("ERROR: PASSWORDS DO NOT MATCH.", true);
        return;
    }

    if (window.recoveryTargetUser) {
        window.recoveryTargetUser.password = newPass;

        if (window.recoveryTargetRole === 'admin') {
            try {
                localStorage.setItem('RENEW_ADMINS_DB', JSON.stringify(window.ADMINS_LIST));
            } catch(e) {}
        } else if (window.recoveryTargetRole === 'trainer') {
            try {
                localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(window.MOCK_TRAINERS));
            } catch(e) {}
        }

        if (bulb) bulb.classList.add('granted');
        typeTerminalText("SUCCESS: PASSWORD SECURELY UPDATED. REDIRECTING...", false, () => {
            setTimeout(() => {
                window.closeAuthRecovery();
            }, 1200);
        });
    } else {
        if (bulb) bulb.classList.add('denied');
        typeTerminalText("ERROR: ACCREDITATION TARGET CONTEXT LOST.", true);
        setTimeout(() => {
            window.closeAuthRecovery();
        }, 1200);
    }
};

window.copyRecoveredFighterID = function() {
    const recoveredId = document.getElementById('recovered-fighter-id');
    if (recoveredId) {
        navigator.clipboard.writeText(recoveredId.textContent).then(() => {
            alert("📋 Fighter ID copied to clipboard!");
        }).catch(err => {
            alert("Could not copy ID automatically. Please select it manually.");
        });
    }
};
