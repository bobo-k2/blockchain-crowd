import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import Layout from '../../../components/layout';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/requestrow';

const RequestIndex = (props) => {
  const { Header, Row, HeaderCell, Body} = Table;

  const renderRows = () => {
    const requests = JSON.parse(props.requests);
    return requests.map((request, index) => {
      return <RequestRow
        key={index}
        request={request}
        address={props.address}
        id = {index}
        approversCount={props.approversCount}
      />
    })
  }

  return(
    <Layout>
      <h3>Requests</h3>
      <Link route={`/campaigns/${props.address}/requests/new`}>
        <a>
          <Button primary floated='right' style={{ marginBottom: 10 }}>Add Request</Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>Id</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {renderRows()}
        </Body>
      </Table>
      <div>
        Found {props.requestCount} requests.
      </div>
    </Layout>
  )
}

export async function getServerSideProps(props) {
  const campaignAddress = props.query.address; 
  const campaign = Campaign(campaignAddress);

  const requestCount = await campaign.methods.requestCount().call();
  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((_, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  const approversCount = await campaign.methods
      .approversCount()
      .call();

  return {
    props : {
      address: campaignAddress,
      requests: JSON.stringify(requests),
      approversCount,
      requestCount
    }
  };
}

export default RequestIndex;