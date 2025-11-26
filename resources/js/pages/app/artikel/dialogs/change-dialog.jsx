import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export function ArtikelChangeDialog({
    dataEdit,
    dialogTitle,
    openDialog,
    setOpenDialog,
}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        if (dataEdit) {
            setTitle(dataEdit.title || "");
            setContent(dataEdit.content || "");
            setCategory(dataEdit.category || "");
            setIsPublished(dataEdit.isPublished || false);
        } else {
            setTitle("");
            setContent("");
            setCategory("");
            setIsPublished(false);
        }
    }, [dataEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            id: dataEdit?.artikelId,
            title,
            content,
            category,
            is_published: isPublished,
        };

        router.post(route("artikel.save"), payload, {
            onSuccess: () => setOpenDialog(false),
        });
    };

    if (!openDialog) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">{dialogTitle}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Judul
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Konten
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            rows={4}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Kategori
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            id="isPublished"
                        />
                        <label htmlFor="isPublished" className="text-sm">
                            Publish Artikel
                        </label>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={() => setOpenDialog(false)}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
