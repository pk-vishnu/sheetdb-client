import { useEffect, useState } from "react";
import EntryForm from "./components/EntryForm";
import { toast, Toaster } from "react-hot-toast";
import { LuPencil } from 'react-icons/lu';
import { MdDelete } from 'react-icons/md';
import { FcGoogle } from "react-icons/fc";

type Entry = {
  id: string;
  a: string;
  b: string;
};

const apiId = import.meta.env.VITE_SHEETDB_API_ID;
console.log("API ID:", apiId);

function App() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://sheetdb.io/api/v1/${apiId}`);
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this entry?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://sheetdb.io/api/v1/${apiId}/id/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchEntries();
      toast.success("Entry Deleted");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-left">
          <h1 className="flex items-center gap-2 text-3xl font-semibold text-gray-200 mb-2">
            <FcGoogle className="h-10 w-10" />
            Sheet <span className="text-3xl text-green-300 ml-1">DB</span>
          </h1>

          <p className="text-gray-400 text-xs">Google Sheets CRUD Client</p>
        </div>

        <div><Toaster position="top-right" toastOptions={{ style: { background: '#2D3748', color: '#fff' } }} /></div>

        <div className="bg-gradient-to-t from-green-950 to-green-1000
                 p-6  shadow-xl 
                backdrop-blur-md">
          <EntryForm
            initialData={editingEntry || undefined}
            onSuccess={() => {
              fetchEntries();
              setEditingEntry(null);
            }}
            onCancel={() => setEditingEntry(null)}
          />
        </div>

        <div className="bg-gradient-to-t from-green-1000 to-green-950
                 p-6 mb-8 shadow-xl 
                backdrop-blur-md">


          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-gray-700 rounded p-4 text-center text-gray-400">
              No entries yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-800 text-left">
                    <th className="p-3 rounded-tl-lg">Field A</th>
                    <th className="p-3">Field B</th>
                    <th className="p-3 rounded-tr-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`border-t border-gray-700 hover:bg-gray-700 transition-colors bg-gray-950`}
                    >
                      <td className="p-3">{entry.a}</td>
                      <td className="p-3">{entry.b}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingEntry(entry)}
                          className="bg-green-700 hover:bg-green-800 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;