import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import web3 from '../ethereum/web3'; 
import Campaign from '../ethereum/campaign';

const RequestRow = (props) => {
  const { Row, Cell } = Table;
  const { id, request, approversCount} = props;
  const readyToFinalize = request.approvalCount > approversCount / 2;

  const onApprove = async () => {
    await executeOnBlockchain('approveRequest');
  }

  const onFinalize = async () => {
    await executeOnBlockchain('finalizeRequest');
  }

  const executeOnBlockchain = async (method) => {
    const campaign = Campaign(props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods[method](id)
      .send({
        from: accounts[0]
      });
  }

  return (
    <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell textAlign='right'>
        {web3.utils.fromWei(request.value, 'ether')}
      </Cell>
      <Cell>{request.recipient}</Cell>
      <Cell textAlign='right'>
        {request.approvalCount} / {approversCount}
      </Cell>
      <Cell>
        { !request.complete &&
          <Button basic color='green' onClick={onApprove}>Approve</Button>
        } 
      </Cell>
      <Cell>
        { !request.complete && readyToFinalize &&
          <Button color='teal' basic onClick={onFinalize}>Finalize</Button>
        }
      </Cell>
    </Row>
  );
}

export default RequestRow;