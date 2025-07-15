import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "sonner";
import { useCategoryStore, useNoteStore } from "../stores";

function NewNotes() {
  const { categories, getCategories } = useCategoryStore();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    getCategories();
  }, []);

  const createNote = useNoteStore((state) => state.createNote);

  // Map categories to { value, label } format for react-select
  const options = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    const categoryValues = selectedCategories.map((cat) => cat.value);

    const noteData = {
      ...formData,
      categories: categoryValues, // pass IDs of selected categories
    };

    console.log("📝 Submitting note:", noteData);

    try {
      await createNote(noteData);
      toast.success("Note created successfully!");
      setFormData({ title: "", content: "" });
      setSelectedCategories([]); // reset select
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-xl border-1 shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Create New Note</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="noteTitle" className="block text-sm font-medium mb-1">
            Note Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="noteTitle"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter note title"
            required
            className="bg-white"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Note Content <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Write your note here..."
            rows={8}
            className="bg-white resize-none h-40"
            required
          />
        </div>

        {/* Categories */}
        <div>
          <label
            htmlFor="categories"
            className="block text-sm font-medium mb-1"
          >
            Categories <span className="text-red-500">*</span>
          </label>
          <Select
            id="categories"
            name="categories"
            options={options} // mapped options
            isMulti
            value={selectedCategories}
            onChange={setSelectedCategories}
            classNamePrefix="react-select"
            className="text-sm"
            placeholder="Select categories"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" className="px-6">
            Create Note
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewNotes;
