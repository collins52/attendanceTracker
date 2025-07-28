const menuBar = document.getElementById('menuBar');
const sideBar = document.getElementById('sideBar');

menuBar.addEventListener('click', function(){
    console.log('button is working')
    sideBar.style.display = 'block';
})