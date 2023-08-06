const calendarCurrMonthYear = document.querySelector(".monthYear");
const monthDays = document.querySelector(".numbers");
const monthsArrows = document.querySelectorAll(".arrows div");
const travelDaysSKorea = [15, 16, 17, 18, 19];
const travelDaysGBritain = [1, 2, 3, 4, 5];
const pickedDays = [];
const costPerDay = 200;
const showOrderResult = document.getElementById("orderResultToast");
const showResult = bootstrap.Toast.getOrCreateInstance(showOrderResult);

const submitForm = document.querySelector("form");

const result = document.getElementById("result");

const monthsNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

const fillCalendar = () => {
    let firstDayIndex = new Date(year, month, 1).getDay();
    let lastMonthDay = new Date(year, month + 1, 0).getDate();
    let prevMonthLastDay = new Date(year, month, 0).getDate();
    let lastMonthDayIndex = new Date(year, month, lastMonthDay).getDay();

    let liElements = "";

    for (let i = firstDayIndex; i > 0; i--) {
        liElements += `<li class="otherMonth">${prevMonthLastDay - i + 1}</li>`;
    }

    for (let i = 1; i <= lastMonthDay; i++) {
        let currentDay = i === date.getDate() && month === new Date().getMonth()
            && year === new Date().getFullYear() ? "currDay" : "";

        let travelDaysColor = travelDaysSKorea.includes(i) && travelDaysSKorea.every(TravelDaysGreaterThanCurrDate) ? "travelDates" : "";

        liElements += `<li class="${currentDay} ${travelDaysColor}" onclick = "chooseDays(this)">${i}</li>`;
    }

    for (let i = lastMonthDayIndex; i < 6; i++) {
        liElements += `<li class="otherMonth">${i - lastMonthDayIndex + 1}</li>`;
    }

    calendarCurrMonthYear.innerHTML = `${monthsNames[month]} ${year}`;
    monthDays.innerHTML = liElements;
};
fillCalendar();

function TravelDaysGreaterThanCurrDate(trvlDay) {
    let trvlDayToCheck = new Date(year, month, trvlDay);
    if (trvlDayToCheck <= date) {
        return false;
    }
    return true;
    /* if ((trvlDate > new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) || (month > new Date().getMonth() && year === new Date().getFullYear())
        || year > new Date().getFullYear()) {
        return true;
    }
    return false; */
}

monthsArrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
        if (arrow.className === "prev") {
            if (month === 0) {
                year -= 1;
                month = 11;
            } else {
                month -= 1;
            }
        } else {
            if (month === 11) {
                year += 1;
                month = 0;
            } else {
                month += 1;
            }
        }
        fillCalendar();
    });
});

function chooseDays(pickedDay) {
    if (pickedDay.style.backgroundColor === "" && TravelDaysGreaterThanCurrDate(pickedDay)) {
        pickedDays.push(pickedDay.innerHTML);
        pickedDay.style.backgroundColor = "#ffe5e5";
    } else {
        let index = pickedDays.indexOf(pickedDay.innerHTML);
        pickedDays.splice(index, 1);
        pickedDay.style.backgroundColor = "";
    }

    pickedDays.sort(function (a, b) { return a - b });
    //pickedDays.every(checkPickedDates);
}

function checkPickedDates(selectedDate) {
    if (selectedDate >= 15 && selectedDate <= 19) {
        return true;
    }
    return false;
}

/* function checkPickedDates(selectedDate) {
    if (selectedDate >= 1 && selectedDate <= 5) {
        return true;
    }
    return false;
} */

submitForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const country = document.getElementById("country").value;
    const firstName = document.getElementById("FirstName").value;
    const lastName = document.getElementById("LastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const comments = document.getElementById("comments").value;
    if (pickedDays.every(checkPickedDates) && pickedDays.length !== 0) {
        const order = {
            country: country,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            comments: comments,
            days: pickedDays.length,
            totalCost: pickedDays.length * costPerDay,
        };
        /* const jsonFile = JSON.stringify(order);
        result.innerHTML = jsonFile; */

        result.innerHTML = `Country: ${order.country} </br>
        Name: ${order.firstName} ${order.lastName} </br>
        ${order.days} Days: ${pickedDays[0]} - ${pickedDays[pickedDays.length - 1]} ${monthsNames[month]} ${year} </br>
        ${order.comments = order.comments.length > 0 ? "Comments: " + order.comments : ""} </br>
        <hr>
        <b>Total cost: ${order.totalCost}$</b>`;

        showResult.show();
    } else {
        result.innerHTML = "Please, choose correct travel days.</br>" +
        "At least one!";
        showResult.show();
    }
});