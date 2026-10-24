// ໜ້າຮ້ານ: ຮັບສິນຄ້າແບບ realtime ແລະ ສົ່ງອໍເດີ (ຫັກສະຕັອກ) ໄປ Firestore
import { db, configured } from "./firebase-config.js";
import { collection, onSnapshot, doc, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const clean = (v) => Array.isArray(v) ? v.map(clean) : (v && Object.getPrototypeOf(v) === Object.prototype) ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, clean(x)])) : v; // Firestore ບໍ່ຮັບຄ່າ undefined
if (configured) {
  // ຮັບ: ສິນຄ້າປ່ຽນໃນ Firestore ໜ້າເວັບອັບເດດທັນທີ
  onSnapshot(collection(db, "products"), function (snap) {
    P.length = 0;
    snap.forEach(function (d) {
      const x = d.data(); if (x.hidden) return; const id = Number(x.id) || P.length + 1;
      K[id] = x.type || "l";
      P.push({ id: id, doc: d.id, c: x.category, b: x.brand, n: x.name, p: Number(x.price), s: Number(x.stock),
               old: Number(x.oldPrice) || 0, img: x.images || [], desc: x.description || "", war: x.warranty || "", cond: x.condition || "new", sp: (x.specs || []).map(function (s) { return [s.k, s.v]; }) });
    });
    Object.keys(cart).forEach(function (id) {
      const p = P.find(function (x) { return x.id == id; });
      if (!p || p.s < 1) delete cart[id]; else if (cart[id] > p.s) cart[id] = p.s;
    });
    chips(); draw(); upd();
    if (!window._hashDone) { window._hashDone = true; openFromHash(); }
  }, function (e) { console.error("products", e); });

  // ຮັບ: ຂໍ້ມູນຮ້ານ (ເບີ WhatsApp, ທີ່ຢູ່, ເວລາເປີດ, Facebook) ທີ່ແກ້ໃນໜ້າ admin
  onSnapshot(doc(db, "settings", "shop"), function (snap) { if (snap.exists()) applyShop(snap.data()); }, function (e) { console.error("settings", e); });

  // ເກັບ + ສົ່ງ: ບັນທຶກອໍເດີ ແລະ ຫັກສະຕັອກໃນຄັ້ງດຽວ (ຖ້າສະຕັອກບໍ່ພໍ ຈະບໍ່ບັນທຶກ)
  window.saveOrder = function (o) {
    return runTransaction(db, async function (tx) {
      const refs = o.items.map(function (i) {
        const p = P.find(function (x) { return x.id == i.id; });
        if (!p || !p.doc) throw new Error("ບໍ່ພົບສິນຄ້າໃນລະບົບ");
        return doc(db, "products", p.doc);
      });
      const snaps = [];
      for (const r of refs) snaps.push(await tx.get(r));
      snaps.forEach(function (s, k) {
        const left = s.data().stock - o.items[k].qty;
        if (left < 0) throw new Error(o.items[k].name + " ເຫຼືອບໍ່ພໍ");
        tx.update(refs[k], { stock: left });
      });
      tx.set(doc(collection(db, "orders")), clean(Object.assign({}, o, { status: "new", createdAt: serverTimestamp() })));
    });
  };
}
