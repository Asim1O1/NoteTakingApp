// EditNoteForm.jsx
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import useCategoryStore from "../stores/category.store";
import useNoteStore from "../stores/note.store";

export function EditNoteForm() {
  const { id } = useParams();
  console.log("The user params is", useParams);
  console.log("The note id is", id);
  const navigate = useNavigate();
  const { currentNote, getNote, updateNote, isLoading, error, clearError } =
    useNoteStore();
  const { categories, getCategories } = useCategoryStore();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categories: [],
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    console.log("entered inside try catcg");
    const fetchData = async () => {
      try {
        await getCategories();
        if (id) {
          console.log("The note id is", id);
          const note = await getNote(id);
          console.log("The note is", note);
          if (note) {
            setFormData({
              title: note?.title,
              content: note?.content,
              categories: note.categories?.map((cat) => cat.id) || [],
            });
          }
        }
      } catch (error) {
        console.error("Error loading note:", error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchData();
  }, [id, getNote, getCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      categories: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateNote(id, formData);
      navigate(`/notes/${id}`);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const categoryOptions =
    categories?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) || [];

  const selectedCategories = categoryOptions.filter((option) =>
    formData.categories.includes(option.value)
  );

  if (isInitialLoad || (isLoading && !currentNote)) {
    return <Loading message="Loading note..." />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6">Edit Note</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
          <button onClick={clearError} className="text-red-800 underline">
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2 font-medium">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block mb-2 font-medium">
            Content
          </label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            required
          />
        </div>

        <div>
          <label htmlFor="categories" className="block mb-2 font-medium">
            Categories
          </label>
          <Select
            id="categories"
            isMulti
            options={categoryOptions}
            value={selectedCategories}
            onChange={handleCategoryChange}
            closeMenuOnSelect={false}
            placeholder="Select categories..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
