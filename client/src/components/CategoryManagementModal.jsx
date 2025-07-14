import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../stores";
import useCategoryStore from "../stores/category.store";
export const CategoryManagementModal = ({
  note,
  isOpen,
  onClose,
  onCategoriesUpdated,
}) => {
  const [selectedCategories, setSelectedCategories] = useState(
    note.categories || []
  );

  const [isSaving, setIsSaving] = useState(false);

  const { categories, addCategoriesToNote } = useCategoryStore();
  const { user } = useAuthStore();

  const handleToggleCategory = (category) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.some((cat) => cat.name === category.name);
      if (isSelected) {
        return prev.filter((cat) => cat.name !== category.name);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const categoryNames = selectedCategories.map((cat) => cat.name);
      await addCategoriesToNote(note.id, user.id, categoryNames);
      onCategoriesUpdated();
    } catch (error) {
      console.error("Failed to update categories:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Manage Categories</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Note: {note.title}</p>
        </div>

        {/* Category selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select Categories
          </label>
          <div className="max-h-40 overflow-y-auto border rounded-md p-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.some(
                    (cat) => cat.name === category.name
                  )}
                  onChange={() => handleToggleCategory(category)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected categories preview */}
        {selectedCategories.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Selected Categories
            </label>
            <div className="flex flex-wrap gap-1">
              {selectedCategories.map((cat) => (
                <Badge key={cat.name} variant="secondary">
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
