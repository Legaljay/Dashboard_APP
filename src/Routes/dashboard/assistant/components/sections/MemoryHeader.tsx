import React from 'react';

const MemoryHeader = React.memo(() => (
  <>
    <h2 className="text-2xl text-BLACK-_100 font-medium">Memory</h2>
    <p className="font-normal text-xs text-[#7F7F81] pb-8 mt-2">
      Upload necessary company documents to your Assistant's memory so it can
      learn all the basics about your business.
      <br />
      Don't worry, your digital assistant has 100% retention and recollection
      so you only upload once, and you can add or delete documents anytime.
    </p>
  </>
));

MemoryHeader.displayName = 'MemoryHeader';

export default MemoryHeader;
