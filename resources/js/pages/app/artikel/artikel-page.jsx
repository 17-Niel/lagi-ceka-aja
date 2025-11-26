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

    const [form, setForm] = React.useState({
        judul: "",
        deskripsi: "",
        sumberArtikel: "",
        gambar: null,
    });

    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [isChangeDialogOpen, setIsChangeDialogOpen] = React.useState(false);
    const [dataEdit, setDataEdit] = React.useState(null);

    const [dataDelete, setDataDelete] = React.useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    const isFirst = React.useRef(true);

    // ============================ EFFECTS ============================

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

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

    React.useEffect(() => {
        if (flash.success) {
            handlePagination(
                route("artikel") + `?page=1&perPage=${perPage}`,
                ""
            );
            setIsChangeDialogOpen(false);
            setIsDeleteDialogOpen(false);
            setRowSelection({});
            toast.success(flash.success);
        }
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    // ============================ FUNCTIONS ============================

    const handlePagination = (page, search) => {
        setSearch(search);
        setRowSelection({});

        const url = new URL(page);
        const paramPage = url.searchParams.get("page") || page;
        const paramPerPage = url.searchParams.get("perPage") || perPage;

        const fixUrl =
            route("artikel") +
            `?page=${paramPage}&perPage=${paramPerPage}&search=${search}`;

        router.visit(fixUrl, {
            preserveState: true,
            replace: true,
            only: ["artikelList"],
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setForm({ ...form, gambar: file });
    };

    const handleSimpan = () => {
        if (!form.judul || !form.deskripsi || !form.sumberArtikel) {
            toast.error("Mohon lengkapi semua field!");
            return;
        }

        console.log("Data artikel:", form);

        setIsModalOpen(false);
        setForm({
            judul: "",
            deskripsi: "",
            sumberArtikel: "",
            gambar: null,
        });

        toast.success("Artikel berhasil ditambahkan!");
    };

    // ============================ TABLE CONFIG ============================

    let columns = [
        {
            forEditor: true,
            id: "Pilih Baris",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
        },
        {
            id: "No",
            header: "No",
            cell: ({ row }) => (
                <div>
                    {(
                        (artikelList.current_page - 1) * artikelList.per_page +
                        row.index +
                        1
                    ).toString()}
                </div>
            ),
        },
        {
            id: "Judul",
            accessorKey: "title",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    {column.id}
                </Button>
            ),
            cell: ({ row }) => <div>{row.original.title}</div>,
        },
        {
            id: "Tanggal",
            accessorKey: "created_at",
            header: "Tanggal",
            cell: ({ row }) =>
                dayjs(row.original.created_at).format("DD MMMM YYYY"),
        },
        {
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <Icon.IconDotsVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="text-yellow-500"
                            onClick={() => {
                                setDataEdit({
                                    artikelId: row.original.id,
                                    title: row.original.title,
                                    content: row.original.content,
                                    category: row.original.category,
                                    isPublished: row.original.is_published,
                                });
                                setIsChangeDialogOpen(true);
                            }}
                        >
                            <Icon.IconPencil size={16} className="mr-2" />
                            Ubah
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-500"
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

    if (!isEditor) {
        columns = columns.filter(
            (col) => !col.forEditor || col.forEditor === isEditor
        );
    }

    useReactTable({
        data: artikelList.data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
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
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Cari..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                    + Tambah
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="px-6 py-3 text-left">No</th>
                            <th className="px-6 py-3 text-left">
                                Judul Artikel
                            </th>
                            <th className="px-6 py-3 text-left">Tanggal</th>
                            <th className="px-6 py-3 text-left">Lampiran</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                colSpan="6"
                                className="px-6 py-12 text-center text-gray-500"
                            >
                                Belum ada data tersedia.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ===================== MODAL TAMBAH ARTIKEL ===================== */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="bg-blue-500 text-white px-6 py-4 rounded-t-lg flex justify-between">
                            <h2 className="text-lg font-semibold">
                                Tambah Artikel
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="hover:bg-blue-600 p-1 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">
                                    Judul Artikel
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
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Deskripsi Artikel
                                </label>
                                <textarea
                                    value={form.deskripsi}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            deskripsi: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2 h-28 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Sumber Artikel
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
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Tambahkan Gambar
                                </label>

                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                                <label
                                    htmlFor="file-upload"
                                    className="border rounded px-4 py-2 cursor-pointer inline-block hover:bg-gray-100"
                                >
                                    {form.gambar
                                        ? form.gambar.name
                                        : "Choose a File"}
                                </label>
                            </div>
                        </div>

                        <div className="p-6 flex justify-end">
                            <button
                                onClick={handleSimpan}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                            >
                                Simpan
                            </button>
                        </div>
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
