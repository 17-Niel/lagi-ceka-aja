import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AppLayout from "@/layouts/app-layout";
import { router, usePage } from "@inertiajs/react";
import * as Icon from "@tabler/icons-react";
import {
    flexRender, // Wajib diimport untuk render cell
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import * as React from "react";
import { toast } from "sonner";
import { ArtikelChangeDialog } from "./dialogs/change-dialog";
import { ArtikelDeleteDialog } from "./dialogs/delete-dialog";

export default function ArtikelPage() {
    // ============================ DATA & STATE ============================

    const {
        artikelList,
        flash,
        isEditor,
        perPage,
        search: initialSearch,
        page: initialPage,
    } = usePage().props;

    const [search, setSearch] = React.useState(initialSearch || "");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // State untuk Form Tambah
    const [form, setForm] = React.useState({
        judul: "",
        deskripsi: "",
        sumberArtikel: "",
        gambar: null,
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // State Table
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    // State Dialogs
    const [isChangeDialogOpen, setIsChangeDialogOpen] = React.useState(false);
    const [dataEdit, setDataEdit] = React.useState(null);
    const [dataDelete, setDataDelete] = React.useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    const isFirst = React.useRef(true);

    // ============================ EFFECTS ============================

    // Handle Debounce Search
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Handle Pagination & Search Request
    React.useEffect(() => {
        const targetPage = isFirst.current ? initialPage : 1;
        isFirst.current = false;

        if (debouncedSearch !== undefined) {
            handlePagination(
                route("artikel") +
                    `?page=${targetPage}&search=${debouncedSearch}`,
                debouncedSearch
            );
        }
    }, [debouncedSearch]);

    // Handle Flash Messages
    React.useEffect(() => {
        if (flash.success) {
            // Refresh data clean state
            setIsChangeDialogOpen(false);
            setIsDeleteDialogOpen(false);
            setRowSelection({});
            toast.success(flash.success);
        }
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    // ============================ FUNCTIONS ============================

    const handlePagination = (url, searchValue) => {
        setSearch(searchValue);
        setRowSelection({});

        const newUrl = new URL(url);
        const paramPage = newUrl.searchParams.get("page") || 1;
        const paramPerPage = newUrl.searchParams.get("perPage") || perPage;

        router.visit(route("artikel"), {
            data: {
                page: paramPage,
                perPage: paramPerPage,
                search: searchValue,
            },
            preserveState: true,
            replace: true,
            only: ["artikelList"],
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setForm({ ...form, gambar: file });
    };

    const handleSimpan = (e) => {
        e.preventDefault();

        if (!form.judul || !form.deskripsi || !form.sumberArtikel) {
            toast.error("Mohon lengkapi semua field wajib!");
            return;
        }

        setIsSubmitting(true);

        // Gunakan FormData karena ada upload file
        const formData = new FormData();
        formData.append("title", form.judul);
        formData.append("content", form.deskripsi);
        formData.append("source", form.sumberArtikel);
        if (form.gambar) {
            formData.append("image", form.gambar);
        }

        // Kirim ke backend (sesuaikan nama route store Anda, misal: artikel.store)
        router.post(route("artikel.store"), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setForm({
                    judul: "",
                    deskripsi: "",
                    sumberArtikel: "",
                    gambar: null,
                });
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error(errors);
                toast.error("Gagal menyimpan artikel. Periksa input Anda.");
                setIsSubmitting(false);
            },
        });
    };

    // ============================ TABLE CONFIG ============================

    const columns = React.useMemo(() => {
        let cols = [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
                forEditor: true,
            },
            {
                id: "No",
                header: "No",
                cell: ({ row }) => {
                    return (
                        (artikelList.current_page - 1) * artikelList.per_page +
                        row.index +
                        1
                    );
                },
            },
            {
                accessorKey: "title",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="pl-0"
                    >
                        Judul Artikel
                        <Icon.IconArrowsSort className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("title")}</div>
                ),
            },
            {
                accessorKey: "created_at",
                header: "Tanggal",
                cell: ({ row }) =>
                    dayjs(row.getValue("created_at")).format("DD MMMM YYYY"),
            },
            {
                id: "actions",
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Icon.IconDotsVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="text-yellow-600 focus:text-yellow-700 cursor-pointer"
                                onClick={() => {
                                    setDataEdit(row.original);
                                    setIsChangeDialogOpen(true);
                                }}
                            >
                                <Icon.IconPencil size={16} className="mr-2" />
                                Ubah
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-700 cursor-pointer"
                                onClick={() => {
                                    setDataDelete({
                                        artikelIds: [row.original.id],
                                        dataList: [
                                            {
                                                id: row.original.id,
                                                title: row.original.title,
                                            },
                                        ],
                                    });
                                    setIsDeleteDialogOpen(true);
                                }}
                            >
                                <Icon.IconTrash size={16} className="mr-2" />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ];

        // Filter kolom berdasarkan role editor
        if (!isEditor) {
            return cols.filter(
                (col) => !col.forEditor || col.forEditor === isEditor
            );
        }
        return cols;
    }, [artikelList.current_page, artikelList.per_page, isEditor]);

    const table = useReactTable({
        data: artikelList.data || [], // Pastikan data tidak undefined
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        pageCount: artikelList.last_page,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    // ============================ RENDER ============================

    return (
        <AppLayout>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Artikel</h1>
            </div>

            <div className="flex items-center justify-between gap-6 mb-8">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Cari artikel..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                >
                    + Tambah
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-medium border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="px-6 py-3">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="bg-white hover:bg-gray-50 transition-colors"
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Icon.IconDatabaseOff
                                            size={32}
                                            className="text-gray-400"
                                        />
                                        <p>Belum ada data tersedia.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls sederhana (Opsional, jika ingin ditambah) */}
                {artikelList.last_page > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4 px-6 border-t">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                handlePagination(
                                    artikelList.prev_page_url,
                                    search
                                )
                            }
                            disabled={!artikelList.prev_page_url}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-600">
                            Halaman {artikelList.current_page} dari{" "}
                            {artikelList.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                handlePagination(
                                    artikelList.next_page_url,
                                    search
                                )
                            }
                            disabled={!artikelList.next_page_url}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            {/* ===================== MODAL TAMBAH ARTIKEL ===================== */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-semibold">
                                Tambah Artikel
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="hover:bg-blue-700 p-1 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSimpan}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Judul Artikel{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.judul}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                judul: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Masukkan judul..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Deskripsi Artikel{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={form.deskripsi}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                deskripsi: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 h-28 resize-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tulis ringkasan artikel..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Sumber Artikel{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.sumberArtikel}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                sumberArtikel: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Contoh: Kompas.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Gambar Sampul
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                                        >
                                            Pilih File
                                        </label>
                                        <span className="text-sm text-gray-500 truncate max-w-[200px]">
                                            {form.gambar
                                                ? form.gambar.name
                                                : "Belum ada file dipilih"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DIALOG EDIT */}
            {isChangeDialogOpen && dataEdit && (
                <ArtikelChangeDialog
                    open={isChangeDialogOpen}
                    onOpenChange={setIsChangeDialogOpen}
                    data={dataEdit}
                />
            )}

            {/* DIALOG HAPUS */}
            {isDeleteDialogOpen && dataDelete && (
                <ArtikelDeleteDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    data={dataDelete}
                />
            )}
        </AppLayout>
    );
}
