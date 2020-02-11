const dashboard_links = document.querySelector('.dashboard-left-sidebar');
const burger = document.querySelector('.burger');
const background = document.querySelector('dashboard-right-col');



burger.addEventListener('click', () => {
  console.log('Clicked');
  toggleMobileDashboardMenu();
})

//Methods
const toggleMobileDashboardMenu = () => {
  dashboard_links.classList.toggle('nav-toggle');
  dashboard_links.classList.toggle('transition-active');
  burger.classList.toggle('burger-toggle')
  background.classList.toggle('dashboard-menu-opacity');
}