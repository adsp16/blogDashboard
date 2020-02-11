const nav_links = document.querySelector('.nav-links');
const burger = document.querySelector('.burger');


const app = () => {

  burger.addEventListener('click', () => {
    toggleMobileMenu();

  });



}


//METHODS 




const toggleMobileMenu = () => {

  nav_links.classList.toggle('nav-toggle');
  nav_links.classList.toggle('transition-active');
  burger.classList.toggle('burger-toggle');

}


app();