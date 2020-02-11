const closeBtn = document.querySelector('.close-btn');
const alertBox = document.querySelector('.alert');

closeBtn.addEventListener('click', () => {

  alertBox.remove();

})