const Web3 = require('web3')
const web3 = new Web3('http://localhost:8545')



async function main() {
  console.log( await web3.eth.getAccounts())

}

main()
.then(console.log)
.catch(console.error)
