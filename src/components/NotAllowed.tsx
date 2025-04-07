import React from 'react';

const NotAllowed = () => {
  return (
    <p className="flex select-none justify-center items-center h-9/12 text-red-600 text-2xl cursor-not-allowed">
      Not Allowed 
      <i className="ml-2 fa fa-ban" aria-hidden="true" />
    </p>
  );
};

export default NotAllowed;
