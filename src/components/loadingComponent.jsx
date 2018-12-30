import React from 'react';
import { CircularProgress } from '@material-ui/core';

const MyLoadingComponent = ({ isLoading, error }) => {
  // Handle the loading state
  return (
    <div style={{ textAlign: 'center' }}>
      {
        isLoading ?
          <CircularProgress style={{ margin: '20px' }}/>
          :
          error ?
            <div>Sorry, there was a problem loading the page.</div>
            :
            null
      }
    </div>
  );
};

export default MyLoadingComponent;
