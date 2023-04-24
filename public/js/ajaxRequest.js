
function addToWishList(productId) {
    $.ajax({
        url: "/wishlist/" + productId,
        method: "get",
        success: function(response) {
            if (response.status === true) {
                swal.fire({
                    title: "Added To Wishlist",
                    icon: "success",
                    confirmButtonText: "continue"
                });
            } else if (response.productExist) {
                swal.fire({
                    title: "This Product Already Exists In Your Wishlist",
                    icon: "error",
                    confirmButtonText: "continue"
                });
            } else {
                swal.fire({
                    title: "Not Logged in",
                    text: "Please Log In!",
                    icon: "error",
                    confirmButtonText: "continue"
                }).then(()=>{
                    window.location.href = response.redirectUrl
                });
            }
        }
    });
}


function removeFromWishList(wishlistId,productId){
    swal.fire({
        title: 'Are you sure you want to remove this product from the wishlist?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url:'/removeFromWishList',
                method:'post',
                data:{
                    productId:productId,
                    wishlistId:wishlistId
                },
                success:(response)=>{
                    if(response.status){
                        swal.fire({
                            title: "Product removed from wishlist!",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(function () {
                            location.reload();
                        })
                    }
                }
            });
        }
    });
    
}

function addToCart(productId,size){
    $.ajax({
        url:'/addToCart',
        method:'get',
        data:{
            productId:productId,
            size:size,
        },
        success:(response)=>{
           if(response.status==true){
            swal.fire({
                title:"Product Added to the Cart",
                icon:"success",
                confirmButtonText:"OK"
            })
           }else{
            swal.fire({
                title: "Not Logged in",
                text: "Please Log In!",
                icon: "error",
                confirmButtonText: "continue"
            }).then(()=>{
                window.location.href = response.redirectUrl;
            });
           }
        }
    })
}

function changeQuantity(cartId,productId,size,count){
    let quantity=parseInt(document.getElementById(productId).value)
    if(count==-1 && quantity==1){
        swal.fire({
            title: 'Are you sure you want to remove this product from the wishlist?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url:"/changeQuantity",
                    method:"post",
                    data:{
                        cartId:cartId,
                        productId:productId,
                        count:count,
                        size:size,
                        quantity:quantity
                    },
                    success:(response)=>{
                        if(response.quantity){
                            swal.fire({
                                title: "Product removed from Cart!",
                                icon: "success",
                                confirmButtonText: "OK",
                            }).then(function () {
                                location.reload();
                            })
            }}
        
            })
            }
       })
       
    }else{
        $.ajax({
            url:"/changeQuantity",
            method:"post",
            data:{
                cartId:cartId,
                productId:productId,
                count:count,
                size:size,
                quantity:quantity
            },
            success:(response) =>{
                if(response.success){
                    document.getElementById(productId).innerHTML=quantity+count;
                    if(response.cartData && response.cartData.length > 0){
                        document.getElementById(sum).innerHTML='₹'+response.cartData.productPrice
                        document.getElementById(subtotal).innerHTML='₹'+response.sum
                    }
                    location.reload()
                }
                
            }
        })
       
        }
}


function removeFromCart(productId,cartId,size){
    swal.fire({
        title: 'Are you sure you want to remove this product from the Cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url:'/removeFromCart',
                method:'post',
                data:{
                    productId:productId,
                    cartId:cartId,
                    size:size
                },
                success:(response)=>{
                    if(response.status){
                        swal.fire({
                            title: "Product removed from Cart!",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(function () {
                            location.reload();
                        })
                    }
                }
            })
        }
    });
    
   
}

function removeAddress(userId,addressId){
    swal.fire({
        title: 'Are you sure do you want to remove this Address?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url:'/removeAddress',
                method:'post',
                data:{
                    userId:userId,
                    addressId:addressId
                },
                success:(response)=>{
                    if(response.status){
                        swal.fire({
                            title: "Address removed",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(function () {
                            location.reload();
                        })
                    }
                }
            });
        }
    });
    
}

function cancelOrder(orderId){
    swal.fire({
        title: 'Are you sure do you want to remove this Address?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url:'/cancelOrder',
                method:'post',
                data:{
                    orderId:orderId,
                },
                success:(response)=>{
                    if(response.status){
                        swal.fire({
                            title: "Order Cancelled",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(function () {
                            location.reload();
                        })
                    }
                }
            });
        }
    })
}