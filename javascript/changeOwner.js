/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');


async function main( params ) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');
        const key = params.key
        //const newOwner = params.owner
        const newEmpCount = params.empCount

        //new lines for project
        const companyReputation = params.companyReputation
        const cashin = params.flowIn
        const cashout = params.flowOut
        const newType = params.type
        const newCountry = params.country
        const newName = params.name


        // Submit the specified transaction.
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        
        //can be done by any appUser
        await contract.submitTransaction('changeCarOwner', `${ key }`, `${ newEmpCount }`)
        console.log('Change EmpCount Transaction has been submitted'); //DONE in contract
        
        await contract.submitTransaction('changeCompanyType', `${ key }`, `${ newType }`)
        console.log('Change EmpCount Transaction has been submitted'); 

        await contract.submitTransaction('changeCompanyCountry', `${ key }`, `${ newCountry }`)
        console.log('Change EmpCount Transaction has been submitted'); 

        await contract.submitTransaction('changeCompanyName', `${ key }`, `${ newName }`)
        console.log('Change EmpCount Transaction has been submitted'); 
        
        //only be done by admin
        await contract.submitTransaction('changeCompanyReputation', `${ key }`, `${ companyReputation }`)
        console.log('Change Company Reputation Transaction has been submitted');

        await contract.submitTransaction('changeCashIn', `${ key }`, `${ cashin }`)
        console.log('Change Cash In Transaction has been submitted');

        await contract.submitTransaction('changeCashOut', `${ key }`, `${ cashout }`)
        console.log('Change Cash Out Transaction has been submitted');


        // Disconnect from the gateway.
        await gateway.disconnect();

    } 
    catch (error) {
        console.error(`Failed to change owner transaction: ${error}`);
        process.exit(1);
    }
}

// main();
module.exports = { main }
