const isLoggedIn=localStorage.getItem("isLoggedIn");
if(isLoggedIn !== "true"){
    window.location.href="login.html";
}


const logoutBtn=document.getElementById("logoutBtn");
logoutBtn.addEventListener("click" ,function(){

    localStorage.removeItem("user");
    alert("Logged out successfuly!");
    window.location.href="login.html";
});