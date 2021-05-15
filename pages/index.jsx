import React from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/layout';
import { Link } from '../routes';

const CampaignIndex = ({ campaigns }) => {
  const renderCampaings = () => {
    const items = campaigns.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
          ),
        fluid: true
      }
    });

    return <Card.Group items={items} />
  }

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link route='/campaigns/new'>
          <a>
            <Button
              content="Create Campaign"
              icon="add circle"
              primary
              floated="right"
            />
          </a>
        </Link>
        {renderCampaings()}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const campaigns = await factory.methods
      .getDeployedContracts()
      .call();
    
    return {
      props : {
        campaigns
      }
    };
}

export default CampaignIndex;