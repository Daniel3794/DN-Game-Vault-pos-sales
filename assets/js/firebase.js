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
      // ແບບ/ຕົວເລືອກ (ສີ, ລາຍ, ຂະໜາດ): x.variants = [{name, price, stock, image?}]
      const vs = (Array.isArray(x.variants) ? x.variants : []).map(function (v) { return { n: String(v.name || ""), p: Number(v.price) || 0, s: Number(v.stock) || 0, img: v.image || (Number.isInteger(v.imageIndex) && Array.isArray(x.images) && x.images[v.imageIndex]) || "" }; }).filter(function (v) { return v.n; });
      const vmin = vs.length ? Math.min.apply(null, vs.map(function (v) { return v.p; })) : 0, vmax = vs.length ? Math.max.apply(null, vs.map(function (v) { return v.p; })) : 0;
      K[id] = x.type || "l";
      P.push({ id: id, doc: d.id, c: x.category, b: x.brand, n: x.name, p: vs.length ? vmin : Number(x.price), s: vs.length ? vs.reduce(function (a, v) { return a + v.s; }, 0) : Number(x.stock), v: vs, vr: vmin !== vmax, pre: !!x.preorder, eta: x.preorderEta || "",
               old: Number(x.oldPrice) || 0, img: x.images || [], desc: x.description || "", war: x.warranty || "", cond: x.condition || "new", sp: (x.specs || []).map(function (s) { return [s.k, s.v]; }) });
    });
    Object.keys(cart).forEach(function (k) {
      const u = unit(k);
      if (!u || u.max < 1) delete cart[k]; else if (cart[k] > u.max) cart[k] = u.max;
    });
    chips(); draw(); upd();
    if (!window._hashDone) { window._hashDone = true; openFromHash(); }
  }, function (e) { console.error("products", e); });

  // ຮັບ: ຂໍ້ມູນຮ້ານ (ເບີ WhatsApp, ທີ່ຢູ່, ເວລາເປີດ, Facebook) ທີ່ແກ້ໃນໜ້າ admin
  onSnapshot(doc(db, "settings", "shop"), function (snap) { if (snap.exists()) applyShop(snap.data()); }, function (e) { console.error("settings", e); });

  // ເກັບ + ສົ່ງ: ບັນທຶກອໍເດີ ແລະ ຫັກສະຕັອກໃນຄັ້ງດຽວ (ຖ້າສະຕັອກບໍ່ພໍ ຈະບໍ່ບັນທຶກ)
  window.saveOrder = function (o) {
    return runTransaction(db, async function (tx) {
      // ລວມລາຍການຂອງສິນຄ້າດຽວກັນ (ຫຼາຍແບບ) ເຂົ້າເອກະສານດຽວ ເພື່ອຫັກສະຕັອກຄັ້ງດຽວ
      const groups = {};
      o.items.forEach(function (i) {
        if (i.pre) return; // ສັ່ງຈອງ: ບໍ່ຫັກສະຕັອກ
        const p = P.find(function (x) { return x.id == i.id; });
        if (!p || !p.doc) throw new Error("ບໍ່ພົບສິນຄ້າໃນລະບົບ");
        (groups[p.doc] = groups[p.doc] || { ref: doc(db, "products", p.doc), items: [] }).items.push(i);
      });
      const gs = Object.values(groups);
      for (const g of gs) g.snap = await tx.get(g.ref);
      gs.forEach(function (g) {
        const d = g.snap.data(), vs = Array.isArray(d.variants) ? d.variants.map(function (v) { return Object.assign({}, v); }) : [];
        let stock = Number(d.stock) || 0;
        g.items.forEach(function (i) {
          if (i.vi != null) {
            const v = vs[i.vi];
            if (!v || (Number(v.stock) || 0) < i.qty) throw new Error(i.name + " ເຫຼືອບໍ່ພໍ");
            v.stock = Number(v.stock) - i.qty;
          } else {
            if (stock < i.qty) throw new Error(i.name + " ເຫຼືອບໍ່ພໍ");
            stock -= i.qty;
          }
        });
        g.upd = vs.length ? { variants: vs, stock: vs.reduce(function (a, v) { return a + (Number(v.stock) || 0); }, 0) } : { stock: stock };
      });
      gs.forEach(function (g) { tx.update(g.ref, g.upd); });
      const oref = doc(collection(db, "orders")), slip = o.slip, rest = Object.assign({}, o);
      delete rest.slip;
      tx.set(oref, clean(Object.assign({}, rest, { status: "new", paid: false, hasSlip: !!slip, createdAt: serverTimestamp() })));
      if (slip) tx.set(doc(db, "slips", oref.id), { img: slip, createdAt: serverTimestamp() }); // ສະລິບເກັບແຍກ ໃຫ້ສະເພາະ admin ອ່ານໄດ້
    });
  };
}
