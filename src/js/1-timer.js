import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

let userSelectedDate = null;
let timerId = null;

const refs = {
    startBtn: document.querySelector("[data-start]"),
    dateInput: document.querySelector("#datetime-picker"),
    days: document.querySelector("[data-days]"),
    hours: document.querySelector("[data-hours]"),
    minutes: document.querySelector("[data-minutes]"),
    seconds: document.querySelector("[data-seconds]"),
};

refs.startBtn.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const chosenDate = selectedDates[0];
        if (chosenDate <= new Date()) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",
                position: "topRight",
            });
            userSelectedDate = null;
            refs.startBtn.disabled = true;
            return;
        }
        userSelectedDate = chosenDate;
        refs.startBtn.disabled = false;
    },
};

flatpickr("#datetime-picker", options);

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

refs.startBtn.addEventListener("click", () => {
    if (!userSelectedDate) return;

    refs.startBtn.disabled = true;
    refs.dateInput.disabled = true;
    startTimer();
});

function startTimer() {
    timerId = setInterval(() => {
        const currentTime = new Date();
        const diff = userSelectedDate - currentTime;

        if (diff <= 0) {
            clearInterval(timerId);
            updateInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            refs.dateInput.disabled = false;
            return;
        }

        const time = convertMs(diff);
        updateInterface(time);
    }, 1000);
}

function updateInterface({ days, hours, minutes, seconds }) {
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}