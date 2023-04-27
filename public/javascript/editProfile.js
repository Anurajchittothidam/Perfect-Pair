

const form1 = document.querySelector("#form2");
const email = document.getElementById("email");
const username = document.getElementById("name");
const phonenumber = document.getElementById("phoneNumber");


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


function validateUsername() {
    const nameValue = username.value.trim();
    if (nameValue === "") {
      setError("Field is empty!!!", "usernameError");
    } else if (!isNaN(Number(nameValue))) {
      setError("Username should be alphabets", "usernameError");
    } else {
      setSuccess("usernameError");
      return true;
    }
  }

  function validatePhoneNumber() {
    const phoneValue = phonenumber.value.trim();
    if (phoneValue === "") {
      setError("Field is empty!!!", "phoneError");
    } else if (phoneValue.toString().length !== 10 || isNaN(Number(phoneValue))) {
      setError("Enter valid phone number", "phoneError");
    } else {
      setSuccess("phoneError");
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

  

  form1.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // return true;
  
    const isEmailValid = validateEmail();
    const isUsernameValid = validateUsername();
    const isPhoneNumberValid = validatePhoneNumber();
  

    if (
      isEmailValid &&
       isPhoneNumberValid &&
       isUsernameValid 
    ) {

      form1.submit();
    
    }
  });

