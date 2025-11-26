import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { route } from "ziggy-js";

export default function ChangeDialog({ open, onOpenChange, data }) {
    const {
        data: form,
        setData,
        post,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        id: "",
        judul: "",
        deskripsi: "",
        gambar: null,
    });

    useEffect(() => {
        if (open) {
            clearErrors();
            if (data) {
                // Mode Edit: Isi form dengan data yang dipilih
                setData({
                    id: data.id,
                    judul: data.judul,
                    deskripsi: data.deskripsi,
                    gambar: null,
                });
            } else {
                // Mode Tambah: Kosongkan form
                reset();
                setData("id", "");
            }
        }
    }, [open, data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit ke route berita.store
        post(route("berita.store"), {
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
                    <DialogTitle>
                        {data ? "Edit Berita" : "Tambah Berita Baru"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Input Judul */}
                    <div className="grid gap-2">
                        <Label>Judul Berita</Label>
                        <Input
                            value={form.judul}
                            onChange={(e) => setData("judul", e.target.value)}
                            placeholder="Masukkan judul berita..."
                        />
                        {errors.judul && (
                            <span className="text-red-500 text-xs">
                                {errors.judul}
                            </span>
                        )}
                    </div>

                    {/* Input Deskripsi */}
                    <div className="grid gap-2">
                        <Label>Deskripsi / Konten</Label>
                        <Textarea
                            className="min-h-[150px]"
                            value={form.deskripsi}
                            onChange={(e) =>
                                setData("deskripsi", e.target.value)
                            }
                            placeholder="Tulis isi berita di sini..."
                        />
                        {errors.deskripsi && (
                            <span className="text-red-500 text-xs">
                                {errors.deskripsi}
                            </span>
                        )}
                    </div>

                    {/* Input Gambar */}
                    <div className="grid gap-2">
                        <Label>Cover Gambar</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData("gambar", e.target.files[0])
                            }
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Format: JPG, PNG (Max 2MB). Kosongkan jika tidak
                            ingin mengubah gambar saat edit.
                        </p>
                        {errors.gambar && (
                            <span className="text-red-500 text-xs">
                                {errors.gambar}
                            </span>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
