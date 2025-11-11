import React from 'react';

function Splitter({ title = 'Titolo' }) {
  return (
    <div className="mb-4">
      <div className="flex flex-col justify-start p-3 text-3xl font-bold text-accent1 shadow-md">
        <span>{title}</span>
      </div>
      <div className="h-0.5 w-full bg-mySecondary"></div>
    </div>
  );
}

export default Splitter;
