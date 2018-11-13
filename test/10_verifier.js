// Copyright (c) 2017 Sweetbridge Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global web3 */

var Verifier = artifacts.require('Verifier')

contract('Verifier', function (accounts) {
  let verifier
  const privateKey = '0xfdb2886b1ff5a0e60f9a4684e385aa7b77f064730304143f08ba96ca1a17effa' // accounts[0]

  before(async () => {
    verifier = await Verifier.deployed()
  })

  it('checks the validity of a hash', async () => {
    const message = web3.utils.soliditySha3(accounts[0], accounts[1], web3.utils.toBN(10000), accounts[2]).substr(2)
    const web3Hash = web3.utils.keccak256('\x19Ethereum Signed Message:\n' + message.length + message)
    const signedMessage = web3.eth.accounts.sign(message, privateKey);
    assert.equal(signedMessage.messageHash, web3Hash)

    const signedHash = await verifier.getSignedHash(message)
    assert.equal(signedMessage.messageHash, signedHash)

    const signer = await verifier.verifyString(message, signedMessage.v, signedMessage.r, signedMessage.s)
    assert.equal(signer, accounts[0])
  })

  it('gets the address from transfer params', async () => {
    const message = web3.utils.soliditySha3(accounts[1], web3.utils.toBN(10000), accounts[2])
    const sig = web3.eth.accounts.sign(message, privateKey);
    const sender = await verifier.verifyTransfer(accounts[1], web3.utils.toBN(10000), accounts[2], sig.v, sig.r, sig.s)
    assert.equal(sender, accounts[0])
  })

})
