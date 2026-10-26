# DN Game Vault – ເວັບຮ້ານ (ລູກຄ້າເຫັນ)

ເວັບນີ້ແຍກຈາກເວັບຫຼັງບ້ານ (`backoffice`) ແຕ່ໃຊ້ **ຖານຂໍ້ມູນ Firebase ດຽວກັນ**.

```
shop/
├── index.html              ໜ້າຮ້ານ
├── firebase.json           ຕັ້ງຄ່າ Firebase Hosting
└── assets/
    ├── css/style.css
    ├── js/
    │   ├── firebase-config.js   ⭐ ໃສ່ຄ່າ Firebase (ຊຸດດຽວກັບ backoffice)
    │   ├── app.js               ສິນຄ້າ, ກະຕ່າ, ສັ່ງຊື້
    │   └── firebase.js          ດຶງສິນຄ້າ/ຂໍ້ມູນຮ້ານ, ບັນທຶກອໍເດີ
    └── img/                     ໂລໂກ້ ແລະ ໄອຄອນ
```

## ຕັ້ງຄ່າ
1. ແກ້ `assets/js/firebase-config.js` ໃສ່ຄ່າ Firebase (ຄ່າດຽວກັນກັບ backoffice).
2. ໃນ `index.html` ແກ້ `og:image` ຈາກ `https://YOUR_DOMAIN/...` ເປັນໂດເມນຈິງ (ສຳລັບແຊຣ໌ໃນ Facebook).
3. ເບີ WhatsApp, ທີ່ຢູ່, ແຜນທີ່, ຂໍ້ມູນຊຳລະ/ຈັດສົ່ງ ແກ້ໃນ **backoffice → ຕັ້ງຄ່າ** (ບໍ່ຕ້ອງແກ້ໂຄ້ດ).
4. ອັບໂຫຼດທັງໂຟນເດີ ຂຶ້ນ Hosting (ຄົງໂຄງສ້າງໄວ້).

## ຈ່າຍເງິນຜ່ານ QR + ແນບສະລິບ
- ໃນກະຕ່າ ລູກຄ້າເລືອກ "ໂອນຜ່ານ QR" (ສະແດງ QR ແລະ ຍອດທີ່ຕ້ອງໂອນ, ແນບສະລິບໄດ້) ຫຼື "ຈ່າຍເງິນສົດ".
- ຮູບ QR ມາດຕະຖານຢູ່ `assets/img/shop-qr.jpg` ຫຼື ອັບໂຫຼດ QR ໃໝ່ໃນ **backoffice → ຕັ້ງຄ່າ** (ບໍ່ຕ້ອງແກ້ໂຄ້ດ).
- ສະລິບເກັບໃນ collection `slips` ທີ່ມີສະເພາະ admin ອ່ານໄດ້ (ຕ້ອງວາງ Firestore Rules ອັນໃໝ່ກ່ອນ).
