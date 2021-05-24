//wss://mainnet.infura.io/ws/v3/44d1a5fa24b64ab78cec58d729199f02        6d94a723b7634ec89deedc79e1fd3085        
//6979d4e7d72e4ad1aed60101add94e21        76b241a0bd3949d69135d14c43696d5f

// const abiDecoder = require('abi-decoder');

// import abi-decoder from "abi-decoder";
{/* <script type="module" src="./abi-decoder/index.js"></script> */}
const UniV2Router02ABI = require('./abi/UniswapV2Router02.json');
const abiDecoder = require("./index.js");
abiDecoder.addABI(UniV2Router02ABI);

const Web3 = require('web3');

// 据说infura的接口不支持filter
var web3 = new Web3('wss://mainnet.infura.io/ws/v3/76b241a0bd3949d69135d14c43696d5f');

var subscription;

web3.eth.getTransactionReceipt("0x4d01e0b86bdf6c2de3a86f5786f9bf0ac4314099b249c57f309030521e9bfc44", function(e, receipt) {
    const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
    console.log(receipt.logs);
  });

/**
 * @method 解析inputData
 * @param {inputData} hex 0xfb3bdb4100000000000000000000000000000000000000000000000098a7d9b8314c00000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000dd43466b645df5ea9c789d34fc791cd65978d6a90000000000000000000000000000000000000000000000000000000060a9f82f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000002d5bed63b0fe325ed3b865ae2cdaa3649eb25461
 */
 function methodDecode(hex){
    var decodedData = abiDecoder.decodeMethod(hex);
    return decodedData;
}
methodDecode("0xfb3bdb4100000000000000000000000000000000000000000000000098a7d9b8314c00000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000dd43466b645df5ea9c789d34fc791cd65978d6a90000000000000000000000000000000000000000000000000000000060a9f82f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000002d5bed63b0fe325ed3b865ae2cdaa3649eb25461");

function start() {
    console.log("Starting...")
    var output = document.getElementById('output')
    //注册全网pending节点
    subscription = web3.eth.subscribe('pendingTransactions', function (error, result) {
    })
        // 取data
        .on("data", function (transactionHash) {
            web3.eth.getTransaction(transactionHash)
            // 取交易信息
                .then(function (transaction) {
                    if (transaction) {
                        // 如果filter不能处理筛选 在这里自行判断合约地址做筛选处理
                        // 自动下单也在这里进行
                        console.log(abiDecoder.decodeMethod(transaction.input));
                        
                        // 创建图形化节点  不需要
                        // createNode(transaction.from, transaction.to);
                        
                    }
                });
        })
    
}

function stop() {
    console.log("Stopping...")
    // unsubscribes the subscription
    subscription.unsubscribe(function (error, success) {
        if (success)
            console.log('Successfully unsubscribed!');
    });


}