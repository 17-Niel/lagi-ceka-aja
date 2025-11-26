import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    IconPlus,
    IconPencil,
    IconTrash,
    IconSearch,
} from "@tabler/icons-react";
import ChangeDialog from "./dialogs/change-dialog";
import DeleteDialog from "./dialogs/delete-dialog";
import { route } from "ziggy-js";

export default function PengumumanPage({ data, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [openChange, setOpenChange] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            router.get(
                route("pengumuman.index"),
                { search },
                { preserveState: true }
            );
        }
    };

    return (
        <AppLayout>
            <Head title="Pengumuman" />

            {/* Container Utama dengan padding yang lega */}
            <div className="p-6 space-y-6">
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            Pengumuman
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Kelola daftar pengumuman dan informasi terbaru.
                        </p>
                    </div>

                    {/* Tombol Tambah dengan Shadow Halus */}
                    <Button
                        onClick={() => {
                            setSelectedData(null);
                            setOpenChange(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 transition-all"
                    >
                        <IconPlus className="mr-2 h-4 w-4" /> Tambah Baru
                    </Button>
                </div>

                {/* --- TOOLBAR SECTION (SEARCH) --- */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="relative w-full max-w-sm">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari berdasarkan judul..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all rounded-lg"
                        />
                    </div>
                    {/* Tombol search manual (opsional, untuk UX yang lebih jelas) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            router.get(route("pengumuman.index"), { search })
                        }
                        className="text-gray-500 hover:text-blue-600"
                    >
                        <IconSearch className="h-5 w-5" />
                    </Button>
                </div>

                {/* --- TABLE SECTION --- */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[100px] text-xs uppercase tracking-wider font-semibold text-gray-500">
                                    Gambar
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                    Judul
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                    Isi Pengumuman
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                    Expired
                                </TableHead>
                                <TableHead className="text-right text-xs uppercase tracking-wider font-semibold text-gray-500">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.data.length > 0 ? (
                                data.data.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-blue-50/30 transition-colors group"
                                    >
                                        <TableCell className="py-4">
                                            {item.gambar_path ? (
                                                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                                    <img
                                                        src={`/storage/${item.gambar_path}`}
                                                        alt="img"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 text-[10px] text-gray-400 font-medium">
                                                    No Img
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-semibold text-gray-800">
                                            {item.judul}
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <p className="truncate text-sm text-gray-500">
                                                {item.isi}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                {item.expired_date}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-orange-50 hover:text-orange-600 rounded-full"
                                                    onClick={() => {
                                                        setSelectedData(item);
                                                        setOpenChange(true);
                                                    }}
                                                >
                                                    <IconPencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600 rounded-full"
                                                    onClick={() => {
                                                        setSelectedData(item);
                                                        setOpenDelete(true);
                                                    }}
                                                >
                                                    <IconTrash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-60 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center text-gray-400 space-y-3">
                                            <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center">
                                                <IconSearch className="h-6 w-6 text-gray-300" />
                                            </div>
                                            <p className="text-sm font-medium">
                                                Tidak ada data pengumuman
                                                ditemukan.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <ChangeDialog
                open={openChange}
                onOpenChange={setOpenChange}
                data={selectedData}
            />

            <DeleteDialog
                open={openDelete}
                onOpenChange={setOpenDelete}
                data={selectedData}
            />
        </AppLayout>
    );
}
