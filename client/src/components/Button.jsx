import React from 'react';
import { Link } from 'react-router-dom';

function Button({ text, onClick, Icon, link }) {
  return (
    <Link
      to={link}
      onClick={onClick}
      className="px:6 text-s flex w-full items-center justify-center rounded-lg bg-accent2 py-1 font-semibold shadow-lg transition duration-150 hover:bg-accent2 md:px-12 md:py-2 md:text-lg"
    >
      <span>{Icon && <Icon className="mr-2 h-4 w-4 md:h-6 md:w-6" />}</span>
      {text}
    </Link>
  );
}

export default Button;
