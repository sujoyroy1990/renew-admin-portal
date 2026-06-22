// js/dbService.js
(function () {
    const COLLECTIONS = {
        admins: 'admins',
        members: 'members',
        trainers: 'trainers',
        transactions: 'transactions',
        inventory: 'inventory',
        orders: 'orders',
        attendance: 'attendance',
        events: 'events',
        broadcasts: 'broadcasts',
        leads: 'leads'
    };

    function toDoc(record) {
        if (!record) return null;
        return {
            id: record.id || record.docId || '',
            ...record.data ? record.data() : record
        };
    }

    function makeTimestamp() {
        return window.firebase && window.firebase.firestore
            ? window.firebase.firestore.FieldValue.serverTimestamp()
            : new Date();
    }

    const dbService = {
        COLLECTIONS,
        isReady() {
            return !!(window.firebase && window.firebase.apps && window.firebase.apps.length && window.firebase.firestore);
        },
        init() {
            if (!this.isReady()) {
                return Promise.reject(new Error('Firebase is not initialized yet.'));
            }
            if (!this.db) {
                this.db = window.firebase.firestore();
            }
            return Promise.resolve(this.db);
        },
        async getCollection(name, orderByField) {
            await this.init();
            let query = this.db.collection(name);
            if (orderByField) {
                query = query.orderBy(orderByField, 'desc');
            }
            const snapshot = await query.get();
            return snapshot.docs.map(toDoc);
        },
        async getDocument(name, id) {
            await this.init();
            const doc = await this.db.collection(name).doc(id).get();
            return doc.exists ? toDoc(doc) : null;
        },
        async addDocument(name, payload, ownerId) {
            await this.init();
            const data = {
                ...payload,
                ...(ownerId ? { ownerId } : {}),
                createdAt: makeTimestamp(),
                updatedAt: makeTimestamp()
            };
            const ref = await this.db.collection(name).add(data);
            return { id: ref.id, ...data };
        },
        async setDocument(name, id, payload) {
            await this.init();
            await this.db.collection(name).doc(id).set({
                ...payload,
                updatedAt: makeTimestamp()
            }, { merge: true });
            return { id, ...payload };
        },
        async updateDocument(name, id, payload) {
            await this.init();
            await this.db.collection(name).doc(id).update({
                ...payload,
                updatedAt: makeTimestamp()
            });
            return { id, ...payload };
        },
        async deleteDocument(name, id) {
            await this.init();
            await this.db.collection(name).doc(id).delete();
            return true;
        },
        async queryCollection(name, field, operator, value) {
            await this.init();
            const snapshot = await this.db.collection(name).where(field, operator, value).get();
            return snapshot.docs.map(toDoc);
        },
        async bootstrapCaches() {
            if (!this.isReady()) {
                return false;
            }
            try {
                const [admins, members, trainers, transactions, inventory, orders, attendance, events, broadcasts, leads, statusDoc, plansDoc, feesDoc] = await Promise.all([
                    this.getCollection(COLLECTIONS.admins, 'updatedAt'),
                    this.getCollection(COLLECTIONS.members, 'updatedAt'),
                    this.getCollection(COLLECTIONS.trainers, 'updatedAt'),
                    this.getCollection(COLLECTIONS.transactions, 'updatedAt'),
                    this.getCollection(COLLECTIONS.inventory, 'updatedAt'),
                    this.getCollection(COLLECTIONS.orders, 'updatedAt'),
                    this.getCollection(COLLECTIONS.attendance, 'updatedAt'),
                    this.getCollection(COLLECTIONS.events, 'updatedAt'),
                    this.getCollection(COLLECTIONS.broadcasts, 'updatedAt'),
                    this.getCollection(COLLECTIONS.leads, 'updatedAt'),
                    this.getDocument('config', 'status'),
                    this.getDocument('config', 'gym_plans'),
                    this.getDocument('config', 'gym_fees')
                ]);



                if (admins && admins.length > 0) window.ADMINS_LIST = admins;
                window.MOCK_MEMBERS           = members || [];
                window.MOCK_TRAINERS          = trainers || [];
                window.MOCK_TRANSACTIONS      = transactions || [];
                window.MOCK_INVENTORY         = inventory || [];
                window.FIGHTER_PRODUCT_ORDERS = orders || [];
                window.MEMBER_ATTENDANCE_LOGS = attendance ? attendance.filter(a => a.logType === 'member') : [];
                window.TRAINER_ATTENDANCE_LOGS = attendance ? attendance.filter(a => a.logType === 'trainer') : [];
                window.GYM_EVENTS             = events || [];
                window.GYM_BROADCASTS         = broadcasts || [];
                window.MOCK_LEADS             = leads || [];
                if (plansDoc && plansDoc.plans) {
                    window.GYM_PLANS = plansDoc.plans;
                } else {
                    const defaultPlans = [
                        { id: "PLN-1", name: "Monthly Regular Track", fee: 1500, duration: 30 },
                        { id: "PLN-2", name: "Fighter Half - Quarterly Track", fee: 2500, duration: 90 },
                        { id: "PLN-3", name: "Fighter Quarterly Track", fee: 7000, duration: 180 },
                        { id: "PLN-4", name: "Elite Annual Pack", fee: 15000, duration: 365 }
                    ];
                    window.GYM_PLANS = defaultPlans;
                    this.setDocument('config', 'gym_plans', { plans: defaultPlans })
                        .then(() => console.log('[dbService] Initialized default gym_plans in Firestore'))
                        .catch(e => console.error('[dbService] Failed to initialize gym_plans:', e));
                }

                if (feesDoc && feesDoc.fees) {
                    window.GYM_FEES = feesDoc.fees;
                } else {
                    const defaultFees = { 
                        "admissionFee": 1000,
                        "membership fee": 2500, 
                        "PT": 15000, 
                        "diet plan": 2000, 
                        "supplement": 3500, 
                        "Events booking": 4500, 
                        "other": 1000 
                    };
                    window.GYM_FEES = defaultFees;
                    this.setDocument('config', 'gym_fees', { fees: defaultFees })
                        .then(() => console.log('[dbService] Initialized default gym_fees in Firestore'))
                        .catch(e => console.error('[dbService] Failed to initialize gym_fees:', e));
                }

                // Sync Firestore state to LocalStorage to avoid flashing old offline data on load
                try {
                    localStorage.setItem('MOCK_MEMBERS_DB', JSON.stringify(window.MOCK_MEMBERS));
                    localStorage.setItem('RENEW_TRAINERS_DB', JSON.stringify(window.MOCK_TRAINERS));
                    localStorage.setItem('RENEW_TRANSACTIONS_DB', JSON.stringify(window.MOCK_TRANSACTIONS));
                    localStorage.setItem('FIGHTER_ORDERS_DB', JSON.stringify(window.FIGHTER_PRODUCT_ORDERS));
                    localStorage.setItem('RENEW_MEMBER_ATTENDANCE_DB', JSON.stringify(window.MEMBER_ATTENDANCE_LOGS));
                    localStorage.setItem('RENEW_TRAINER_ATTENDANCE_DB', JSON.stringify(window.TRAINER_ATTENDANCE_LOGS));
                    localStorage.setItem('MOCK_LEADS_DB', JSON.stringify(window.MOCK_LEADS));
                    localStorage.setItem('MOCK_INVENTORY_DB', JSON.stringify(window.MOCK_INVENTORY));
                    localStorage.setItem('GYM_EVENTS_DB', JSON.stringify(window.GYM_EVENTS));
                    if (window.GYM_PLANS) localStorage.setItem('GYM_PLANS_DB', JSON.stringify(window.GYM_PLANS));
                    if (window.GYM_FEES) localStorage.setItem('GYM_FEES_DB', JSON.stringify(window.GYM_FEES));
                } catch (e) {
                    console.warn('[dbService] LocalStorage sync failed:', e);
                }

                window.__FIRESTORE_CACHE = { admins, members, trainers, transactions, inventory, orders, attendance, events, broadcasts, leads };
                return true;
            } catch (error) {
                console.warn('Firestore bootstrap failed, falling back to existing runtime data.', error);
                return false;
            }
        },

        async _autoSeedInitialData() {
            const safeSet = async (col, id, data) => {
                try {
                    const cleaned = JSON.parse(JSON.stringify(data, (k, v) => v === undefined ? null : v));
                    await this.setDocument(col, id, cleaned);
                } catch(e) {
                    console.error('[autoSeed] ' + col + '/' + id + ':', e.message);
                }
            };
            for (const a of (window.ADMINS_LIST || [])) {
                const { password, ...safe } = a; if (safe.id) await safeSet('admins', safe.id, safe);
            }
            for (const m of (window.MOCK_MEMBERS || [])) {
                if (m.id) await safeSet('members', m.id, m);
            }
            for (const t of (window.MOCK_TRAINERS || [])) {
                const { password, ...safe } = t; if (safe.id) await safeSet('trainers', safe.id, safe);
            }
            for (const tx of (window.MOCK_TRANSACTIONS || [])) {
                if (tx.id) await safeSet('transactions', tx.id, tx);
            }
            for (const item of (window.MOCK_INVENTORY || [])) {
                if (item.id) await safeSet('inventory', item.id, item);
            }
            for (const lead of (window.MOCK_LEADS || [])) {
                if (lead.id) await safeSet('leads', lead.id, lead);
            }
            const mAtt = window.MEMBER_ATTENDANCE_LOGS || [];
            for (let i = 0; i < mAtt.length; i++) {
                const log = mAtt[i];
                await safeSet('attendance', log.id || ('att-m-' + (log.memberId || i) + '-' + i), { ...log, logType: 'member' });
            }
            const tAtt = window.TRAINER_ATTENDANCE_LOGS || [];
            for (let i = 0; i < tAtt.length; i++) {
                const log = tAtt[i];
                await safeSet('attendance', log.id || ('att-t-' + (log.trainerId || i) + '-' + i), { ...log, logType: 'trainer' });
            }
            if (window.GYM_PLANS) await safeSet('config', 'gym_plans', { plans: window.GYM_PLANS });
            if (window.GYM_FEES)  await safeSet('config', 'gym_fees',  { fees: window.GYM_FEES });
            await safeSet('config', 'status', { seeded: true, updatedAt: new Date().toISOString() });
        },
        async syncCollectionToWindow(name, docs) {
            if (name === 'attendance') {
                window.MEMBER_ATTENDANCE_LOGS = docs.filter(a => a.logType === 'member');
                window.TRAINER_ATTENDANCE_LOGS = docs.filter(a => a.logType === 'trainer');
                return;
            }
            const map = {
                admins: 'ADMINS_LIST',
                members: 'MOCK_MEMBERS',
                trainers: 'MOCK_TRAINERS',
                transactions: 'MOCK_TRANSACTIONS',
                inventory: 'MOCK_INVENTORY',
                orders: 'FIGHTER_PRODUCT_ORDERS',
                events: 'GYM_EVENTS',
                broadcasts: 'GYM_BROADCASTS',
                leads: 'MOCK_LEADS'
            };
            if (map[name]) {
                window[map[name]] = docs;
            }
        }
    };

    window.dbService = dbService;

    window.addEventListener('load', function () {
        if (window.dbService && window.dbService.init) {
            window.dbService.init()
                .then(function () {
                    return window.dbService.bootstrapCaches();
                })
                .then(function () {
                    console.log('[dbService] Bootstrap complete, refreshing view...');
                    if (typeof window.checkAuthAndNavigate === 'function') {
                        window.checkAuthAndNavigate();
                    }
                })
                .catch(function (error) {
                    console.warn('Firebase bootstrap error:', error);
                });
        }
    });
})();
