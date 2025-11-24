import React from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";

export default function DeleteDialog({ open, onOpenChange, data }) {
    const { post, processing } = useForm();

    const handleDelete = () => {
        post(route("pengumuman.delete", { id: data?.id }), {
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Pengumuman?</DialogTitle>
                    <DialogDescription>
                        Anda yakin ingin menghapus <b>"{data?.judul}"</b>? <br/>
                        Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing}>Hapus Sekarang</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}