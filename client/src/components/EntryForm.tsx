import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const apiId = import.meta.env.VITE_SHEETDB_API_ID;

type Entry = {
  id?: string;
  a: string;
  b: string;
};
type EntryFormProps = {
  initialData?: Entry;
  onSuccess: () => void;
  onCancel: () => void;
};

function EntryForm({ initialData, onSuccess, onCancel }: EntryFormProps) {
  const [price, setPrice] = useState("");
  const [percentage, setPercentage] = useState("");
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    setPrice(initialData?.a || "");
    setPercentage(initialData?.b || "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');

    const dataPayload = {
      id: initialData?.id || crypto.randomUUID(),
      a: price,
      b: percentage
    };

    const url = initialData ? `https://sheetdb.io/api/v1/${apiId}/id/${initialData.id}` : `https://sheetdb.io/api/v1/${apiId}`;
    const method = initialData ? "PATCH" : "POST";
    const body = initialData ? JSON.stringify({ data: [dataPayload] }) : JSON.stringify({ data: [dataPayload] });


    try {
      const response = await fetch(url, {
        method,
        headers: {
          "content-type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setStatus('success');
      onSuccess();
    } catch (error) {
      console.error("Error saving data:", error);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status === "success") {
      toast.success("Saved successfully!");
      setStatus("idle");
    }

    if (status === "error") {
      toast.error("Error saving data.");
      setStatus("idle");
    }
  }, [status]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-green-300">
        {initialData ? (
          "Edit Entry"
        ) : (
          "+ Entry"
        )}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="field-a" className="block text-sm font-medium text-gray-300 mb-1">
            Field A
          </label>
          <input
            id="field-a"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="text"
            placeholder="Enter value for Field A"
            required
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 
                        text-gray-100 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent
                        transition-colors"
          />
        </div>

        <div>
          <label htmlFor="field-b" className="block text-sm font-medium text-gray-300 mb-1">
            Field B
          </label>
          <input
            id="field-b"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            type="text"
            placeholder="Enter value for Field B"
            required
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 
                        text-gray-100 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent
                        transition-colors"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={status === "saving"}
            className="bg-green-700 text-white px-4 py-2 rounded-md 
                       hover:bg-green-800 disabled:opacity-50 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800"
          >
            {status === "saving" ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {initialData ? "Updating..." : "Saving..."}
              </span>
            ) : (
              <>{initialData ? "Update" : "Save"}</>
            )}
          </button>

          {initialData && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-700 text-gray-300 border border-gray-600 px-4 py-2 rounded-md 
                           hover:bg-gray-600 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EntryForm;