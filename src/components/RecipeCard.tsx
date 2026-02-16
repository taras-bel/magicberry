"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ChefHat, Users } from "lucide-react";
import type { Recipe } from "@/data/recipes";
import { useTranslations, useI18n } from "@/lib/i18n";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const t = useTranslations();
  const { locale } = useI18n();

  const title = locale === 'en' ? recipe.title_en || recipe.title : recipe.title;
  const time = locale === 'en' ? recipe.time_en || recipe.time : recipe.time;
  
  return (
    <Link href={`/recipes/${recipe.slug}`} className="block group h-full">
      <div className="bg-gray-50 h-full transition-colors duration-300 hover:bg-gray-100 flex flex-col border border-transparent hover:border-gray-200 overflow-hidden">
        
        {recipe.image && (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
             <Image
              src={recipe.image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>
        )}

        <div className="p-8 flex flex-col justify-between flex-grow">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
               <h3 className="font-serif text-2xl font-medium text-primary group-hover:text-berry transition-colors leading-tight">
                {title}
              </h3>
            </div>

            <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-widest text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {time}
              </div>
              {recipe.difficulty && (
                 <div className="flex items-center gap-2">
                   <ChefHat className="w-4 h-4" />
                   <span>{recipe.difficulty}</span>
                 </div>
              )}
               {recipe.servings && (
                 <div className="flex items-center gap-2">
                   <Users className="w-4 h-4" />
                   <span>{recipe.servings}</span>
                 </div>
              )}
            </div>

            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {recipe.ingredients
                  .filter(ing => ing.productSlug || ing.required)
                  .slice(0, 3)
                  .map((ingredient, index) => {
                    const ingName = locale === 'en' ? ingredient.name_en || ingredient.name : ingredient.name;
                    return (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium uppercase tracking-wider"
                      >
                        {ingName}
                      </span>
                    );
                  })}
              </div>
            )}
          </div>
          
          <div className="pt-8 mt-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary pb-1 group-hover:text-berry group-hover:border-berry transition-colors">
                  {t('recipes.read_recipe')}
              </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
