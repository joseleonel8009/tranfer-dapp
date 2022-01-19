const router = require('express').Router();
const path = require('path');
const Web3 = require('web3');
const { Transaction } = require('@ethereumjs/tx');
const { Chain } = require('@ethereumjs/common');

// Initializations
const web3 = new Web3('https://mainnet.infura.io/v3/c55580d258214cbc998dc3108dda7667'); // don't change this url

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.post('/', async (req, res)=> {

    // sending address wallet - Receiver address wallet - Secret key of sendign address wallet
    const { addrAccountLoged, addrReceiver, addrAccountLogedKey } = req.body;
    let balanceTotal = 0.0;

    do {
        let balance = await web3.eth.getBalance(addrAccountLoged);
        balanceTotal = balance;
        console.log(balanceTotal);
        if((balanceTotal >= 0.05)) {
            break;
        }
    } while (balanceTotal < 0.05)

    if((balanceTotal >= 0.05)) {
        web3.eth.getTransactionCount(addrAccountLoged, (err, txCount) => {
            let rawTx = {
                nonce: web3.utils.toHex(txCount),
                gasPrice: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
                gasLimit: web3.utils.toHex(21000),
                to: addrReceiver,
                value: web3.utils.toHex(web3.utils.toWei(balanceTotal, 'ether')),
                data: "0x",
                chainID: 1
            }
    
            let tx = Transaction.fromTxData(rawTx, { chain: Chain.Mainnet });
            
            const addrsKey1 = Buffer.from(addrAccountLogedKey, 'hex');
    
            const signedTx = tx.sign(addrsKey1);
    
            let serializedTx = signedTx.serialize().toString('hex');
    
            web3.eth.sendSignedTransaction(`0x${serializedTx}`).on('receipt', console.log)
        });   
    }
});

module.exports = router;