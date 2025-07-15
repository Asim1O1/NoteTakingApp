import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNoteStore } from "../stores";

function NotePage() {
  const { id } = useParams();
  const { currentNote, getNote, isLoading, error } = useNoteStore();
  console.log("current not e", currentNote);

  useEffect(() => {
    if (id) {
      getNote(id);
    }
  }, [id, getNote]);

  if (isLoading) {
    return <div className="max-w-2xl mx-auto p-6">Loading note...</div>;
  }

  if (error) {
    return <div className="max-w-2xl mx-auto p-6 text-red-500">{error}</div>;
  }

  if (!currentNote) {
    return <div className="max-w-2xl mx-auto p-6">Note not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-md">
      <h1 className="font-bold text-3xl">{currentNote.title}</h1>
      <div className="flex justify-between items-center gap-3 text-gray-500">
        <p className="text-gray-400 my-3">
          {new Date(currentNote.createdAt).toLocaleDateString()}
        </p>
        <p>
          {currentNote.categories?.map((cat) => (
            <span
              key={cat.id}
              className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              {cat.name}
            </span>
          ))}
        </p>
      </div>
      <p className="mt-6 text-lg font-normal leading-8">
        {currentNote.content}
      </p>
    </div>
  );
}

export default NotePage;
