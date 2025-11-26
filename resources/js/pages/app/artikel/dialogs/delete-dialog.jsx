import { router } from "@inertiajs/react";

export function ArtikelDeleteDialog({ dataDelete, openDialog, setOpenDialog }) {
    if (!openDialog || !dataDelete) return null;

    const handleDelete = () => {
        router.post(
            route("artikel.delete"),
            {
                ids: dataDelete.artikelIds,
            },
            {
                onSuccess: () => setOpenDialog(false),
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-3">Hapus Artikel?</h2>
                <p className="text-sm text-gray-600 mb-5">
                    Apakah kamu yakin ingin menghapus artikel:
                    <strong>
                        {" "}
                        {dataDelete.dataList.map((d) => d.title).join(", ")}
                    </strong>
                    ?
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        className="px-3 py-2 rounded bg-gray-200"
                        onClick={() => setOpenDialog(false)}
                    >
                        Batal
                    </button>
                    <button
                        className="px-3 py-2 rounded bg-red-600 text-white"
                        onClick={handleDelete}
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
