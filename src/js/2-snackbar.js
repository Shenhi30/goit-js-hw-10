import iziToast from 'izitoast';

const refs = {
    form: document.querySelector('.form'),
};

const onSubmitBtnClick = event => {
    event.preventDefault();
    const delay = Number(refs.form.elements.delay.value);
    const state = refs.form.elements.state.value;

    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    })
        .then(delay =>
            iziToast.success({
                position: 'topRight',
                message: `Fulfilled promise in ${delay}ms`,
            })
        )
        .catch(delay =>
            iziToast.error({
                message: `Rejected promise in ${delay}ms`,
                position: 'topRight',
            })
        );
    refs.form.reset();
};

refs.form.addEventListener('submit', onSubmitBtnClick);