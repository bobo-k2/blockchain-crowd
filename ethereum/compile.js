const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'campaign.sol');
const source = fs.readFileSync(campaignPath, 'UTF-8');

var compilerInput = {
  language: 'Solidity',
  sources: {
    'campaign.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

const compilerResult = JSON.parse(solc.compile(JSON.stringify(compilerInput)));
 
const result = {
  //campaignBytecode: compilerResult.contracts['campaign.sol']['Campaign'].evm.bytecode.object,
  Campaign: compilerResult.contracts['campaign.sol']['Campaign'],
  //factoryBytecode: compilerResult.contracts['campaign.sol']['CampaignFactory'].evm.bytecode.object,
  CampaignFactory: compilerResult.contracts['campaign.sol']['CampaignFactory']
};

fs.ensureDirSync(buildPath);

for (let contract in result) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + '.json'),
    result[contract]
  );
}

