import React from 'react';

interface Props{
  className?: string
}


function RcTable({className}: Props): React.ReactElement<Props>{
  return (
    <div className={`${className}`}>

    </div>
  )
}
