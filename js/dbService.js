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
                const [admins, members, trainers, transactions, inventory, orders, attendance, events, broadcasts, leads] = await Promise.all([
                    this.getCollection(COLLECTIONS.admins, 'updatedAt'),
                    this.getCollection(COLLECTIONS.members, 'updatedAt'),
                    this.getCollection(COLLECTIONS.trainers, 'updatedAt'),
                    this.getCollection(COLLECTIONS.transactions, 'updatedAt'),
                    this.getCollection(COLLECTIONS.inventory, 'updatedAt'),
                    this.getCollection(COLLECTIONS.orders, 'updatedAt'),
                    this.getCollection(COLLECTIONS.attendance, 'updatedAt'),
                    this.getCollection(COLLECTIONS.events, 'updatedAt'),
                    this.getCollection(COLLECTIONS.broadcasts, 'updatedAt'),
                    this.getCollection(COLLECTIONS.leads, 'updatedAt')
                ]);

                const isFirstBoot = members.length === 0 && trainers.length === 0;
                if (isFirstBoot) {
                    console.log('[dbService] First boot — auto-seeding Firestore from local data...');
                    await this._autoSeedInitialData();
                    const [m2, t2, tx2, inv2, l2, att2] = await Promise.all([
                        this.getCollection(COLLECTIONS.members, 'updatedAt'),
                        this.getCollection(COLLECTIONS.trainers, 'updatedAt'),
                        this.getCollection(COLLECTIONS.transactions, 'updatedAt'),
                        this.getCollection(COLLECTIONS.inventory, 'updatedAt'),
                        this.getCollection(COLLECTIONS.leads, 'updatedAt'),
                        this.getCollection(COLLECTIONS.attendance, 'updatedAt'),
                    ]);
                    if (m2.length > 0)   window.MOCK_MEMBERS           = m2;
                    if (t2.length > 0)   window.MOCK_TRAINERS          = t2;
                    if (tx2.length > 0)  window.MOCK_TRANSACTIONS      = tx2;
                    if (inv2.length > 0) window.MOCK_INVENTORY         = inv2;
                    if (l2.length > 0)   window.MOCK_LEADS             = l2;
                    if (att2.length > 0) {
                        window.MEMBER_ATTENDANCE_LOGS = att2.filter(a => a.logType === 'member');
                        window.TRAINER_ATTENDANCE_LOGS = att2.filter(a => a.logType === 'trainer');
                    }
                    console.log('[dbService] Auto-seed complete.');
                    return true;
                }

                if (admins.length > 0)       window.ADMINS_LIST            = admins;
                if (members.length > 0)      window.MOCK_MEMBERS           = members;
                if (trainers.length > 0)     window.MOCK_TRAINERS          = trainers;
                if (transactions.length > 0) window.MOCK_TRANSACTIONS      = transactions;
                if (inventory.length > 0)    window.MOCK_INVENTORY         = inventory;
                if (orders.length > 0)       window.FIGHTER_PRODUCT_ORDERS = orders;
                if (attendance.length > 0) {
                    window.MEMBER_ATTENDANCE_LOGS = attendance.filter(a => a.logType === 'member');
                    window.TRAINER_ATTENDANCE_LOGS = attendance.filter(a => a.logType === 'trainer');
                }
                if (events.length > 0)       window.GYM_EVENTS             = events;
                if (broadcasts.length > 0)   window.GYM_BROADCASTS         = broadcasts;
                if (leads.length > 0)        window.MOCK_LEADS             = leads;

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
                .catch(function (error) {
                    console.warn('Firebase bootstrap error:', error);
                });
        }
    });
})();
