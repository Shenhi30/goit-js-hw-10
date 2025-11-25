import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

let userSelectedDates = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates, _, instance) {
        userSelectedDates = selectedDates[0];
        console.log(selectedDates[0]);

        if (Date.now() >= userSelectedDates) {
            iziToast.error({
                title: 'Error',
                message: ' Please choose a date in the future',
                position: 'topLeft',
            });

            refs.startBtn.disabled = true;
        } else {
            refs.startBtn.disabled = false;
        }
    },
};

flatpickr('#datetime-picker', options);

const refs = {
    startBtn: document.querySelector('button'),
    dataInput: document.querySelector('#datetime-picker'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};

refs.dataInput.disabled = false;
refs.startBtn.disabled = true;

const timer = {
    deadline: null,
    intervalId: null,

    start() {
        this.intervalId = setInterval(() => {
            const difference = this.deadline - Date.now();

            if (difference <= 0) {
                this.stop();

                refs.dataInput.disabled = false;
                refs.startBtn.disabled = true;
                return;
            }

            const { days, hours, minutes, seconds } = this.convertMs(difference);

            refs.days.textContent = this.addLeadingZero(days);
            refs.hours.textContent = this.addLeadingZero(hours);
            refs.minutes.textContent = this.addLeadingZero(minutes);
            refs.seconds.textContent = this.addLeadingZero(seconds);
        }, 1000);
    },

    stop() {
        clearInterval(this.intervalId);
    },

    convertMs(ms) {
        // Number of milliseconds per unit of time
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        // Remaining days
        const days = Math.floor(ms / day);
        // Remaining hours
        const hours = Math.floor((ms % day) / hour);
        // Remaining minutes
        const minutes = Math.floor(((ms % day) % hour) / minute);
        // Remaining seconds
        const seconds = Math.floor((((ms % day) % hour) % minute) / second);

        return { days, hours, minutes, seconds };
    },
    addLeadingZero(value) {
        return String(value).padStart(2, '0');
    },
};

// console.log(timer);

const onStartBtnClick = () => {
    timer.deadline = userSelectedDates;
    timer.start();
    refs.startBtn.disabled = true;
    refs.dataInput.disabled = true;
};

refs.startBtn.addEventListener('click', onStartBtnClick);