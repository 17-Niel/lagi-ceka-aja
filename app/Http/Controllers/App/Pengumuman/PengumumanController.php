<?php

namespace App\Http\Controllers\App\Pengumuman;

use App\Http\Controllers\Controller;
use App\Models\PengumumanModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengumumanController extends Controller
{
    public function index(Request $request)
    {
        $query = PengumumanModel::query();

        if ($request->search) {
            $query->where('judul', 'like', "%{$request->search}%");
        }

        // Urutkan dari yang terbaru
        $data = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('app/pengumuman/pengumuman-page', [
            'data' => $data,
            'filters' => $request->only(['search']),
        ]);
    }

 public function postChange(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'expired_date' => 'required|date',
            // Pertegas di sini: Harus file gambar (jpg/png), bukan teks, maks 2MB
            'gambar' => 'nullable|mimes:jpg,jpeg,png|max:2048', 
        ]);

        $data = [
            'judul' => $request->judul,
            'isi' => $request->isi,
            'expired_date' => $request->expired_date,
        ];

        // Proses Simpan File Asli
        if ($request->hasFile('gambar')) {
            // Hapus file lama dari folder jika sedang edit
            if ($request->id) {
                $old = PengumumanModel::find($request->id);
                if ($old && $old->gambar_path) {
                    Storage::disk('public')->delete($old->gambar_path);
                }
            }
            
            // File fisik .jpg/.png disimpan ke folder 'uploads/pengumuman'
            // $path akan berisi string seperti "uploads/pengumuman/namafileacak.jpg"
            $path = $request->file('gambar')->store('uploads/pengumuman', 'public');
            $data['gambar_path'] = $path;
        }

        PengumumanModel::updateOrCreate(['id' => $request->id], $data);

        return redirect()->back()->with('success', 'Data berhasil disimpan');
    }

    public function postDelete(Request $request)
    {
        $item = PengumumanModel::find($request->id);
        if ($item) {
            if ($item->gambar_path) {
                Storage::disk('public')->delete($item->gambar_path);
            }
            $item->delete();
        }
        return redirect()->back();
    }
}