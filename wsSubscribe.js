var fs = require('fs');
const WebSocket = require('ws');

// Enterprise users can follow line 5-12 to use wss://eth.feed.blxrbdn.com:28333
// const ws = new WebSocket(
//   'wss://eth.feed.blxrbdn.com:28333', 
//   {
//     cert: fs.readFileSync('/usr/bloxroute/certificate/external_gateway/registration_only/external_gateway_cert.pem'),
//     key: fs.readFileSync('/usr/bloxroute/certificate/external_gateway/registration_only/external_gateway_key.pem'),
//     rejectUnauthorized: false,
//   }
// );

//  Non Enterprise users should follow line 15-23 to use wss://api.blxrbdn.com/ws
 const ws = new WebSocket(
   "wss://39.106.255.190/ws", 
   {
     timeout: 120 * 60 * 1000,
     headers: { 
       "Authorization" : "NWMwMDJlODMtMTM5Yi00Y2U0LTk5MGYtOWM4MjE2M2U1NDcxOjNjY2EwOTNjNDU2YTdkYzJlODVlZDFkMzgwYzE4ZDRi" 
     },
     rejectUnauthorized: false,
   }
 );

function proceed() {
    ws.send(`{"jsonrpc": "2.0", "id": 1, "method": "subscribe", "params": ["newTxs", {"include": ["tx_hash"],"filters": "from = 0x0cec4474E6B78e2703dcaAe57De283F96a34614e"}]}`);

}

function errorHandle(err) {
    console.log(err);
}


function handle(nextNotification) {
    console.log(nextNotification.toString()); // or process it generally
}

ws.on('open', proceed);
ws.on('message', handle);
ws.on('error',errorHandle);

//----------------------------------------
var Web3 = require('web3');
var web3 = new Web3('wss://mainnet.infura.io/ws');
// 创建实例，如果在支持以太坊的浏览器 "Web3.providers.givenProvider" 会被设置。
// var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
//请求正在pending的交易
var subscription = web3.eth.subscribe('pendingTransactions', function(error, result){
  if (!error)
      console.log(result);
})
.on("data", function (transactionHash) {
  web3.eth.getTransaction(transactionHash)
      .then(function (transaction) {
          if (transaction) {
              console.log(transaction);
              // createNode(transaction.from, transaction.to);
          }
      });
})


// 取消订阅
subscription.unsubscribe(function(error, success){
  if(success)
      console.log('Successfully unsubscribed!');
});