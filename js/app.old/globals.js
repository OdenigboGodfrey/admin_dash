let positive = 1;
let neutral = 0;
let negative = -1;
let error = -2;

let monthName = ['January', 'February','March','April','May','June','July','August', 'September','October','November','December'];
let dayName = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];


function log(period="initial" ,message, ...optionalParams) {
    if (period === undefined ) {
        period = "initial";
    }

    if (period === "total_cus") {
        console.log(message,...optionalParams);
    }

}

function saveToStorage(key, value) {
    log("saving", key, value);
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key, autoRedirect) {
    let data = JSON.parse(localStorage.getItem(key));
    // console.log("redirecting", data, !data && autoRedirect);

    if (key === 'userData' && !data && autoRedirect) {
        window.location.href = "/login";
    }
    else if (key === 'adminData' && !data && autoRedirect) {
        window.location.href = "/admin/login";
        // console.log("redirecting", autoRedirect)
    }

    return data;

}

function clearStorage(key) {
    return localStorage.clear();
}

function removeFromStorage(key) {
    return localStorage.removeItem(key);
}

function getHost() {
    const url = window.location.href;
    const arr = url.split("/");
    return arr[0] + "//" + arr[2]

}

function getMonthABBR(month) {
    let monthAbbR = {'JANUARY':'Jan', 'FEBRUARY':'Feb', 'MARCH':'Mar', 'APRIL':'Apr', 'MAY':'May', 'JUNE':'Jun', 'JULY':'Jul', 'AUGUST':'Aug', 'SEPTEMBER':'Sep', 'OCTOBER':'Oct', 'NOVEMBER':'Nov', 'DECEMBER':'Dec'};

    return monthAbbR[month.toUpperCase()]
}

function getDayABBR(month) {
    let monthAbbR = {'MONDAY':'Mon', 'TUESDAY':'Tue', 'WEDNESDAY':'Wed', 'THURSDAY':'Thur', 'FRIDAY':'Fri', 'SATURDAY':'Sat', 'SUNDAY':'Sun'};

    return monthAbbR[month]
}

function getMonthByIndex(index) {
    index = index - 1;

    return monthName[index]
}

function getDayByIndex(month) {
    const selectedValue = dayName[month];
    let firstLetter = selectedValue.substr(0, 1);

    return firstLetter + selectedValue.substr(1).toLowerCase();
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}

const uuid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
