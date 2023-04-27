

const form1 = document.querySelector("form");
const email = document.getElementById("email");
const password = document.getElementById("password");


function setError(message, errorElement) {
  document.getElementById(errorElement).innerHTML = message;
  document.getElementById(errorElement).style.color="red"

}


function setSuccess(errorElement) {

  document.getElementById(errorElement).innerHTML = "";
 
}


function emailValidation(email) {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
} 


function validateEmail() {
  const emailValue = email.value.trim();
  if (emailValue === "") {
    setError("Field is empty!!!", "emailError");
  } else if (!emailValidation(emailValue)) {
    setError("Enter valid email address", "emailError");
  } else {
    setSuccess("emailError");
    return true;
  }
}

function validatePassword() {
  const passwordValue = password.value.trim();
  if (passwordValue === "") {
    setError("Field is empty!!!", "passwordError");
  }else if(passwordValue.length < 5){
    setError("Password must be greater than 5 characters", "passwordError")
  } 
  else if (passwordValue.length > 11) {
    setError("Password cannot exceed 12 characters", "passwordError");
  } else {
    setSuccess("passwordError");
    return true;
  }
}

  email.addEventListener("input", () => {
    validateEmail();
  });
  

  
  password.addEventListener("input", () => {
    validatePassword();
  });
  

  form1.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // return true;
  
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
  
    if (
      isEmailValid &&
      isPasswordValid
    ) {

      form1.submit();
    
    }
  });
const showPassword=document.getElementById('showpassword')
  showPassword.onclick = (e) => {
    if (password.type === 'text') {
        password.type = 'password'
    } else {
        password.type = 'text'
    }
}
