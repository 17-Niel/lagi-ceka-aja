<?php

namespace App\Http\Controllers\App\Artikel;

use App\Http\Controllers\Controller;
use App\Models\ArtikelModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArtikelController extends Controller
{
    /**
     * Tampilkan daftar artikel
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);

        $query = ArtikelModel::query();

        // Search
        if ($search) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
        }

        // Sort
        if ($request->has('sort')) {
            $sort = $request->input('sort');
            $direction = $request->input('direction', 'asc');
            $query->orderBy($sort, $direction);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $artikelList = $query->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('app/artikel/artikel-page', [
            'artikelList' => $artikelList,
            'isEditor' => auth()->user()->is_admin ?? false,
            'perPage' => $perPage,
            'perPageOptions' => [5, 10, 25, 50],
            'search' => $search,
            'page' => $page,
        ]);
    }

    /**
     * Tambah atau ubah artikel
     */
    public function changePost(Request $request)
    {
        $validated = $request->validate([
            'artikelId' => 'nullable|exists:artikels,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|string',
            'isPublished' => 'boolean',
        ], [
            'title.required' => 'Judul tidak boleh kosong',
            'title.max' => 'Judul maksimal 255 karakter',
            'content.required' => 'Konten tidak boleh kosong',
            'content.min' => 'Konten minimal 10 karakter',
    
        ]);

        try {
            if ($validated['artikelId']) {
                // Update
                $artikel = ArtikelModel::findOrFail($validated['artikelId']);
                $artikel->update([
                    'title' => $validated['title'],
                    'content' => $validated['content'],
                    'category' => $validated['category'],
                    'is_published' => $validated['isPublished'],
                ]);

                return redirect()->route('artikel')->with('success', 'Artikel berhasil diperbarui!');
            } else {
                // Create
                ArtikelModel::create([
                    'title' => $validated['title'],
                    'content' => $validated['content'],
                    'category' => $validated['category'],
                    'is_published' => $validated['isPublished'],
                    'user_id' => auth()->id(),
                ]);

                return redirect()->route('artikel')->with('success', 'Artikel berhasil ditambahkan!');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Hapus artikel
     */
    public function deletePost(Request $request)
    {
        $validated = $request->validate([
            'artikelIds' => 'required|array',
            'artikelIds.*' => 'exists:artikels,id',
        ], [
            'artikelIds.required' => 'Pilih artikel yang akan dihapus',
            'artikelIds.*.exists' => 'Artikel tidak ditemukan',
        ]);

        try {
            $count = ArtikelModel::whereIn('id', $validated['artikelIds'])->delete();

            return redirect()->route('artikel')->with('success', $count . ' artikel berhasil dihapus!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus: ' . $e->getMessage());
        }
    }
}
