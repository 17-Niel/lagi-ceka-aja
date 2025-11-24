import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { route } from "ziggy-js";

export default function ChangeDialog({ open, onOpenChange, data }) {
    const { data: form, setData, post, processing, reset, errors, clearErrors } = useForm({
        id: "",
        judul: "",
        isi: "",
        expired_date: "",
        gambar: null,
    });

    useEffect(() => {
        if (open) {
            clearErrors();
            if (data) {
                // Mode Edit
                setData({
                    id: data.id,
                    judul: data.judul,
                    isi: data.isi,
                    expired_date: data.expired_date,
                    gambar: null, 
                });
            } else {
                // Mode Tambah Baru
                reset();
                setData("id", ""); 
            }
        }
    }, [open, data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pakai post dengan forceFormData untuk upload file
        post(route("pengumuman.change"), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{data ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Judul Pengumuman</Label>
                        <Input 
                            value={form.judul} 
                            onChange={(e) => setData("judul", e.target.value)} 
                            placeholder="Contoh: Maintenance Server"
                        />
                        {errors.judul && <span className="text-red-500 text-xs">{errors.judul}</span>}
                    </div>
                    
                    <div className="grid gap-2">
                        <Label>Isi Lengkap</Label>
                        <Textarea 
                            className="min-h-[100px]"
                            value={form.isi} 
                            onChange={(e) => setData("isi", e.target.value)} 
                            placeholder="Tulis detail pengumuman di sini..."
                        />
                        {errors.isi && <span className="text-red-500 text-xs">{errors.isi}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label>Tanggal Berakhir (Expired)</Label>
                        <Input 
                            type="date"
                            value={form.expired_date} 
                            onChange={(e) => setData("expired_date", e.target.value)} 
                        />
                        {errors.expired_date && <span className="text-red-500 text-xs">{errors.expired_date}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label>Gambar Pendukung (Opsional)</Label>
                        <Input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData("gambar", e.target.files[0])} 
                        />
                        {errors.gambar && <span className="text-red-500 text-xs">{errors.gambar}</span>}
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button type="submit" disabled={processing}>Simpan Data</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}