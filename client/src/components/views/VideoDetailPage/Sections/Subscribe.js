import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Subscribe = (props) => {
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    axios
      .get('/api/subscribe/subscribeNumber', {
        params: { userTo: props.userTo },
      })
      .then((response) => {
        if (response.data.success) {
          setSubscribeNumber(response.data.subscribeNumber);
        } else {
          alert('Failed to get subscribe number.');
        }
      });

    const subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };
    axios
      .post('/api/subscribe/subscribed', subscribedVariable)
      .then((response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert('Failed to get subscribe information');
        }
      });
  }, []);

  const onSubscribe = (e) => {
    let subscribeVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };
    // if it is already subscribed, unsubscribe
    if (subscribed) {
      axios
        .post('/api/subscribe/unSubscribe', subscribeVariable)
        .then((response) => {
          if (response.data.success) {
            setSubscribeNumber(subscribeNumber - 1);
            setSubscribed(!subscribed);
          } else {
            console.log(response.data.err);
            alert('Failed to unsubscribe.');
          }
        });
      // subscribe
    } else {
      axios
        .post('/api/subscribe/subscribe', subscribeVariable)
        .then((response) => {
          if (response.data.success) {
            setSubscribeNumber(subscribeNumber + 1);
            setSubscribed(!subscribed);
          } else {
            console.log(response.data.err);
            alert('Failed to subscribe.');
          }
        });
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${subscribed ? '#AAAAAA' : '#CC0000'}`,
          color: 'white',
          padding: '10px 16px',
          fontWeight: '500',
          borderRadius: '4px',
          fontSize: '1rem',
          textTransform: 'uppercase',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={onSubscribe}
      >
        {subscribeNumber} {subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
};

export default Subscribe;
