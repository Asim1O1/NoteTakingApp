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
import { useAuthStore, useCategoryStore, useNoteStore } from "../stores";

function ListNotes() {
  const [listType, setListType] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Zustand stores
  const {
    notes,
    pagination,
    isLoading,
    error,
    filters,
    getNotes,
    deleteNote,
    clearError,
    setFilters,
  } = useNoteStore();

  const { categories, getCategories } = useCategoryStore();
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
  }, [user?.id]);

  // Fetch notes when filters change (excluding initial load)
  // Fetch notes when filters change (including when cleared)
  useEffect(() => {
    if (user?.id) {
      getNotes(filters, { page: pagination.page });
    }
  }, [filters.search, filters.category, pagination.page, user?.id]);

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

  // Handle search input change with debouncing
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Handle delete note
  const handleDelete = async (noteId) => {
    try {
      await deleteNote(noteId);
      await getNotes(filters, { page: pagination.page });
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page !== pagination.page) {
      getNotes(filters, { page });
    }
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
    await getNotes(filters, { page: pagination.page });
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

  // Sync search term with filters on mount
  useEffect(() => {
    setSearchTerm(filters.search || "");

    // Sync selected category with filters
    if (filters.category) {
      const categoryOption = categoryOptions.find(
        (opt) => opt.value === filters.category
      );
      setSelectedCategory(categoryOption || null);
    } else {
      setSelectedCategory(null);
    }
  }, [filters.search, filters.category]);

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
            onChange={handleSearchInputChange}
          />
        </form>
      </div>

      {/* Filter summary */}
      {(filters.search || filters.category) && (
        <div className="mb-4 text-sm text-gray-600">
          <span>
            {filters.search && `Searching for: "${filters.search}"`}
            {filters.search && filters.category && " | "}
            {filters.category && `Category: ${filters.category}`}
          </span>

          <button
            onClick={() => {
              setFilters({ search: "", category: "" });
              setSearchTerm("");
              setSelectedCategory(null);

              if (pagination.page !== 1) {
                getNotes({ search: "", category: "" }, { page: 1 });
              }
            }}
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Main content area */}
      {isLoading ? (
        <Loading message="Loading notes..." />
      ) : notes?.length === 0 ? (
        <div className="my-8 text-center">
          <p className="text-gray-500 mb-4">
            {filters.search || filters.category
              ? "No notes found matching your criteria."
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
          {notes?.map((note) => (
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
        <div className="mt-8">
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

              {/* Show page numbers */}
              {(() => {
                const totalPages = pagination.totalPages;
                const currentPage = pagination.page;
                const delta = 2; // Number of pages to show on each side of current page
                const pages = [];

                // Always show first page
                if (currentPage > delta + 1) {
                  pages.push(1);
                  if (currentPage > delta + 2) {
                    pages.push("...");
                  }
                }

                // Show pages around current page
                for (
                  let i = Math.max(1, currentPage - delta);
                  i <= Math.min(totalPages, currentPage + delta);
                  i++
                ) {
                  pages.push(i);
                }

                // Always show last page
                if (currentPage < totalPages - delta) {
                  if (currentPage < totalPages - delta - 1) {
                    pages.push("...");
                  }
                  pages.push(totalPages);
                }

                return pages.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ));
              })()}

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

          {/* Pagination info */}
          <div className="text-center text-sm text-gray-600 mt-2">
            Showing{" "}
            {Math.min(
              pagination.total,
              (pagination.page - 1) * pagination.limit + 1
            )}{" "}
            to {Math.min(pagination.total, pagination.page * pagination.limit)}{" "}
            of {pagination.total} notes
          </div>
        </div>
      )}
    </div>
  );
}

export default ListNotes;
