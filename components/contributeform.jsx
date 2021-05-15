import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Router } from '../routes';
import Camapign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const ContributeForm = (props) => {
  const [contribution, setContribution] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const contribute = async (event) => {
    event.preventDefault();
    
    setErrorMessage('');
    setLoading(true);
    const campaign = Camapign(props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(contribution, 'ether')
        });
      // refresh page
      Router.replaceRoute(`/campaigns/${props.address}`);
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
    setContribution('');
  }

  return (
    <Form onSubmit={contribute} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={contribution}
          onChange={event => setContribution(event.target.value)}
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button primary loading={loading}>
        Contribute
      </Button>
    </Form>
  )
}

export default ContributeForm