import React from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { AlertTriangle } from "lucide-react";

export default function DeleteDialog({ open, onOpenChange, data }) {
    const { post, processing } = useForm();

    const handleDelete = () => {
        post(route("berita.delete", { id: data?.id }), {
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md text-center p-6">
                {/* IKON WARNING */}
                <div className="flex justify-center mb-3">
                    <div className="w-30 h-30 flex-shrink12 flex items-center justify-center rounded-full bg-orange-100">
                        <AlertTriangle className="text-orange-500" size={24} />
                    </div>
                </div>

                <DialogHeader className="text-center">
                    <DialogTitle className="text-lg font-semibold">
                        Hapus Berita?
                    </DialogTitle>

                    <DialogDescription className="text-sm mt-2 leading-relaxed">
                        Tindakan ini tidak dapat dibatalkan!
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-center gap-3 mt-6">
                    {/* TOMBOL "Ya, Hapus" DI KIRI */}
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                        className="px-5 text-sm"
                    >
                        Ya, Hapus
                    </Button>

                    {/* TOMBOL "Batal" DI KANAN */}
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="px-5 text-sm"
                    >
                        Batal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
