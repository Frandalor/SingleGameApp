import React, { useState } from 'react'


const slides = [
  'https://images.unsplash.com/photo-1746333253387-5aac26260c96?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774',
  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1023',
  'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870'
];

function HomeCarouselDeiPoveri() {
    const [current, setCurrent]= useState(0)

    const currentImageSrc = slides[current]

    const goForward = () => {
       if(current === slides.length-1){
        setCurrent(0)
        }else{
            setCurrent((oldCurrent)=>{
                return oldCurrent + 1
            })
        }
       }
    
    const goBack = () => {
      if(current===0){
        setCurrent(slides.length-1)
      } else {
        setCurrent((oldCurrent)=>{
            return oldCurrent - 1
        })
        
      }
    }

  return (
    <>
    <div className='carousel flex relative h-[250px] md:h-[500px] w-full rounded-lg object-cover'>

      {slides.map((img, ind)=> 
        <img key={ind} src={img} alt="" className='carousel-item w-full object-cover' />
      )}

        <div className=' absolute inset-0 text-white text-xxl z-20 hidden md:flex items-center justify-between [&>button]:p-4 hover:opacity-100 opacity-50'>
        <button onClick={goBack}>&#8592;</button>
        <button onClick={goForward}>&#8594;</button>
        </div>
        
    </div>
    </>
  )
}

export default HomeCarouselDeiPoveri