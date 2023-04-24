const form = document.getElementById("form")
const errorMessage = document.getElementById("errorMessage")
const showPassword = document.getElementById("showPassword")

let timeOut;
function showError(error) {
    errorMessage.innerHTML = `<div class="alert alert-warning" role="alert">
    ${error} 
    <div class="close" style="cursor:pointer" onclick="hideErrorMsg()">X</div>
    </div>`
    clearTimeout(timeOut)
    timeOut = setTimeout(() => {
        errorMessage.innerHTML = "";
    }, 3000);
}

setTimeout(()=>{
    errorMessage.innerHTML="";
},3000)

function hideErrorMsg(){
    errorMessage.innerHTML=""
    clearTimeout(timeOut);
}

function submitform(e){
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const emailRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (firstName === '' && lastName === '') {
        showError("enter the full fields")
        return false
    }
    if (firstName === '') {
        showError("enter the first name")
        return false
    }
    if (firstName.length < 5) {

        showError("first name must be more than 5")
        return false
    }
    if (lastName === "") {
        showError("enter the last name")
        return false
    }
    if(email===""){
        showError("please enter the email")
        return false
    }
    if (!email.match(emailRegx)) {
        showError("enter the valid email")
        return false
    }
    if(password===""){
        showError("enter the password")
        return false
    }
    if(confirmPassword===''){
        showError("enter the confirm password")
        return false
    }if(password!==confirmPassword){
        showError("the password is not matching")
        return false;
    }
    hideErrorMsg();
    return true
}

showPassword.onclick = (e) => {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    if (password.type === 'text') {
        password.type = 'password'
        confirmPassword.type = 'password'
    } else {
        password.type = 'text'
        confirmPassword.type = 'text'
    }
}