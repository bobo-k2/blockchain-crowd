import React from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/layout';
import Campaign from '../../ethereum/campaign';
import ContributeForm from '../../components/contributeform';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

const CampaignShow = (props) => {
  const renderCards = () => {
    const items = [
      {
        header: props.manager,
        meta: 'Address of manager',
        description: 'The manager created this campaign and can create requests to withdraw money.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: props.minimumContribution,
        meta: 'Minimum contorbution (wei)',
        description: 'You must contiribute at lease this much wei to became an approver.'
      },
      {
        header: props.requestCount,
        meta: 'Number of requests',
        description: 'A request tries to withdraw money from the contract. The request must be approved by approvers.'
      },
      {
        header: props.approversCount,
        meta: 'Number of approvers',
        description: 'Number of people who already donated to this campaign,'
      },
      {
        header: web3.utils.fromWei(props.balance, 'ether'),
        meta: 'Campaign balance (ether)',
        description: 'The balance is how much money this campaign has to spent.'
      }
    ]

    return <Card.Group items={items} />
  }

  return (
    <Layout>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            {renderCards()}
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={props.address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(props) {
  const campaign = Campaign(props.query.address);
  const summary = await campaign.methods.getSummary().call();
  
  return {
    props : {
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      address: props.query.address
    }
  };
}

export default CampaignShow;