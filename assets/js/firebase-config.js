// ໃສ່ຄ່າຈາກ Firebase Console > Project settings > Your apps > Web app
// ໃຊ້ຄ່າຊຸດດຽວກັນກັບເວັບຫຼັງບ້ານ (backoffice) ເພື່ອໃຫ້ໃຊ້ຖານຂໍ້ມູນດຽວກັນ
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAk3AapnGbC28F36gsnUbSqpRvdeKb8Eto",
  authDomain: "laotect.firebaseapp.com",
  projectId: "laotect",
  appId: "1:206015345141:web:2fc475c26af5d99980f0bc"
};
export const configured = firebaseConfig.apiKey !== "YOUR_API_KEY";
export const db = configured ? getFirestore(initializeApp(firebaseConfig)) : null;
