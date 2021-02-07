
let selectIndex = document.querySelector('#count');
let selectIndex2 = document.querySelector('#count2');
let inIndex = document.querySelector('#inIndex');
let outIndex = document.querySelector('#outIndex');
let nbuDiv = document.querySelector('.nbu-div');
let pbDiv = document.querySelector('.pb-div');
// -------------------------------
let listIndex;
let cursDol = 0;
// -------------------------------

let h3 = document.createElement('H3');
let p = document.createElement('P');
let data_nbu = document.createElement('P');
let i = document.createElement('I');

nbuDiv.prepend(data_nbu);
nbuDiv.prepend(h3);
nbuDiv.prepend(p);

i.classList.add('fas', 'fa-question-circle', 'ques-nbu')
i.setAttribute('data-title', 'Курс валют за даними НБУ');
p.textContent = `1 USD equals`;
p.style.fontWeight = 'bold';
p.append(i);
data_nbu.textContent = `Курси валют станом на  ${new Date().toLocaleString()}`
// ----------вивід курса валюти---------------------
function loadTitle() {

    h3.textContent = `${(getValuta(selectIndex) / getValuta(selectIndex2)).toFixed(3)}  ${selectIndex2.value.substring(0, 3)}`
    p.textContent = `1 ${selectIndex.value.substring(0, 3)} equals`;
    p.style.fontWeight = 'bold';
    i.classList.add('fas', 'fa-question-circle', 'ques-nbu')
    i.setAttribute('data-title', 'ККурс валют за даними НБУ');
    p.append(i);
    data_nbu.textContent = `Курси валют станом на  ${new Date().toLocaleString()}`
}
// -------------------------------
function getValuta(obj) { // Витяг курсу валюти по cc
    let val = 0;
    for (let i = 0; i < listIndex.length; i++) {
        if (listIndex[i].cc == obj.value.substring(0, 3)) {
            val = listIndex[i].rate;
        }
    }
    return val;
}
// -------------------------------
function loadSelect(obj, set, defaultSelect) { // Загрузка информації в html 
    for (let i = 0; i < obj.length; i++) {
        let optionIndex = document.createElement('OPTION');
        if (obj[i].cc == 'USD' || obj[i].cc == 'EUR' || obj[i].cc == 'RUB' || obj[i].cc == 'UAH') {
            optionIndex.textContent = `${obj[i].cc} - ${obj[i].txt}`
            set.prepend(optionIndex)
        }
        else {
            optionIndex.textContent = `${obj[i].cc} - ${obj[i].txt}`
            set.append(optionIndex)
        }
        if (obj[i].cc == 'USD') { cursDol = obj[i].rate; }
    }
    set.options[defaultSelect].selected = true;
    h3.textContent = `${cursDol.toFixed(3)} UAH`
    outIndex.placeholder = `${cursDol.toFixed(3)}`
}
// ------------Національний банк-------------------

function loadNBU() {
    // let url = 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11';
    let url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

    fetch(url)
        .then(function (response) {
            return response.json()
        }).then(function (list) {
            list.push({ 'cc': 'UAH', 'txt': 'Українська гривня', 'rate': 1 })
            listIndex = list;
            loadSelect(list, selectIndex, 2)//Загрузка в перший select
            loadSelect(list, selectIndex2, 0)//Загрузка в другий select

        })
}
// ----------------Приват банк--------------------------
function loaPB() {

    let url = 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11';
    // let url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

    fetch(url)
        .then(function (response) {
            return response.json()
        }).then(function (list) {
            let table = document.createElement('TABLE');
            let tr = document.createElement('TR');
            let arrTitleTable = ['', '', 'Купівля <i class="fas fa-question-circle ques-nbu" data-title="Курси валют за даними ПБ"></i>', 'Продаж <i class="fas fa-question-circle ques-nbu" data-title="Курси валют за даними ПБ"></i>'];

            for (let i = 0; i < arrTitleTable.length; i++) {
                let td = document.createElement('TD');
                td.innerHTML = arrTitleTable[i];
                table.append(td);
                pbDiv.append(table);
            }
            for (object of list) {
                let tr = document.createElement('TR');
                for (key in object) {
                    let td = document.createElement('TD');
                    if (!isNaN(object[key])) {
                        let val = +object[key];
                        td.textContent = val.toFixed(3);
                    }
                    else {
                        td.textContent = object[key];
                    }
                    tr.append(td);
                }
                table.append(tr)
            }
            pbDiv.append(table);
        })
}
// ------------------------------------------
loadNBU();
loaPB();

// --------------select-1----------------------------
selectIndex.addEventListener('input', function () {
    outIndex.value = (inIndex.value * getValuta(this) / getValuta(selectIndex2)).toFixed(2);
    loadTitle();
})
// --------------select-2------------------
selectIndex2.addEventListener('input', function () {
    outIndex.value = (inIndex.value * getValuta(selectIndex) / getValuta(this)).toFixed(2);
    loadTitle();
})
// ---------------input----------------------
inIndex.addEventListener('input', function () {
    outIndex.value = (inIndex.value * getValuta(selectIndex) / getValuta(selectIndex2)).toFixed(2);
    loadTitle();

})
