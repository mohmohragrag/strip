
// 🔒 تحقق صارم
function valid(item, t) {
    return item.t.includes(t);
}

// 🟦 حساب العلب
function boxLen(b, t) {
    let reduce = (t < 5) ? 4 : 3;
    let len = (2 * b.w + 2 * b.h) - (reduce * t);
    return len > 0 ? len : 0;
}

function calculate() {

    let width = parseFloat(document.getElementById("width").value);
    let t = parseFloat(document.getElementById("thickness").value);

    if (isNaN(width) || isNaN(t)) {
        alert("ادخل القيم صح");
        return;
    }

    // 🟢 DATABASE
    let pipes = [
        {name:"1/2 بوصة", d:21.3, t:[2.85]},
        {name:"3/4 بوصة", d:25, t:[1.4,1.8,2,3,3.2]},
        {name:"1 بوصة", d:33.4, t:[1.25,3]},
        {name:"1.25 بوصة", d:42, t:[4]},
        {name:"1.5 بوصة", d:48, t:[2.5,3,4]},
        {name:"2 بوصة", d:60, t:[1.6,2,2.5,2.6,3,3.5,4]},
        {name:"2.5 بوصة", d:76, t:[3,4,5]},
        {name:"3 بوصة", d:90, t:[2,3,3.65,4,5.5,5.8]},
        {name:"4 بوصة", d:114, t:[4,5,6]},
        {name:"5 بوصة", d:127, t:[2.45,3,5]},
        {name:"6 بوصة", d:168, t:[2,3,3.5,4,4.85,5,6,7]},
        {name:"8 بوصة", d:219, t:[4.8,5,6,7.5,8]},
    ];

    let boxes = [
        {name:"2×2 سم", w:50, h:50, t:[1.5,2,2.5,3]},
        {name:"3×4 سم", w:75, h:100, t:[1.5,2]},
        {name:"4×4 سم", w:100, h:100, t:[2.5,3]},
        {name:"3×6 سم", w:75, h:150, t:[2]},
        {name:"5×5 سم", w:125, h:125, t:[2.5,3]},
        {name:"12×12 سم", w:300, h:300, t:[3,4,5,4.5]},
        {name:"12.5×12.5 سم", w:312, h:312, t:[3,6]},
        {name:"10×20 سم", w:250, h:500, t:[5]},
        {name:"15×15 سم", w:375, h:375, t:[4.5,5,6,8]},
        {name:"20×20 سم", w:500, h:500, t:[8,10]},
    ];

    // 🔥 فلترة
    pipes = pipes.filter(p => valid(p, t)).map(p => ({
        ...p,
        len: (Math.PI * p.d) - t
    }));

    boxes = boxes.filter(b => valid(b, t)).map(b => ({
        ...b,
        len: boxLen(b, t)
    }));

    let items = [...pipes, ...boxes];

    let best = [];
    let bestUsed = 0;
    const MAX = 5;

    function search(combo, start, total) {

        if (total > width) return;
        if (combo.length > MAX) return;

        if (total > bestUsed) {
            bestUsed = total;
            best = [...combo];
        }

        for (let i = start; i < items.length; i++) {

            let it = items[i];
            if (!it || it.len <= 0) continue;

            combo.push(it);
            search(combo, i, total + it.len);
            combo.pop();
        }
    }

    search([], 0, 0);

    let html = "";

    if (best.length === 0) {
        html = "<h3>❌ لا يوجد عنصر مطابق لهذا السمك</h3>";
    } else {

        let count = {};

        best.forEach(x => {
            count[x.name] = (count[x.name] || 0) + 1;
        });

        html = "<h3>✅ أفضل توزيع إنتاجي</h3>";

        for (let k in count) {
            let type = k.includes("بوصة") ? "ماسورة" : "علبة";
            html += `<p>🔹 ${type} ${k} × ${count[k]}</p>`;
        }

        let waste = width - bestUsed;

        html += `
            <hr>
            <p>المستخدم: ${bestUsed.toFixed(2)} mm</p>
            <p>الهدر: ${waste.toFixed(2)} mm</p>
        `;

        if (waste < 5) html += "<p>🔥 ممتاز جدًا</p>";
        else if (waste < 20) html += "<p>👌 جيد</p>";
        else html += "<p>⚠️ يوجد هدر</p>";
    }

    document.getElementById("result").innerHTML = html;
}