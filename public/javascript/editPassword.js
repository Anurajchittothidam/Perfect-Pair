

const form1 = document.querySelector("#form1");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");


function setError(message, errorElement) {
  document.getElementById(errorElement).innerHTML = message;
  document.getElementById(errorElement).style.color="red"

}


function setSuccess(errorElement) {

  document.getElementById(errorElement).innerHTML = "";
 
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


function validateConfirmPassword() {
    const confirmPasswordvalue = confirmPassword.value.trim();
    const passwordValue = password.value.trim();
    if (confirmPasswordvalue === "") {
      setError("Field is empty", "confirmpasswordError");
    }else if(passwordValue===""){
        setError(
            "Enter the password field",
            "confirmpasswordError"
        )
    }
     else if (confirmPasswordvalue !== passwordValue) {
      setError(
              "Password does not match",
        "confirmpasswordError"
      );
    } else {
      setSuccess("confirmpasswordError");
      return true;
    }
  }
 
  password.addEventListener("input", () => {
    validatePassword();
  });

  confirmPassword.addEventListener("input", () => {
    validateConfirmPassword();
  });

  

  form1.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // return true;
  
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
  
    if (
      isPasswordValid&&
      isConfirmPasswordValid
    ) {

      form1.submit();
    
    }
  });
  const showPassword=document.getElementById('showpassword')
  showPassword.onclick = (e) => {
    if (password.type === 'text') {
        password.type = 'password'
        confirmPassword.type = 'password'
    } else {
        password.type = 'text'
        confirmPassword.type = 'text'
    }
}
