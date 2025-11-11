import React from 'react'

function Button({text, onClick, Icon}) {
  return (
    <button onClick={onClick} className='bg-accent2 px:6 py-1 md:px-12 md:py-2 shadow-lg rounded-lg w-full flex justify-center md:text-lg text-s font-semibold  hover:bg-accent2 transition duration-150 items-center '><span>{Icon && <Icon className="h-4 w-4 md:h-6 md:w-6 mr-2" />}</span>{text}</button>
  )
}

export default Button