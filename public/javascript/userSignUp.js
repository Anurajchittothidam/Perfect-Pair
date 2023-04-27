// const form = document.getElementById("form")
// const errorMessage = document.getElementById("errorMessage")
// const showPassword = document.getElementById("showPassword")

// let timeOut;
// function showError(error) {
//     errorMessage.innerHTML = `<div class="alert alert-warning" role="alert">
//     ${error} 
//     <div class="close" style="cursor:pointer" onclick="hideErrorMsg()">X</div>
//     </div>`
//     clearTimeout(timeOut)
//     timeOut = setTimeout(() => {
//         errorMessage.innerHTML = "";
//     }, 3000);
// }

// setTimeout(()=>{
//     errorMessage.innerHTML="";
// },3000)

// function hideErrorMsg(){
//     errorMessage.innerHTML=""
//     clearTimeout(timeOut);
// }

// function submitform(e){
//     const firstName = document.getElementById("firstName").value;
//     const lastName = document.getElementById("lastName").value;
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     const confirmPassword = document.getElementById("confirmPassword").value;

//     const emailRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
//     if (firstName === '' && lastName === '') {
//         showError("enter the full fields")
//         return false
//     }
//     if (firstName === '') {
//         showError("enter the first name")
//         return false
//     }
//     if (firstName.length < 5) {

//         showError("first name must be more than 5")
//         return false
//     }
//     if (lastName === "") {
//         showError("enter the last name")
//         return false
//     }
//     if(email===""){
//         showError("please enter the email")
//         return false
//     }
//     if (!email.match(emailRegx)) {
//         showError("enter the valid email")
//         return false
//     }
//     if(password===""){
//         showError("enter the password")
//         return false
//     }
//     if(confirmPassword===''){
//         showError("enter the confirm password")
//         return false
//     }if(password!==confirmPassword){
//         showError("the password is not matching")
//         return false;
//     }
//     hideErrorMsg();
//     return true
// }



// const { name } = require("ejs")

const form1 = document.querySelector("form");
const username = document.getElementById("name");
const email = document.getElementById("email");
const phonenumber = document.getElementById("phoneNumber");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

function setError(field, message, errorElement) {
  const inputData = field.parentElement;
  document.getElementById(errorElement).innerHTML = message;
  inputData.classList.add("danger");
  inputData.classList.remove("success");
}


function setSuccess(field, errorElement) {
  const inputData = field.parentElement;
  document.getElementById(errorElement).innerHTML = "";
  field.classList.add("success");
  field.classList.remove("danger");
}


function emailValidation(email) {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
} 




function validateUsername() {
  const nameValue = username.value.trim();
  if (nameValue === "") {
    setError(username, "Field is empty!!!", "usernameError");
  } else if (!isNaN(Number(nameValue))) {
    setError(username, "Username should be alphabets", "usernameError");
  } else {
    setSuccess(username, "usernameError",);
    return true;
  }
}

function validateEmail() {
  const emailValue = email.value.trim();
  if (emailValue === "") {
    setError(email, "Field is empty!!!", "emailError");
  } else if (!emailValidation(emailValue)) {
    setError(email, "Enter valid email address", "emailError");
  } else {
    setSuccess(email, "emailError");
    return true;
  }
}

function validatePhoneNumber() {
  const phoneValue = phonenumber.value.trim();
  if (phoneValue === "") {
    setError(phonenumber, "Field is empty!!!", "phoneError");
  } else if (phoneValue.toString().length !== 10 || isNaN(Number(phoneValue))) {
    setError(phonenumber, "Enter valid phone number", "phoneError");
  } else {
    setSuccess(phonenumber, "phoneError");
    return true;
  }
}

function validatePassword() {
  const passwordwordValue = password.value.trim();
  if (passwordwordValue === "") {
    setError(password, "Field is empty!!!", "passwordError");
  } else if (passwordwordValue.length > 11) {
    setError(password, "Password cannot exceed 12 characters", "passwordError");
  } else {
    setSuccess(password, "passwordError");
    return true;
  }
}

function validateConfirmPassword() {
  const confirmPasswordvalue = confirmPassword.value.trim();
  const passwordwordValue = password.value.trim();
  if (confirmPasswordvalue === "") {
    setError(confirmPassword, "Field is empty", "confirmpasswordError");
  } else if (confirmPasswordvalue !== passwordwordValue) {
    setError(
      confirmPassword,
      "Password does not match",
      "confirmpasswordError"
    );
  } else {
    setSuccess(confirmPassword, "confirmpasswordError");
    return true;
  }
}



username.addEventListener("input", () => {
    validateUsername();
  });
  
  email.addEventListener("input", () => {
    validateEmail();
  });
  
  phonenumber.addEventListener("input", () => {
    validatePhoneNumber();
  });
  
  password.addEventListener("input", () => {
    validatePassword();
  });
  
  confirmPassword.addEventListener("input", () => {
    validateConfirmPassword();
  });




  form1.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // return true;
  
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPhoneNumberValid = validatePhoneNumber();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
  
    if (
      isUsernameValid &&
      isEmailValid &&
      isPhoneNumberValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {

      form1.submit();
    
    }
  });

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
