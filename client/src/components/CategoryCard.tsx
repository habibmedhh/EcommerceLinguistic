import { useI18n } from "@/providers/I18nProvider";
import { useScrollAnimation } from "@/hooks/useAnimations";
import { Card } from "@/components/ui/card";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const { language } = useI18n();
  const animationRef = useScrollAnimation();

  const getName = () => {
    switch (language) {
      case 'ar': return category.nameAr;
      case 'fr': return category.nameFr;
      default: return category.name;
    }
  };

  return (
    <Card 
      ref={animationRef}
      className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="relative h-32 overflow-hidden">
        {category.image && (
          <img
            src={category.image}
            alt={getName()}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      <div className="p-4 text-center">
        <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors text-lg">
          {getName()}
        </h3>
        {category.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
    </Card>
  );
}
