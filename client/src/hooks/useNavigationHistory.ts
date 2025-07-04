import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export function useNavigationHistory() {
  const [location] = useLocation();
  const [previousPath, setPreviousPath] = useState<string>('/');

  useEffect(() => {
    const currentPath = location;
    
    // Ne pas mémoriser le panier comme page précédente
    if (currentPath !== '/cart') {
      // Récupérer la page précédente du localStorage avant de la changer
      const stored = localStorage.getItem('previousPath');
      if (stored) {
        setPreviousPath(stored);
      }
      
      // Stocker la page actuelle comme page précédente pour la prochaine navigation
      localStorage.setItem('previousPath', currentPath);
    } else {
      // Si on est sur le panier, récupérer la page précédente du localStorage
      const stored = localStorage.getItem('previousPath');
      if (stored) {
        setPreviousPath(stored);
      }
    }
  }, [location]);

  const goBack = () => {
    return previousPath;
  };

  return { previousPath, goBack };
}