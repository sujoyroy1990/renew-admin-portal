// js/firebaseConfig.js
(function () {
    const fallbackConfig = {
        apiKey: 'AIzaSyCx2L4RCVNdUl16R6VAoANf3yw2ootYtwQ',
        authDomain: 'renew-admin-portal.firebaseapp.com',
        projectId: 'renew-admin-portal',
        storageBucket: 'renew-admin-portal.firebasestorage.app',
        messagingSenderId: '1053019621225',
        appId: '1:1053019621225:web:48a754c9ea722a2ab05ff8',
        measurementId: 'G-CX0YEMP5PB'
    };

    const envConfig = (window.__ENV__ && window.__ENV__.FIREBASE) || window.__FIREBASE_CONFIG__ || {};
    const firebaseConfig = {
        apiKey: envConfig.apiKey || fallbackConfig.apiKey,
        authDomain: envConfig.authDomain || fallbackConfig.authDomain,
        projectId: envConfig.projectId || fallbackConfig.projectId,
        storageBucket: envConfig.storageBucket || fallbackConfig.storageBucket,
        messagingSenderId: envConfig.messagingSenderId || fallbackConfig.messagingSenderId,
        appId: envConfig.appId || fallbackConfig.appId,
        measurementId: envConfig.measurementId || fallbackConfig.measurementId
    };

    window.__FIREBASE_CONFIG__ = firebaseConfig;

    if (window.firebase && !window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
    }
})();
