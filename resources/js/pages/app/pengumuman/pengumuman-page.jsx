import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconPlus, IconPencil, IconTrash, IconSearch } from "@tabler/icons-react";
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
            router.get(route("pengumuman.index"), { search }, { preserveState: true });
        }
    };

    return (
        <AppLayout>
            <Head title="Pengumuman" />
            
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Daftar Pengumuman</h2>
                <Button onClick={() => { setSelectedData(null); setOpenChange(true); }}>
                    <IconPlus className="mr-2 h-4 w-4" /> Tambah
                </Button>
            </div>

            <div className="flex items-center gap-2 mb-4 max-w-sm">
                <Input 
                    placeholder="Cari judul..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    onKeyDown={handleSearch}
                />
                <Button variant="outline" size="icon" onClick={() => router.get(route("pengumuman.index"), { search })}>
                    <IconSearch className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Gambar</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead>Isi</TableHead>
                            <TableHead>Expired</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.data.length > 0 ? (
                            data.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.gambar_path ? (
                                            <img src={`/storage/${item.gambar_path}`} alt="img" className="h-12 w-12 object-cover rounded-md border" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No Img</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{item.judul}</TableCell>
                                    <TableCell className="max-w-xs truncate text-muted-foreground">{item.isi}</TableCell>
                                    <TableCell>{item.expired_date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setSelectedData(item); setOpenChange(true); }}>
                                            <IconPencil className="h-4 w-4 text-orange-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => { setSelectedData(item); setOpenDelete(true); }}>
                                            <IconTrash className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Tidak ada data pengumuman.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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