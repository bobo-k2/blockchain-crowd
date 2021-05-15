import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  campaignFactory.abi,
  '0x06AFc2c74880EfD4903365b88b92E71a92a3c3d7'
);

export default instance;
