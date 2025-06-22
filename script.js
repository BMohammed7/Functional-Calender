const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"]; // Array of 12 Months
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //Array of number of day in each Month
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; //Array for name of each day in a week
let currentYear = new Date().getFullYear(); //setting current Year when launching calender
let currentMonth = new Date().getMonth(); //setting current month when launching calender
let events = JSON.parse(localStorage.getItem('events')) || {};  
//Loads events from localstorage if there is nothing continues as a empty object.

function isLeapYear(year) {
    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)); //Checking if it is a leap Year.
}

function renderCalendar(month, year) { //Displaying the calender
    const calendarDays = document.getElementById("Cdays");
    const monthYearLabel = document.getElementById("Myear");

    monthYearLabel.innerText = monthNames[month] + ' ' + year;

    let days = daysInMonth[month];
    if (month === 1 && isLeapYear(year)) { //setting the leap year, 29 days in february
        days = 29;
    }

    calendarDays.innerHTML = "";

    for (let dayName of dayNames) { //Adding day name to the calender
        const dayHeader = document.createElement("div");
        dayHeader.classList.add("day", "dayHeader");
        dayHeader.innerText = dayName;
        calendarDays.appendChild(dayHeader);
    }

    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDay; i++) { //Adding empty boxes for days before the first day of the month
        const emptyDay = document.createElement("div");
        emptyDay.classList.add("day");
        calendarDays.appendChild(emptyDay);
    }

    for (let day = 1; day <= days; day++) { //Loop for each day in the month
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.innerText = day;

        const dateKey = `${year}-${month + 1}-${day}`;//Date format (year-month-day)
        if (events[dateKey]) {
            const Indicator = document.createElement("span");
            Indicator.style.color = "red";
            Indicator.innerText = " •";
            dayElement.appendChild(Indicator);
        }

        dayElement.onclick = () => openPopup(dateKey);//popup for adding event

        calendarDays.appendChild(dayElement); //Adding day to the calender
    }

    renderEventTable(); //updating the event table with events
}

function openPopup(dateKey) { //Open popup to add event
    document.getElementById("eventPopup").style.display = "flex";
    document.getElementById("eventDate").innerText = `Date: ${dateKey}`;
    document.getElementById("eventDescription").value = events[dateKey] || "";
    document.getElementById("eventPopup").dataset.dateKey = dateKey;
}

function closePopup() { //Closing the popup
    document.getElementById("eventPopup").style.display = "none";
}

function addEvent() { //Saving the event description in the other table
    const dateKey = document.getElementById("eventPopup").dataset.dateKey;
    const eventDescription = document.getElementById("eventDescription").value;
    
    if (eventDescription) { //if description save
        events[dateKey] = eventDescription;
    } else { //if empty, remove the existing event
        delete events[dateKey];  
    }
    
    localStorage.setItem("events", JSON.stringify(events)); //saves events to the local storage
    closePopup(); // close popup after saving
    renderCalendar(currentMonth, currentYear);  //refresh to show event
}

function changeMonth(offset) { //Moving to next or previous month
    currentMonth += offset; //Adjusting the month
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) { 
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear); //showing updated calendar
}

function renderEventTable() { //update the event list table
    const eventTableBody = document.getElementById("eventTable").getElementsByTagName("tbody")[0];
    eventTableBody.innerHTML = ""; 

    for (const dateKey in events) { //loop through each event
        const row = document.createElement("tr"); //creating a new row

        const dateCell = document.createElement("td"); //creating dateCell for date
        dateCell.innerText = dateKey; // adding date text

        const descriptionCell = document.createElement("td"); //creating descriptionCell for description
        descriptionCell.innerText = events[dateKey]; // adding description text

        row.appendChild(dateCell); //adding date cell to the row
        row.appendChild(descriptionCell); //adding description cell to the row
        eventTableBody.appendChild(row); //adding the row to the table
    }
}

renderCalendar(currentMonth, currentYear); //renders calendar on page load
