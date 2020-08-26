'use strict';

// get Element
const today = new Date();
let year = today.getFullYear();
let month = today.getMonth(); // 8月
var localhost = "http://localhost:3000/"

const writeSpace = document.getElementById('writeSpace');
const submitBtn = document.getElementById('submitBtn');
const showDiary = document.getElementById('showBtn')

// Function
function getCalendarHead() {
    const dates = [];
    const d = new Date(year, month, 0).getDate();
    const n = new Date(year, month, 1).getDay();
    
    for(let i = 0; i < n; i++) {
        dates.unshift({
            date: d - i,
            isToday: false,
            isDisabled: true
        });
    }
    return dates;
}

function getCalendarBody () {
    const dates = [];
    const lastDate = new Date(year, month + 1, 0).getDate();

    for(let i = 1; i <= lastDate; i++) {
        dates.push({
            date: i,    
            isToday: false,
            isDisabled: false        
        });
    }
    if(year === today.getFullYear() && month === today.getMonth()) {
        dates[today.getDate() - 1].isToday = true;
    }
    return dates;
}

function getCalendarTail() {
    const dates = [];
    const lastDay = new Date(year, month + 1, 0).getDay();
    
    for(let i = 1; i < 7 - lastDay; i++) {
        dates.push({
            date: i,
            isToday: false,
            isDisabled: true
        });
    }
    return dates;
    
}

function clearCalendar() {
    const tbody = document.querySelector('tbody');
    
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

function renderTitle() {
    const title = `${year}/${String(month + 1).padStart(2, '0')}`;
    document.getElementById('title').textContent = title;
}

function renderWeeks() {
    const dates = [
        ...getCalendarHead(),
        ...getCalendarBody(),
        ...getCalendarTail(),
    ];
    
    const weeks = [];
    const weeksCount = dates.length / 7;
    
    for(let i = 0; i < weeksCount; i++) {
        weeks.push(dates.splice(0, 7))
    }

    let customId = 0;
    weeks.forEach((week) => {
        const tr = document.createElement('tr');

        week.forEach((date) => {
            const td = document.createElement('td');
            td.setAttribute('id', 'td_'+customId);
            td.onclick = customTDClick;
            td.textContent = date.date;
            
            const span = document.createElement('span');
            span.setAttribute('id', 'span_' + customId++);
            td.appendChild(span);
            submitBtn.onclick = customSubmitClick;

            if(date.isToday) {
                td.classList.add('today');
            }
            if(date.isDisabled) {
                td.classList.add('disabled');
            }
            tr.appendChild(td);
        });
        document.querySelector('tbody').appendChild(tr);
    })
}

// ここ
function customTDClick() {
    writeSpace.setAttribute('currentId', this.id);
}

async function customSubmitClick(e) {
    e.preventDefault();
    let currentId = writeSpace.getAttribute('currentId');
    let strSplit = currentId.split('_');
    console.log(strSplit[1]);
    let grabbedSpan = document.getElementById('span_' + strSplit[1]);
    grabbedSpan.innerHTML = writeSpace.value;
    grabbedSpan.classList.add('contentOfDiary');
    let save = await postToDiary({
        message: writeSpace.value,
        date: strSplit[1]
    });

}

// ここまで

function createCalendar() {
    clearCalendar();
    renderTitle();
    renderWeeks();
}

document.getElementById('prev').addEventListener('click', () => {
    month--;
    if(month < 0) {
        year--;
        month = 11;
    }
    createCalendar();
})

document.getElementById('next').addEventListener('click', () => {
    month++;
    if(month > 11) {
        year++;
        month = 0;
    }
    createCalendar();
});

document.getElementById('today').addEventListener('click', () => {
    year = today.getFullYear();
    month = today.getMonth();

    createCalendar();
});

showDiary.addEventListener('click', (e) => {
    e.preventDefault();
    getDiary().then((data) => {
        let table = document.getElementById('testDiaryTbl');
        for(let i = 0; i < data.length; i++) {
            let row = table.insertRow();
            let dataCell = row.insertCell(0);
            let contentCell = row.insertCell(1);
            dataCell.innerHTML = data[i].date;
            contentCell.innerHTML = data[i].content;
        } 
    })
})

async function getDiary() {
    try {
        const data = await fetch(localhost, {
            method: 'GET',
            mode: "cors"
        });
        const json = await data.json();
        console.log(json);
        return json;

    } catch(err) {
        console.log(err);
        
    }
}

async function postToDiary(message) {
    try {
        const data = await fetch(localhost + "saveCalendar", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(data);
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}

getDiary();
createCalendar();


