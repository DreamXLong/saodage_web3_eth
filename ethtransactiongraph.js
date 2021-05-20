//wss://mainnet.infura.io/ws/v3/44d1a5fa24b64ab78cec58d729199f02

import { decodeMethod } from "./node_modules/abi-decoder";


// 据说infura的接口不支持filter
var web3 = new Web3('wss://mainnet.infura.io/ws/v3/44d1a5fa24b64ab78cec58d729199f02');

var subscription;
var nodes = [];
var links = [];

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
                        console.log(transaction);
                        // 如果filter不能处理筛选 在这里自行判断合约地址做筛选处理
                        // 自动下单也在这里进行
                        console.log(decodeMethod(transaction.input));
                        
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

/**
 * 统统不需要  都是图形化创建 以及节点点击处理
 */
var track = {}

function createNode(from, to) {

    if (!(from in track)) {
        track[from] = nodes.length;
        nodes.push({ id: from });
    }

    if (!(to in track)) {
        track[to] = nodes.length;
        nodes.push({ id: to });
    }

    links.push({ source: nodes[track[from]], target: nodes[track[to]] });

    restart();
}

//Crazy d3.js code. I don't claim to understand it...
var width = 960;
var height = 960;
var color = d3.scaleOrdinal(d3.schemeCategory20);

var svg = d3.select("#graph").append("svg")
    .attr("id", "playgraph")
    //better to keep the viewBox dimensions with variables
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet");

var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-10))
    .force("link", d3.forceLink(links).distance(20))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .alphaTarget(1)
    .on("tick", ticked);

var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
    link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
    node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

function restart() {

    // Apply the general update pattern to the nodes.
    node = node.data(nodes, function (d) { return d.id; });
    node.exit().remove();
    node = node.enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", function (d) { return color(Math.random()); })
        .on('click', function (d) {
            document.getElementById("output").innerHTML = '<a href="https://etherscan.io/address/' + d.id + '" target="_blank">' + d.id + '</a>';
        })
        .merge(node);

    // Apply the general update pattern to the links.
    link = link.data(links, function (d) { return d.source.id + "-" + d.target.id; });
    link.exit().remove();
    link = link.enter().append("line").merge(link);

    // Update and restart the simulation.
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
}

function ticked() {
    node.attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })

    link.attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });
}
