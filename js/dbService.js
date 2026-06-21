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

                window.ADMINS_LIST = admins;
                window.MOCK_MEMBERS = members;
                window.MOCK_TRAINERS = trainers;
                window.MOCK_TRANSACTIONS = transactions;
                window.MOCK_INVENTORY = inventory;
                window.FIGHTER_PRODUCT_ORDERS = orders;
                window.MEMBER_ATTENDANCE_LOGS = attendance;
                window.GYM_EVENTS = events;
                window.GYM_BROADCASTS = broadcasts;
                window.MOCK_LEADS = leads;
                window.__FIRESTORE_CACHE = {
                    admins,
                    members,
                    trainers,
                    transactions,
                    inventory,
                    orders,
                    attendance,
                    events,
                    broadcasts,
                    leads
                };
                return true;
            } catch (error) {
                console.warn('Firestore bootstrap failed, falling back to existing runtime data.', error);
                return false;
            }
        },
        async syncCollectionToWindow(name, docs) {
            const map = {
                admins: 'ADMINS_LIST',
                members: 'MOCK_MEMBERS',
                trainers: 'MOCK_TRAINERS',
                transactions: 'MOCK_TRANSACTIONS',
                inventory: 'MOCK_INVENTORY',
                orders: 'FIGHTER_PRODUCT_ORDERS',
                attendance: 'MEMBER_ATTENDANCE_LOGS',
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
