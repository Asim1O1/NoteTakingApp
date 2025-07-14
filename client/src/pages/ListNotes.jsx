import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, LayoutGrid, List, SquarePen, Tag, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { CategoryManagementModal } from "../components/CategoryManagementModal";
import Loading from "../components/loading";
import { useAuthStore } from "../stores";
import { default as useCategoryStore } from "../stores/category.store";
import useNoteStore from "../stores/note.store";

function ListNotes() {
  const [listType, setListType] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Zustand stores
  const {
    notes,
    filteredNotes,
    pagination,
    isLoading,
    error,
    getNotes,
    deleteNote,
    clearError,
    setFilters,
  } = useNoteStore();

  const {
    categories,
    filterNotesByCategory,
    getCategories,
    addCategoriesToNote,
    createCategory,
  } = useCategoryStore();
  const { user } = useAuthStore();

  // Fetch categories on mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Fetch notes when user changes or on mount
  useEffect(() => {
    if (user?.id) {
      getNotes();
    }
  }, [user?.id, getNotes]);

  // Handle category filter change
  const handleCategoryChange = async (selectedOption) => {
    setSelectedCategory(selectedOption);
    if (selectedOption) {
      setFilters({ category: selectedOption.value });
    } else {
      setFilters({ category: "" });
    }
  };

  // Handle search with debouncing
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };

  // Handle delete note
  const handleDelete = async (noteId) => {
    try {
      await deleteNote(noteId);
      await getNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters({}, { page });
  };

  // Handle opening category management modal
  const handleOpenCategoryModal = (note) => {
    setSelectedNote(note);
    setCategoryModalOpen(true);
  };

  // Handle closing category management modal
  const handleCloseCategoryModal = () => {
    setCategoryModalOpen(false);
    setSelectedNote(null);
  };

  // Handle categories updated
  const handleCategoriesUpdated = async () => {
    await getNotes(); // Refresh notes to show updated categories
    handleCloseCategoryModal();
  };

  // Get note overview text
  const getOverview = (text, wordLimit = 12) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Prepare category options for Select
  const categoryOptions =
    categories?.map((cat) => ({
      value: cat.name,
      label: cat.name,
    })) || [];

  // Determine which notes to display
  const displayNotes = selectedCategory ? filteredNotes : notes;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-background rounded-xl shadow-md">
        <Loading message="Loading user data..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl border-1 mx-auto p-6 bg-background rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Notes</h1>
        <Button
          variant="ghost"
          onClick={() =>
            setListType((prev) => (prev === "list" ? "grid" : "list"))
          }
        >
          {listType === "grid" ? <List size={20} /> : <LayoutGrid size={20} />}
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
          <button
            onClick={() => {
              clearError();
              getNotes();
            }}
            className="text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-3 items-center my-6">
        <Select
          placeholder="Filter by category"
          className="w-full md:w-1/3"
          options={categoryOptions}
          value={selectedCategory}
          onChange={handleCategoryChange}
          isClearable
        />

        <form className="w-full md:w-2/3" onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* Main content area */}
      {isLoading ? (
        <Loading message="Loading notes..." />
      ) : displayNotes?.length === 0 ? (
        <div className="my-8 text-center">
          <p className="text-gray-500 mb-4">
            {selectedCategory
              ? "No notes found in this category."
              : "No notes found."}
          </p>
          <Link
            to="/notes/new"
            className="inline-block text-white bg-black/80 px-6 py-2 rounded-md duration-100"
          >
            Create your first note
          </Link>
        </div>
      ) : (
        <div
          className={
            listType === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-4"
              : "space-y-4"
          }
        >
          {displayNotes?.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row justify-between items-start">
                <h2 className="font-bold text-xl">{note.title}</h2>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenCategoryModal(note)}
                    title="Manage categories"
                  >
                    <Tag className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your note.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(note.id)}
                          >
                            Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600">{getOverview(note.content, 20)}</p>
              </CardContent>

              <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex flex-wrap gap-1">
                  {note.categories?.map((cat) => (
                    <Badge key={`${note.id}-${cat.name}`} variant="secondary">
                      {cat.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 w-full justify-end">
                  <Link to={`/notes/${note.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/notes/edit/${note.id}`}>
                    <Button variant="ghost" size="icon">
                      <SquarePen className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Category Management Modal */}
      {categoryModalOpen && selectedNote && (
        <CategoryManagementModal
          note={selectedNote}
          isOpen={categoryModalOpen}
          onClose={handleCloseCategoryModal}
          onCategoriesUpdated={handleCategoriesUpdated}
        />
      )}

      {/* Pagination */}
      {!isLoading && pagination?.totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.page - 1))
                }
                disabled={pagination.page === 1}
              />
            </PaginationItem>

            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={i + 1 === pagination.page}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            {pagination.totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(
                    Math.min(pagination.totalPages, pagination.page + 1)
                  )
                }
                disabled={pagination.page === pagination.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default ListNotes;
