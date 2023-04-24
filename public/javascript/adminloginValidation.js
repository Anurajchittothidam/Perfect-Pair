const form = document.querySelector('form')

const errorElement = document.querySelector('#error')

let timeOut;
function showErrorMsg(error) {
    errorElement.innerHTML = `<div  class="alert alert-danger d-flex justify-content-between align-items-center" role="alert">${error} 
    <div class="close text-dark fs-6" style="cursor:pointer;" onclick="hideErrorMsg()">X</div>
    </div>`
    clearTimeout(timeOut);
    timeOut=setTimeout(()=>{
        errorElement.innerHTML="";
    },3000)
}

setTimeout(()=>{
    errorElement.innerHTML=''
},3000)

function hideErrorMsg(){
    errorElement.innerHTML = ""
    clearTimeout(timeOut);
}

function submitform (e) {
    const username = form.querySelector('#username').value
    const password = form.querySelector('#password').value
    if(username === "" && password === ""){
        showErrorMsg("User name and Password is Required")
        return false;
    }
    if(username === "") {
        showErrorMsg("Username is Required")
        return false;
    }
    if(password === "" ){
        showErrorMsg("Password is Required")
        return false;
    }

    hideErrorMsg()
    return true;

}

showpassword.onclick=(e)=>{
    if(password.type=='text'){
        password.type='password'
    }else{
        password.type='text';
    }
}