import React from 'react';

const MyLoadingComponent = ({ isLoading, error }) => {
  // Handle the loading state
  return (
    <div className='loading-spin'>
      {
        isLoading ?
          'loading.....'
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
