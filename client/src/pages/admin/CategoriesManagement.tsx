import { useState } from "react";
import { Link } from "wouter";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  Save,
  X
} from "lucide-react";

interface CategoryForm {
  id?: number;
  name: string;
  nameAr: string;
  nameFr: string;
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  image: string;
  isActive: boolean;
}

export default function CategoriesManagement() {
  const { toast } = useToast();
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryForm | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryForm>({
    name: "",
    nameAr: "",
    nameFr: "",
    description: "",
    descriptionAr: "",
    descriptionFr: "",
    image: "",
    isActive: true,
  });

  const resetForm = () => {
    setCategoryData({
      name: "",
      nameAr: "",
      nameFr: "",
      description: "",
      descriptionAr: "",
      descriptionFr: "",
      image: "",
      isActive: true,
    });
    setEditingCategory(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (category: any) => {
    const formData = {
      id: category.id,
      name: category.name || "",
      nameAr: category.nameAr || "",
      nameFr: category.nameFr || "",
      description: category.description || "",
      descriptionAr: category.descriptionAr || "",
      descriptionFr: category.descriptionFr || "",
      image: category.image || "",
      isActive: category.isActive !== false,
    };
    setCategoryData(formData);
    setEditingCategory(formData);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id!,
          ...categoryData
        });
        toast({
          title: "Succès",
          description: "Catégorie mise à jour avec succès",
        });
      } else {
        await createCategory.mutateAsync(categoryData);
        toast({
          title: "Succès", 
          description: "Catégorie créée avec succès",
        });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la catégorie",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await deleteCategory.mutateAsync(categoryId);
        toast({
          title: "Succès",
          description: "Catégorie supprimée avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la catégorie",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (field: keyof CategoryForm, value: any) => {
    setCategoryData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des catégories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
            </div>
            
            <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Catégorie
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-gray-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune catégorie</h3>
            <p className="text-gray-500 mb-4">Commencez par créer votre première catégorie</p>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Créer une catégorie
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier la catégorie" : "Créer une nouvelle catégorie"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Image */}
            <div>
              <Label htmlFor="image">Image de la catégorie</Label>
              <Input
                id="image"
                value={categoryData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="URL de l'image"
              />
              {categoryData.image && (
                <div className="mt-2">
                  <img
                    src={categoryData.image}
                    alt="Aperçu"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* Noms multilingues */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Nom (Anglais)</Label>
                <Input
                  id="name"
                  value={categoryData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Category Name"
                />
              </div>
              <div>
                <Label htmlFor="nameFr">Nom (Français)</Label>
                <Input
                  id="nameFr"
                  value={categoryData.nameFr}
                  onChange={(e) => handleInputChange('nameFr', e.target.value)}
                  placeholder="Nom de la catégorie"
                />
              </div>
              <div>
                <Label htmlFor="nameAr">Nom (العربية)</Label>
                <Input
                  id="nameAr"
                  value={categoryData.nameAr}
                  onChange={(e) => handleInputChange('nameAr', e.target.value)}
                  placeholder="اسم الفئة"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Descriptions multilingues */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="description">Description (Anglais)</Label>
                <Textarea
                  id="description"
                  value={categoryData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Category description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="descriptionFr">Description (Français)</Label>
                <Textarea
                  id="descriptionFr"
                  value={categoryData.descriptionFr}
                  onChange={(e) => handleInputChange('descriptionFr', e.target.value)}
                  placeholder="Description de la catégorie"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="descriptionAr">Description (العربية)</Label>
                <Textarea
                  id="descriptionAr"
                  value={categoryData.descriptionAr}
                  onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                  placeholder="وصف الفئة"
                  dir="rtl"
                  rows={3}
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={categoryData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isActive">Catégorie active</Label>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={createCategory.isPending || updateCategory.isPending}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingCategory ? "Mettre à jour" : "Créer"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}