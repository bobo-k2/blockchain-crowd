import React, { useState } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Layout from '../../../components/layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';

const RequestNew = (props) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [recepient, setRecepient] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const requestsRoute = `/campaigns/${props.address}/requests`;

  const createRequest = async (event) => {
    event.preventDefault();
    
    setLoading(true);
    setErrorMessage('');
    const campaign = Campaign(props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(value, 'ether'),
          recepient
        )
        .send({
          from: accounts[0]
        });
      Router.pushRoute(requestsRoute)
    } catch (err) {
       setErrorMessage(err.message);
    }

    setLoading(false);
  }

  return (
    <Layout>
      <Link route={requestsRoute}>
        <a>Back</a>
      </Link>
      <h3>Create a new request</h3>
      <Form onSubmit={createRequest} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={event => setDescription(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recepient</label>
          <Input
            value={recepient}
            onChange={event => setRecepient(event.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>Create</Button>
      </Form>
    </Layout>
  )
}

export async function getServerSideProps(props) {
  return {
    props : {
      address: props.query.address
    }
  };
}

export default RequestNew;