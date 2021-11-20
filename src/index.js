import 'regenerator-runtime/runtime'
import { utils } from 'near-api-js';
import { initContract, login, logout, sendToken, getAccountBalance } from './utils'
import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

async function fetchProducs() {
    $('div#products_list').empty();
    let products = await contract.getProducts();
    let myAccount = window.accountId;
    console.log(products);

    products.forEach((product) => {
        let id = product.id;
        let owner = product.owner;
        let name = product.name;
        let description = product.description;
        let brand = product.brand;
        let image = product.image;
        let price = product.price;
        let forSale = product.forSale;

        if (forSale && (owner !== myAccount)) {
            let product_item = '<div class="col-md-4 mb-3"><div class="card h-100"><div class="d-flex justify-content-between position-absolute w-100"><div class="label-new"><span class="text-white bg-success small d-flex align-items-center px-2 py-1"><i class="fa fa-star" aria-hidden="true"></i><span class="ml-1">' + owner + '</span></span></div><div class="label-sale"><span class="text-white bg-primary small d-flex align-items-center px-2 py-1"><i class="fa fa-tag" aria-hidden="true"></i><span class="ml-1">Sale</span></span></div></div><a href="#"><img src="' + image + '" class="card-img-top" alt="Product"></a><div class="card-body px-2 pb-2 pt-1"><div class="d-flex justify-content-between"><div><p class="h4 text-primary">$ ' + price + '</p></div><div><a href="#" class="text-secondary lead" data-toggle="tooltip" data-placement="left" title="Compare"><i class="fa fa-line-chart" aria-hidden="true"></i></a></div></div><p class="mb-0"><strong><a href="#" class="text-secondary">' + name + '</a></strong></p><p class="mb-1"><small><a href="#" class="text-secondary">' + brand + '</a></small></p><div class="d-flex mb-3 justify-content-between">' + description + '</div><div class="d-flex justify-content-between"><div class="col px-0"><button class="btn btn-outline-primary btn-block btn_buy" id="' + id + '" owner="' + owner + '" price="' + price + '">BUY<i class="fa fa-shopping-basket" aria-hidden="true"></i></button></div></div></div></div></div>';
            $("div#products_list").append(product_item);
        }
    });
}

async function fetchMyProducs() {
    $('div#my_products_list').empty();
    let products = await contract.getProducts();
    console.log(products);

    products.forEach((product) => {
        let myAccount = window.accountId;
        let owner = product.owner;
        if (myAccount == owner) {
            let id = product.id;
            let name = product.name;
            let description = product.description;
            let brand = product.brand;
            let image = product.image;
            let price = product.price;
            let forSale = product.forSale;
            let product_item;

            if (forSale) {
                product_item = '<div class="col-md-4 mb-3"><div class="card h-100"><div class="d-flex justify-content-between position-absolute w-100"><div class="label-new"><span class="text-white bg-success small d-flex align-items-center px-2 py-1"><i class="fa fa-star" aria-hidden="true"></i><span class="ml-1">' + owner + '</span></span></div><div class="label-sale"><span class="text-white bg-primary small d-flex align-items-center px-2 py-1"><i class="fa fa-tag" aria-hidden="true"></i><span class="ml-1">Sale</span></span></div></div><a href="#"><img src="' + image + '" class="card-img-top" alt="Product"></a><div class="card-body px-2 pb-2 pt-1"><div class="d-flex justify-content-between"><div><p class="h4 text-primary">$ ' + price + '</p></div><div><a href="#" class="text-secondary lead" data-toggle="tooltip" data-placement="left" title="Compare"><i class="fa fa-line-chart" aria-hidden="true"></i></a></div></div><p class="mb-0"><strong><a href="#" class="text-secondary">' + name + '</a></strong></p><p class="mb-1"><small><a href="#" class="text-secondary">' + brand + '</a></small></p><div class="d-flex mb-3 justify-content-between">' + description + '</div><div class="d-flex justify-content-between"><div class="col px-0"><button class="btn btn-outline-danger btn-block btn_cancel" id="' + id + '" owner="' + owner + '" price="' + price + '">CANCEL SELL<i class="fa fa-shopping-basket" aria-hidden="true"></i></button></div></div></div></div></div>';
            } else {
                product_item = '<div class="col-md-4 mb-3"><div class="card h-100"><div class="d-flex justify-content-between position-absolute w-100"><div class="label-new"><span class="text-white bg-success small d-flex align-items-center px-2 py-1"><i class="fa fa-star" aria-hidden="true"></i><span class="ml-1">' + owner + '</span></span></div><div class="label-sale"><span class="text-white bg-primary small d-flex align-items-center px-2 py-1"><i class="fa fa-tag" aria-hidden="true"></i><span class="ml-1">Sale</span></span></div></div><a href="#"><img src="' + image + '" class="card-img-top" alt="Product"></a><div class="card-body px-2 pb-2 pt-1"><div class="d-flex justify-content-between"><div><p class="h4 text-primary">$ ' + price + '</p></div><div><a href="#" class="text-secondary lead" data-toggle="tooltip" data-placement="left" title="Compare"><i class="fa fa-line-chart" aria-hidden="true"></i></a></div></div><p class="mb-0"><strong><a href="#" class="text-secondary">' + name + '</a></strong></p><p class="mb-1"><small><a href="#" class="text-secondary">' + brand + '</a></small></p><div class="d-flex mb-3 justify-content-between">' + description + '</div><div class="d-flex justify-content-between"><div class="col px-0"><button class="btn btn-outline-danger btn-block btn_sell" id="' + id + '" owner="' + owner + '" price="' + price + '">SELL<i class="fa fa-shopping-basket" aria-hidden="true"></i></button></div></div></div></div></div>';
            }
            $("div#my_products_list").append(product_item);
        }
    });
}

async function fetchAccountBalance() {
    let myAccount = window.accountId;
    let balance = await getAccountBalance(myAccount);
    let available = balance.available;
    let balanceInNear = utils.format.formatNearAmount(available);
    balanceInNear = parseFloat(balanceInNear).toFixed(4);
    console.log(balance);
    $('span#account_balance').text(balanceInNear);
}

async function addProduct() {
    let name = $('input#name').val();
    let description = $('input#description').val();
    let brand = $('input#brand').val();
    let image = $('input#image').val();
    let price = $('input#price').val();
    price = parseInt(price);

    try {
        let isSuccess = await window.contract.addProduct({
            name: name,
            description: description,
            brand: brand,
            image: image,
            price: price
        });

        if (isSuccess) {
            //console.log("product added");
            Swal.fire({
                title: 'DONE!',
                text: 'Product Added!',
                icon: 'success',
                confirmButtonText: 'Cool'
            });
        } else {
            //alert("ERROR when adding product! Please try again...");
            Swal.fire({
                title: 'ERROR!',
                text: 'ERROR when adding product! Please try again...!',
                icon: 'error',
                confirmButtonText: 'Cool'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        }
    } catch (e) {
        Swal.fire({
            title: 'ERROR!',
            text: 'ERROR: ' + e,
            icon: 'error',
            confirmButtonText: 'Cool'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            }
        });
        throw e
    } finally {
        //location.reload();
    }
}

async function buyProduct(productId, receiverAccount, amount) {
    let myAccount = window.accountId;
    //console.log(myAccount);
    let result = await sendToken(myAccount, receiverAccount, amount);
    console.log("result: " + result);
    let transactionStatus = result.status.SuccessValue;

    if (transactionStatus === '') {
        //console.log("status: " + transactionStatus);
        let isSucceed = await contract.buyProduct({ _id: parseInt(productId), _newOwner: myAccount });
        if (isSucceed) {
            //alert("SUCCEED TO BUY PRODUCT!");
            Swal.fire({
                title: 'SUCCESS!',
                text: 'SUCCEED TO BUY PRODUCT!',
                icon: 'success',
                confirmButtonText: 'Cool'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        } else {
            //alert("ERROR!");
            Swal.fire({
                title: 'ERROR!',
                text: 'ERROR when buying product! Please try again...!',
                icon: 'error',
                confirmButtonText: 'Cool'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        }
    } else {
        Swal.fire({
            title: 'ERROR!',
            text: 'ERROR: ' + result,
            icon: 'error',
            confirmButtonText: 'Cool'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            }
        });
    }
}

async function sellProduct(id) {
    let myAccount = window.accountId;
    let productOwner = await contract.getProductOwner({ _id: id });
    if (myAccount === productOwner) {
        let isSellSuccess = await contract.sellProduct({ _id: id, _owner: myAccount });
        if (isSellSuccess) {
            //alert("PRODUCT IS SELLING...");
            Swal.fire({
                title: 'SUCCESS!',
                text: 'PRODUCT IS SELLING...!',
                icon: 'success',
                confirmButtonText: 'Cool'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        } else {
            //alert("ERROR SELLING PRODUCT");
            Swal.fire({
                title: 'ERROR!',
                text: 'ERROR SELLING PRODUCT!',
                icon: 'error',
                confirmButtonText: 'Cool'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        }
    }
}

async function cancelSellProduct(id) {
    let myAccount = window.accountId;
    let productOwner = await contract.getProductOwner({ _id: id });
    if (myAccount === productOwner) {
        let isSellSuccess = await contract.cancelSellProduct({ _id: id, _owner: myAccount });
        if (isSellSuccess) {
            //alert("CANCELED!");
            Swal.fire({
                title: 'SUCCESS!',
                text: 'PRODUCT SELLING IS CANCELED!',
                icon: 'success',
                confirmButtonText: 'Cool'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        } else {
            //alert("ERROR CANCELD SELL PRODUCT");
            Swal.fire({
                title: 'ERROR!',
                text: 'ERROR WHEN CANCEL SELLING PRODUCT!',
                icon: 'error',
                confirmButtonText: 'Cool'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        }
    }
}

$(document).ready(async function() {
    //fetch all products
    await fetchProducs();
    await fetchMyProducs();
    await fetchAccountBalance();

    $('button#submit').click(async function(e) {
        e.preventDefault();
        $(this).html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Confirming...').addClass('disabled');
        await addProduct();
        $(this).text('Submit').removeClass('disabled');
    });

    $('button.btn_buy').click(async function() {

        $(this).html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Confirming...').addClass('disabled');

        let id = $(this).attr("id");
        let owner = $(this).attr("owner");
        let price = $(this).attr("price");
        let priceInNear = utils.format.parseNearAmount(price.toString());
        console.log(id + owner + priceInNear);

        await buyProduct(id, owner, priceInNear);
        $(this).text('BUY').removeClass('disabled');

    });

    $('button.btn_sell').click(async function() {

        $(this).html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Confirming...').addClass('disabled');

        let id = $(this).attr("id");
        id = parseInt(id);
        let owner = $(this).attr("owner");
        let price = $(this).attr("price");
        let priceInNear = utils.format.parseNearAmount(price.toString());
        console.log(id + owner + priceInNear);

        await sellProduct(id, owner);
        $(this).text('CANCEL SELL').removeClass('disabled');

    });

    $('button.btn_cancel').click(async function() {
        $(this).html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Canceling...').addClass('disabled');

        let id = $(this).attr("id");
        id = parseInt(id);
        let owner = $(this).attr("owner");
        let price = $(this).attr("price");
        let priceInNear = utils.format.parseNearAmount(price.toString());
        console.log(id + owner + priceInNear);

        await cancelSellProduct(id, owner);
        $(this).text('SELL').removeClass('disabled');
    });
});

document.querySelector('#sign-in-button').onclick = login
document.querySelector('#sign-out-button').onclick = logout

// Display the signed-out-flow container
function signedOutFlow() {
    document.querySelector('#signed-out-flow').style.display = 'block'
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
    document.querySelector('#signed-in-flow').style.display = 'block'

    document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
        el.innerText = window.accountId
    })

    // populate links in the notification box
    const accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)')
    accountLink.href = accountLink.href + window.accountId
    accountLink.innerText = '@' + window.accountId
    const contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)')
    contractLink.href = contractLink.href + window.contract.contractId
    contractLink.innerText = '@' + window.contract.contractId

    // update with selected networkId
    accountLink.href = accountLink.href.replace('testnet', networkId)
    contractLink.href = contractLink.href.replace('testnet', networkId)
        //fetch greeting

}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
    .then(() => {
        if (window.walletConnection.isSignedIn()) signedInFlow()
        else signedOutFlow()
    })
    .catch(console.error)