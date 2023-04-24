const form = document.querySelector("#form")
const errorMessage = document.querySelector("#error")

let timeOut;
function showError(error) {
    errorMessage.innerHTML = `<div class="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
    ${error} 
    <div class="close" style="cursor:pointer" onclick="hideErrorMsg()">X</div>
    </div>`
    
    timeOut = setTimeout(() => {
        errorMessage.innerHTML = "";
    },5000);
}

setTimeout(()=>{
    errorMessage.innerHTML="";
},5000)

function hideErrorMsg(){
    errorMessage.innerHTML=""
    clearTimeout(timeOut);
}

function submitform (e) {
    const product_name = form.querySelector("#product_name").value.trim()
    const price = form.querySelector("#price").value.trim()
    const description = form.querySelector("#description").value.trim()
    const brand = form.querySelector("#brand").value.trim()
    const stock = form.querySelector("#stock").value.trim()
    const Image =form.querySelector("#imagevalidator")
    const size=form.querySelector("#size").value.trim()
    const category=form.querySelector("#category-select").value
    const subCategory=form.querySelector("#subCategory-select").value

    
    if (product_name === '' || price === '' ||brand=== '' || stock=== ''|| Image=== ''||size=== ''||category=== ''||description=== '') {
        showError("Enter the full fields")
        return false
    }
    if (product_name === '') {
        showError("Enter the Product name")
        return false
    }
    if(Image.files.length<3 || Image.files.value===""){
        showError("Enter 3 Images")
        return false
    }
    if (product_name.length < 5) {

        showError("Product name must be more than 5")
        return false
    }
    if (price === ""&& price<=10) {
        showError("enter the Price")
        return false
    }
    if(description===""){
        showError("please enter the description")
        return false
    }
    if(brand===""){
        showError("enter the brand")
        return false
    }
    if(stock===''){
        showError("enter the Stock of the product")
        return false
    }
    if(size===""&& size<=5){
        showError("enter the Size of the product")
        return false
    }
    if(category==="Category"){
        showError("enter the Category of the product")
        return false
    }
    if(subCategory==="subCategories"){
        showError("enter the subCategory of the product")
        return false
    }
    hideErrorMsg();
    return true
}


