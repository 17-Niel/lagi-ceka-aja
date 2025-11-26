import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconPlus, IconPencil, IconTrash, IconSearch } from "@tabler/icons-react";
import { route } from "ziggy-js";

// Import Dialogs
import ChangeDialog from "./dialogs/change-dialog";
import DeleteDialog from "./dialogs/delete-dialog";

export default function BeritaPage({ data, filters }) {
    // State untuk Search
    const [search, setSearch] = useState(filters.search || "");
    
    // State untuk Dialog
    const [openChange, setOpenChange] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            router.get(route("berita.index"), { search }, { preserveState: true });
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Berita" />
            
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Daftar Berita</h2>
                <Button onClick={() => { setSelectedData(null); setOpenChange(true); }}>
                    <IconPlus className="mr-2 h-4 w-4" /> Tambah Berita
                </Button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 mb-4 max-w-sm">
                <Input 
                    placeholder="Cari judul berita..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    onKeyDown={handleSearch}
                />
                <Button variant="outline" size="icon" onClick={() => router.get(route("berita.index"), { search })}>
                    <IconSearch className="h-4 w-4" />
                </Button>
            </div>

            {/* Table Section */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Cover</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.data.length > 0 ? (
                            data.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.gambar_path ? (
                                            <img 
                                                src={`/storage/${item.gambar_path}`} 
                                                alt="cover" 
                                                className="h-14 w-20 object-cover rounded-md border" 
                                            />
                                        ) : (
                                            <div className="h-14 w-20 bg-muted flex items-center justify-center rounded-md border text-xs text-muted-foreground">
                                                No Img
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-base">
                                        {item.judul}
                                    </TableCell>
                                    <TableCell className="max-w-md truncate text-muted-foreground">
                                        {item.deskripsi}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => { setSelectedData(item); setOpenChange(true); }}>
                                                <IconPencil className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => { setSelectedData(item); setOpenDelete(true); }}>
                                                <IconTrash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                    Tidak ada data berita ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination (Optional: jika data banyak) */}
            {/* Anda bisa menambahkan komponen pagination di sini jika menggunakan paginate() di controller */}

            {/* Dialogs */}
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