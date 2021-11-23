import 'regenerator-runtime/runtime'
import { utils } from 'near-api-js';
import { initContract, login, logout, sendToken, getAccountBalance } from './utils'
import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

async function fetchMyNFTs() {
    $('div#my_nfts_list').empty();
    let myAccount = window.accountId;
    let nfts = await contract.getAllNFTsByOwner({ accountId: myAccount });

    console.log(nfts);

    nfts.forEach((nft) => {
        let id = nft.id;
        let owner = nft.owner;
        let metadata = nft.metadata;
        let title = metadata.title;
        let description = metadata.description;
        let media = metadata.media;

        let nft_item = '<div class="col-md-4 mb-3"><div class="card h-100"><div class="d-flex justify-content-between position-absolute w-100"><div class="label-new"><span class="text-white bg-success small d-flex align-items-center px-2 py-1"><i class="fa fa-star" aria-hidden="true"></i><span class="ml-1">' + owner + '</span></span></div><div class="label-sale"><span class="text-white bg-primary small d-flex align-items-center px-2 py-1"><i class="fa fa-tag" aria-hidden="true"></i><span class="ml-1">SPECIAL</span></span></div></div><a href="#"><img src="' + media + '" class="card-img-top" alt="Product"></a><div class="card-body px-2 pb-2 pt-1"><div class="d-flex justify-content-between"><div><p class="h4 text-primary"> ' + title + '</p></div><div><a href="#" class="text-secondary lead" data-toggle="tooltip" data-placement="left" title="Compare"><i class="fa fa-line-chart" aria-hidden="true"></i></a></div></div><p class="mb-0"><strong><a href="#" class="text-secondary">ID: ' + id + '</a></strong></p><div class="d-flex mb-3 justify-content-between">' + description + '</div><div class="d-flex justify-content-between"><div class="col px-0"><button class="btn btn-outline-primary btn-block btn_transfer" id="' + id + '" owner="' + owner + '"  data-toggle="modal" data-target="#myModal">TRANSFER<i class="fa fa-shopping-basket" aria-hidden="true"></i></button></div></div></div></div></div>';
        $("div#my_nfts_list").append(nft_item);
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

async function mintNewNFT() {
    let receiver = $('input#receiver').val();
    let title = $('input#title').val();
    let description = $('input#description').val();
    let media = $('input#media').val();
    let copies = $('input#copies').val();
    //copies = parseInt(copies);

    try {
        let isSuccess = await window.contract.mintNewNFT({
            receiver: receiver,
            title: title,
            description: description,
            media: media
        });

        if (isSuccess) {
            //console.log("new NFT minted");
            Swal.fire({
                title: 'DONE!',
                text: 'New NFT Minted!',
                icon: 'success',
                confirmButtonText: 'Cool'
            });
        } else {
            //alert("ERROR when minting NFT! Please try again...");
            Swal.fire({
                title: 'ERROR!',
                text: 'ERROR when minting NFT Please try again...!',
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

async function transferNFT(receiver, nft_id) {
    let myAccount = window.accountId;
    let isSuccess = await contract.transferNFT({ receiver: receiver, tokenId: nft_id });

    if (isSuccess) {
        //alert("NFT TRANSFERED!");
        Swal.fire({
            title: 'SUCCESS!',
            text: 'NFT TRANSFERED!',
            icon: 'success',
            confirmButtonText: 'Cool'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            }
        });

    } else {
        //alert("ERROR TRANSFERING PRODUCT!");
        Swal.fire({
            title: 'ERROR!',
            text: 'ERROR TRANSFERING PRODUCT!',
            icon: 'error',
            confirmButtonText: 'Cool'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            }
        });
    }
}

$(document).ready(async function() {
    //fetch all products
    await fetchMyNFTs();
    await fetchAccountBalance();

    $('button#submit').click(async function(e) {
        e.preventDefault();
        $(this).html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Confirming...').addClass('disabled');
        await mintNewNFT();
        $(this).text('Submit').removeClass('disabled');
    });

    $('button.btn_transfer').click(function() {
        let id = $(this).attr("id");
        $('p#transfer_nft_id').text(id);
    });

    $('button#btn_confirm_transfer').click(async function() {
        let receiver_id = $('input#transfer_receiver').val();
        let token_id = $('p#transfer_nft_id').text();
        //token_id = parseInt(token_id);

        let isSuccess = await window.contract.transferNFT({ receiver: receiver_id, tokenId: token_id });

        if (isSuccess) {
            //console.log("nft transfered!");
            Swal.fire({
                title: 'DONE!',
                text: 'NFT TRANSFERED!',
                icon: 'success',
                confirmButtonText: 'Cool'
            });
        } else {
            //alert("ERROR when transfering NFT! Please try again...");
            Swal.fire({
                title: 'ERROR!',
                text: 'ERROR when transfering NFT! Please try again...!',
                icon: 'error',
                confirmButtonText: 'Cool'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        }
    })

    $('button#btn_test').click(async function() {
        let rs1 = await window.contract.getNFTOwner({ tokenId: '2' });
        let rs2 = await window.contract.getNFTMetaData({ tokenId: '2' });
        let rs3 = await window.contract.getAllNFTsByOwner({ accountId: 'madlife.testnet' });

        console.log(rs1);
        console.log(rs2);
        console.log(rs3);
        alert(rs1);
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