// ট্রেইনার রেজিস্ট্রেশন ভিউ
function getTrainerSignupView() {
    return `
        <div class="max-w-md mx-auto bg-darkSurface border border-gray-800 p-8 rounded-2xl shadow-2xl">
            <h2 class="text-white font-black text-xl mb-1">Trainer Registration</h2>
            <p class="text-gray-500 text-xs mb-6">Join R.E.N.E.W Portal</p>
            <div class="space-y-4">
                <input type="text" id="trainer-name" placeholder="Full Name" class="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white outline-none">
                <input type="text" id="trainer-email" placeholder="Email/Phone" class="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white outline-none">
                <input type="password" id="trainer-pass" placeholder="Create Password" class="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white outline-none">
                <button onclick="window.submitTrainerSignup()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg">Submit for Approval</button>
            </div>
        </div>
    `;
}

window.submitTrainerSignup = function() {
    const name = document.getElementById('trainer-name').value.trim();
    const email = document.getElementById('trainer-email').value.trim();
    
    if (!name || !email) {
        alert("Please fill in both Name and Email!");
        return;
    }

    const newPending = {
        id: `req-${Date.now().toString().slice(-4)}`,
        name: name,
        email: email,
        phone: "",
        specialty: "General",
        experience: "Self Registered"
    };
    
    if (typeof window.PENDING_TRAINERS === 'undefined') {
        window.PENDING_TRAINERS = [];
    }
    window.PENDING_TRAINERS.push(newPending);
    
    alert("✅ Registration Submitted! Admin approval pending.");
};