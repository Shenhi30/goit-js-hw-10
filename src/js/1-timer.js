import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputEl = document.querySelector('#datetime-picker');
const buttonEl = document.querySelector('[data-start]');
buttonEl.disabled = true;

let userSelectedDate;
let intervalId = null;

const timer = document.querySelector('.timer');

const dataDaysSpan = timer.querySelector('[data-days]');
const dataHoursSpan = timer.querySelector('[data-hours]');
const dataMinutesSpan = timer.querySelector('[data-minutes]');
const dataSecondsSpan = timer.querySelector('[data-seconds]');

flatpickr('#datetime-picker', {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    onClose(date) {
        const inputDate = date[0].getTime();

        if (inputDate < Date.now()) {
            buttonEl.disabled = true;
            iziToast.error({
                title: 'Errore',
                message: 'Please choose a date in the future',
                position: 'topRight',
            });
            return;
        }

        userSelectedDate = inputDate;
        buttonEl.disabled = false;
    },
});

const onButton = event => {
    if (intervalId) return;

    buttonEl.disabled = true;

    intervalId = setInterval(() => {
        const diff = userSelectedDate - Date.now();

        if (diff <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            buttonEl.disabled = false;
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(diff);

        dataDaysSpan.textContent = addLeadingZero(days);
        dataHoursSpan.textContent = addLeadingZero(hours);
        dataMinutesSpan.textContent = addLeadingZero(minutes);
        dataSecondsSpan.textContent = addLeadingZero(seconds);
    }, 1000);
};

buttonEl.addEventListener('click', onButton);

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
function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}