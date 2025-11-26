import React from 'react';
import { Link } from 'react-router-dom';

function Button({
  text,
  onClick,
  Icon,
  link,
  className = '',
  iconClassName = '',
  type = 'button',
  disabled = false,
}) {
  const baseClasses = `
    inline-flex items-center justify-center 
    rounded-lg bg-accent2 
    px-6 py-2 text-sm font-semibold text-white
    shadow-lg transition duration-150 
    hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    md:px-8 md:text-base
    ${className}
  `;

  const iconFinalClasses = `mr-2 h-4 w-4 md:h-5 md:w-5 ${iconClassName}`;
  const content = (
    <>
      {Icon && <Icon className={iconFinalClasses} />}
      {text}
    </>
  );

  if (link && !disabled) {
    return (
      <Link to={link} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses} disabled={disabled}>
      {content}
    </button>
  );
}

export default Button;
