// import { ref, onValue, set, push, remove } from 'firebase/database';
// import { db } from './firebase';

// // Name of receipt collection in Realtime Database
// const RECEIPT_COLLECTION = 'receipts';
// const BUDGET_COLLECTION = 'budgets';

// export function addReceipt(uid, date, locationName, item, amount, category) {
//     push(ref(db, RECEIPT_COLLECTION), { uid, date, locationName, item, amount, category });
// }

// // Adds a new budget document to Realtime Database
// export async function addBudget(uid, name, category, amount) {
//     push(ref(db, BUDGET_COLLECTION), { uid, name, category, amount, balance: amount });
// }

// export async function getReceipts(uid, setReceipts, setIsLoadingReceipts) {
//     const receiptsRef = ref(db, RECEIPT_COLLECTION);
//     const receiptsQuery = orderByChild(receiptsRef, "uid").equalTo(uid);

//     const unsubscribe = onValue(receiptsQuery, async (snapshot) => {
//         let allReceipts = [];
//         snapshot.forEach((childSnapshot) => {
//             const receipt = childSnapshot.val();
//             allReceipts.push({
//                 ...receipt,
//                 date: new Date(receipt.date),
//                 id: childSnapshot.key,
//             });
//         });
//         setReceipts(allReceipts);
//         setIsLoadingReceipts(false);
//     })
//     return unsubscribe;
// }

// export function getBudgets(uid, setBudgets, setIsLoadingBudgets) {
//     const budgetsRef = ref(db, BUDGET_COLLECTION);
//     const budgetsQuery = orderByChild(budgetsRef, "uid").equalTo(uid);

//     const unsubscribe = onValue(budgetsQuery, async (snapshot) => {
//         let allBudgets = [];
//         snapshot.forEach((childSnapshot) => {
//             const budget = childSnapshot.val();
//             allBudgets.push({
//                 ...budget,
//                 id: childSnapshot.key,
//             });
//         });
//         setBudgets(allBudgets);
//         setIsLoadingBudgets(false);
//     });

//     return unsubscribe;
// }

// // Updates receipt with @docId with given information.
// export function updateReceipt(docId, uid, date, locationName, item, amount, category) {
//     set(ref(db, `${ RECEIPT_COLLECTION }/${ docId }`), { uid, date, locationName, item, amount, category });
// }

// // Updates an existing budget document in Realtime Database
// export async function updateBudget(id, name, category, amount, balance) {
//     set(ref(db, `${ BUDGET_COLLECTION }/${ id }`), { name, category, amount, balance });
// }

// // Deletes receipt with given @id.
// export function deleteReceipt(id) {
//     remove(ref(db, `${ RECEIPT_COLLECTION }/${ id }`));
// }
