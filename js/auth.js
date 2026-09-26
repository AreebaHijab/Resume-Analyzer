

const registerForm= document.getElementById("registerForm");
if (registerForm){
registerForm.addEventListener("submit",
    function(event){
        event.preventDefault();
    

const name=document.getElementById("name").value.trim() ;
const email=document.getElementById("email").value.trim() ;
const password=document.getElementById("password").value.trim();


const nameError=document.getElementById("nameError");
const emailError=document.getElementById("emailError");
const passwordError=document.getElementById("passwordError");



nameError.textContent ="";
emailError.textContent="";
passwordError.textContent="";

let isValid = true;

if(name ===""){
    nameError.textContent="Name Is Required" ;
    isValid = false;
}

if(email ===""){
    emailError.textContent="Email Is Required" ;
    isValid =false;
}

if(password ===""){
    passwordError.textContent="Password Is Required" ;
    isValid = false;
}else if(password.length !== 8){
    passwordError.textContent="Password must be exactly 8 characters";
    isValid=false;
}

if (isValid){
    const user ={
        name: name,
        email: email,
        password: password
    };
    localStorage.setItem("user",
        JSON.stringify(user));
        alert("Registration Successful!");
        window.location.href="login.html";



                   
}
});

 const nameInput=document.getElementById("name");
        const emailInput=document.getElementById("email");
        const passwordInput=document.getElementById("password");
nameInput.addEventListener("keydown" ,
    function (event){
        if (event.key === "Enter"){
            event.preventDefault();
            emailInput.focus();
        }
    });
emailInput.addEventListener("keydown" ,
    function (event){
        if (event.key === "Enter"){
            event.preventDefault();
            passwordInput.focus();
        }
    });
passwordInput.addEventListener("keydown" ,
    function (event){
        if (event.key === "Enter"){
            event.preventDefault();
            registerForm.requestSubmit();
        }
    });
}



const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const loginEmail = document.getElementById("loginEmail").value.trim();
        const loginPassword = document.getElementById("loginPassword").value.trim();

        const loginEmailError = document.getElementById("loginEmailError");
        const loginPasswordError = document.getElementById("loginPasswordError");
        const loginError = document.getElementById("loginError");

        loginEmailError.textContent = "";
        loginPasswordError.textContent = "";
        loginError.textContent = "";

        let isValid = true;

        if (loginEmail === "") {
            loginEmailError.textContent = "Email is required";
            isValid = false;
        }

        if (loginPassword === "") {
            loginPasswordError.textContent = "Password is required";
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (!savedUser) {
            loginError.textContent = "No registered user found";
            return;
        }

        if (
            loginEmail === savedUser.email &&
            loginPassword === savedUser.password
        ) {

            localStorage.setItem("isLoggedIn","true");

            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            loginError.textContent = "Invalid email or password";
        }



    });




    const loginEmailInput = document.getElementById("loginEmail");
        const loginPasswordInput = document.getElementById("loginPassword");

loginEmailInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        loginPasswordInput.focus();
    }
});

loginPasswordInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        loginForm.requestSubmit();
    }
});
}
