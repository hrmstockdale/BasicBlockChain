const crypto = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    };


    calculateHash(){
        return crypto(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
};

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "23/04/2019", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock); // in reality much more difficult to add a Block (far more levels of authentication)
    }

// method to to verify integrity of the chain
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let hankCoin = new Blockchain();
hankCoin.addBlock(new Block(1, "24/04/2019", {amount: 1}));
hankCoin.addBlock(new Block(2, "25/04/2019", {amount: 1.3}));

// check if block chain is valid (integral throughout)
console.log('Is blockChain valid? ' + hankCoin.isChainValid());

console.log(JSON.stringify(hankCoin, null, 4));









/*
{
    "chain": [
        {
            "index": 0,
            "timestamp": "23/04/2019",
            "data": "Genesis block",
            "previousHash": "0",
            "hash": "3959e3e5c5f2b746d03aeee3ec33e9384b94ac8e09e9112fdb21086f36ad851c"
        },
        {
            "index": 1,
            "timestamp": "24/04/2019",
            "data": {
                "amount": 1
            },
            "previousHash": "3959e3e5c5f2b746d03aeee3ec33e9384b94ac8e09e9112fdb21086f36ad851c",
            "hash": "d6dbb74216a77678536376205ef9e670002eeae2a0ac6b17a5fc145b077991a1"
        },
        {
            "index": 2,
            "timestamp": "25/04/2019",
            "data": {
                "amount": 1.3
            },
            "previousHash": "d6dbb74216a77678536376205ef9e670002eeae2a0ac6b17a5fc145b077991a1",
            "hash": "e1ae57396de6be65b7629e2be87e7b0619b445ebcc029b6987b30cf596d4ceeb"
        }
    ]
}
*/