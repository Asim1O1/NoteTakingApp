import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCategoryStore } from "../stores";

function Category() {
  console.log("entered the category page");
  const [name, setName] = useState("");

  const { categories, createCategory, getCategories, isLoading, error } =
    useCategoryStore();

  // Load categories on mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Category name is required");

    try {
      await createCategory(name);
      toast.success("Category added");
      setName("");
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-md">
      <h1 className="font-semibold text-xl">Add Category</h1>
      <form onSubmit={handleSubmit} className="my-6 space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new category"
        />
        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </form>

      <hr />

      <div className="mt-6">
        <h2 className="font-medium">Categories</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">
            No categories yet.
          </p>
        ) : (
          <ul className="list-disc list-inside mt-3">
            {categories.map((cat, i) => (
              <li key={i}>{cat.name || cat.value}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Category;
