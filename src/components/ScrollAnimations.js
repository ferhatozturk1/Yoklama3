import { useEffect } from 'react';

const ScrollAnimations = () => {
  useEffect(() => {
    // Intersection Observer için callback fonksiyonu
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Element görünür hale geldiğinde animasyon sınıfını ekle
          entry.target.classList.add('animate-in');
          entry.target.classList.remove('animate-out');
        } else {
          // Element görünmez olduğunda animasyon sınıfını kaldır
          entry.target.classList.remove('animate-in');
          entry.target.classList.add('animate-out');
        }
      });
    };

    // Intersection Observer oluştur
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.2, // Element %20 görünür olduğunda tetikle
      rootMargin: '0px 0px -100px 0px' // Alt kısımdan 100px önce tetikle
    });

    // Animasyon yapılacak elementleri seç
    const animatedElements = document.querySelectorAll(
      '.scroll-animate, .scroll-animate-stagger, .scroll-animate-scale, .scroll-animate-left, .scroll-animate-right, .scroll-animate-fade, .scroll-animate-bounce'
    );
    
    // Her elementi observer'a ekle
    animatedElements.forEach((element) => {
      observer.observe(element);
    });

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // Bu component render etmez, sadece animasyon logic'i çalıştırır
};

export default ScrollAnimations;