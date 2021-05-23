
var http = require('http');
var fs = require('fs');
var url = require('url');
var Web3 = require('web3');

//wss://mainnet.infura.io/ws/v3/44d1a5fa24b64ab78cec58d729199f02        6d94a723b7634ec89deedc79e1fd3085        
//6979d4e7d72e4ad1aed60101add94e21        76b241a0bd3949d69135d14c43696d5f      373e6684583a4451a6253329fb9d270e

// const abiDecoder = require('abi-decoder');

// import abi-decoder from "abi-decoder";
{/* <script type="module" src="./abi-decoder/index.js"></script> */}

// 据说infura的接口不支持filter
var web3 = new Web3('wss://mainnet.infura.io/ws/v3/373e6684583a4451a6253329fb9d270e');

var subscription;
var transactionJson;

function start() {
    console.log("Starting...")
    //注册全网pending节点
    subscription = web3.eth.subscribe('pendingTransactions', function (error, result) {
    })
        // 取data
        .on("data", function (transactionHash) {
            web3.eth.getTransaction(transactionHash)
            // 取交易信息
                .then(function (transaction) {
                    if (transaction) {
                        transactionJson = transaction.input;
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

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8080 });
 
wss.on("connection", function(socket) {
    socket.on("message", function(msg) {
       console.log(msg); 
       subscription = web3.eth.subscribe('pendingTransactions', function (error, result) {
    })
        // 取data
        .on("data", function (transactionHash) {
            web3.eth.getTransaction(transactionHash)
            // 取交易信息
                .then(function (transaction) {
                    if (transaction) {
                        transactionJson = transaction.input;
                        // 如果filter不能处理筛选 在这里自行判断合约地址做筛选处理
                        // 自动下单也在这里进行
                        // console.log(abiDecoder.decodeMethod(transaction.input));
                        socket.send(transactionJson);
                        // 创建图形化节点  不需要
                        // createNode(transaction.from, transaction.to);
                        
                    }
                });
        })
       
    });
});
 