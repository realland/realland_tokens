# RealLand ICO Contract

## Disclaimer

These smart contracts are provided without any implied or expressed warranty.

I take no responsibility for your implementation decisions and any security problem you might experience.

These contracts should be thoroughly audited by one or more independent third parties before being used to store or transmit any value.

## Testing

These contracts have been developed using the Truffle framework:  
https://github.com/trufflesuite/truffle

To test, you can:

1. Run `testrpc` (see https://github.com/ethereumjs/testrpc).
1. Run `truffle test`

Note - for test cases to run correctly, testrpc has to be run with the following parameters:  
```
testrpc --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e1c, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e11, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e12, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e13, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e14, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e15, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e16, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e17, 100000000000000000000000000"
```

Expected output from test is:
```
Using network 'development'.

Compiling ./contracts/Migrations.sol...
Compiling ./contracts/MiniMeToken.sol...
Compiling ./contracts/ProfitSharing.sol...
Compiling ./contracts/RealLandCrowdSale.sol...
Compiling ./contracts/RealLandToken.sol...
Compiling ./contracts/mock/RealLandCrowdSaleMock.sol...
Compiling zeppelin-solidity/contracts/math/SafeMath.sol...
Compiling zeppelin-solidity/contracts/ownership/Ownable.sol...

  Contract: Check ICO Initialisation
    ✓ 0. check initial settings (57ms)

  Contract: Check ICO Sale
    ✓ 0. send some contributions (395ms)
    ✓ 1. send some more contributions (122ms)
    ✓ 2. end sale and check owner allocations (216ms)
    ✓ 3. check token allocations can only be run once

  Contract: Check ICO Sale
    ✓ 0. check can't contribute before sale starts
    ✓ 1. move to sale, check min. contribution (92ms)
    ✓ 2. check week 1 bonus - 25% (333ms)
    ✓ 3. check week 1 cap - 1000000 (140ms)
    ✓ 4. check week 2 bonus - 22% (113ms)
    ✓ 5. check week 3 bonus - 20% (105ms)
    ✓ 6. check week 7 bonus and cap - 7% / 24000000 (244ms)
    ✓ 7. check  can't transfer / approve tokens during the sale (56ms)
    ✓ 8. check can't contribute after sale (38ms)
    ✓ 9. check can now transfer / approve (224ms)


  15 passing (2s)
```

## Deployment

Contracts can be deployed using the Truffle framework. Modify `truffle.js` as appropriate, then run:  
`truffle migrate --reset`

Expected output from deployment is:
```
Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0xf5d302c8845cb032c50270c453b6c907c8d92adaa579ebd24c9afa90779eaa42
  Migrations: 0x500ba705c659df68e1bb2d386234fe25aabcbe83
Saving successful migration to network...
  ... 0xe791a8012b64811ab42adf6bed767b8b83da11663a0c4c733ff43072238c43f6
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying MiniMeTokenFactory...
  ... 0xa5cfa94918b89f79c7cfe958ff1e7aa43c8378463a754d4172c54f6f18634240
  MiniMeTokenFactory: 0xdd4a482f61e4557c563cd612da6d5100fb3c86f6
  Deploying RealLandToken...
  ... 0x14564ad3cd16a072c99d6d68b9fcbc46979e043e41daa1acb280d5a0e5853314
  RealLandToken: 0xa45900d3f8a19af90269e56cf11e95a621f0cbf1
  Deploying RealLandCrowdSaleMock...
  ... 0x64063583e2b59c6e2bf3a5276fa966d391ed57d65263049be488e5c266233847
  RealLandCrowdSaleMock: 0x4e50a111117851a179061c5fecd27f62b2775073
  ... 0xaafe546f722b905326b3b1d92317658b6bca7ae8511b8ea045604ba72fa1d0e6
  Deploying ProfitSharing...
  ... 0xef2669ac1d598a00fdf62d7aa4a05dde9bd8cc7148a0bd7db51bc51d710c2fd1
  ProfitSharing: 0xd88cbcb0bbd288eea7d9a84cbbebe611064a16b9
Saving successful migration to network...
  ... 0x82234440a55cb84d913ac7d20b9f57553bff937fab09ea5d314642a920df70a8
Saving artifacts...
```
