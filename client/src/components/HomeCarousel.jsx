// src/components/HomeCarousel.jsx
import React, { useState, useEffect, useRef } from 'react';

// --- Configurazione ---
const slides = [
  'https://images.unsplash.com/photo-1746333253387-5aac26260c96?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774',
  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1023',
  'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870'
];
const AUTO_SCROLL_DELAY = 4000; // 4 secondi
const CAROUSEL_HEIGHT = 'h-[300px]';
// --- Fine Configurazione ---

function HomeCarousel() {
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef(null);
  
  // *** MODIFICA 1: Usiamo un Ref per il timer ***
  // Questo ci permette di fermarlo e riavviarlo da diverse 
  // funzioni (non solo dall'useEffect).
  const timerRef = useRef(null);
  
  // *** MODIFICA 2: Usiamo un Ref per il "debounce" dello scroll ***
  // L'evento onScroll scatta centinaia di volte. 
  // Vogliamo reagire solo quando lo scroll si "ferma".
  const scrollDebounceTimer = useRef(null);
  
  // *** MODIFICA 3: Mettiamo la logica del timer in una funzione ***
  // Così possiamo riutilizzarla per (ri)avviare il timer
  const startOrResetTimer = () => {
    // Ferma qualsiasi timer precedente
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // Avvia un nuovo timer
    timerRef.current = setInterval(() => {
      // Usiamo la forma funzionale per essere sicuri 
      // di prendere sempre l'ultimo stato
      setCurrent((prevCurrent) => {
        return (prevCurrent + 1) % slides.length;
      });
    }, AUTO_SCROLL_DELAY);
  };

  // Effetto 1: Avvia il timer (solo una volta al caricamento)
  useEffect(() => {
    startOrResetTimer();
    // Funzione di pulizia (solo quando il componente "muore")
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // <-- Array vuoto [] = "Esegui 1 volta sola al montaggio"

  // Effetto 2: Esegue lo scorrimento (ogni volta che 'current' cambia)
  useEffect(() => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      const newScrollLeft = slideWidth * current;
      
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  }, [current]); // <-- Esegui ogni volta che 'current' cambia

  // *** MODIFICA 4: La nuova funzione che gestisce lo SCROLL MANUALE ***
  const handleScroll = () => {
    // 1. Appena l'utente tocca lo scroll, ferma il timer automatico
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // 2. Resetta il timer "debounce"
    // Questo assicura che il codice sotto venga eseguito 
    // solo 150ms DOPO che l'utente ha finito di scrollare.
    if (scrollDebounceTimer.current) {
      clearTimeout(scrollDebounceTimer.current);
    }

    // 3. Avvia un nuovo timer "debounce"
    scrollDebounceTimer.current = setTimeout(() => {
      if (carouselRef.current) {
        // 4. Calcola la nuova slide corrente
        const slideWidth = carouselRef.current.clientWidth;
        const newCurrent = Math.round(carouselRef.current.scrollLeft / slideWidth);

        // 5. Aggiorna lo stato per farlo corrispondere
        setCurrent(newCurrent);
        
        // 6. Fai ripartire il timer automatico da questa nuova posizione
        startOrResetTimer();
      }
    }, 150); // 150ms di "pausa"
  };

  return (
    <div>
      <div
        ref={carouselRef}
        className={`carousel rounded-box w-full ${CAROUSEL_HEIGHT} scroll-smooth`}
        // *** MODIFICA 5: Aggiungi l'handler onScroll ***
        onScroll={handleScroll}
      >
        {slides.map((src, index) => (
          <div 
            key={index} 
            className="carousel-item w-full"
          >
            <img
              src={src}
              className="w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomeCarousel;