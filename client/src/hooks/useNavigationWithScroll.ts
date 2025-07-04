import { useLocation } from "wouter";
import { useEffect } from "react";

export function useNavigationWithScroll() {
  const [location] = useLocation();

  // Faire défiler vers le haut à chaque changement de page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location]);

  return location;
}

// Hook pour naviguer avec défilement automatique
export function useNavigateWithScroll() {
  const [, setLocation] = useLocation();

  const navigate = (path: string) => {
    // Défiler vers le haut en douceur
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Naviguer vers la nouvelle page après un petit délai pour que le défilement soit visible
    setTimeout(() => {
      setLocation(path);
    }, 100);
  };

  return navigate;
}