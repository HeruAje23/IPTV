export default {
  async fetch(request) {
    const req = new URL(request.url);
    const ua = request.headers.get("User-Agent") || "";

    // ⚙️ KONFIGURASI UTAMA
    const FILE_DAFTAR = "https://heruaje23.github.io/IPTV/IPTV16juni2026.m3u";
    const BANNER = "https://heruaje23.github.io/IPTV/BANNER/Banner.m3u8";
    const LINK_WA = "https://wa.me/6289673371560";
    const LINK_TELEGRAM = "https://t.me/heruaje23";

    // ✅ DETEKSI PEMUTAR — persis sesuai daftar kamu, lengkap semua variasi tulisan
    const isPlayer = /ExoPlayer|VLC|FFmpeg|OTT Navigator|OTTNavigator|OTTNAVIGATOR|OTT NAVIGATOR|ottnavigator|ottnav|IPTV|hls|okhttp|Dalvik|Kodi|Xtream/i.test(ua);

    // ✅ DETEKSI BROWSER — tetap ketat untuk mencegah akses lewat peramban
    const isBrowser = /Chrome|Safari|Firefox|Edg|Edge|Opera|OPR|UC|SamsungBrowser|MiuiBrowser|Brave|Vivaldi/i.test(ua);

    // ❌ Lempar ke WA jika dibuka lewat browser ATAU bukan pemutar yang diizinkan
    if (!isPlayer || isBrowser) {
      return Response.redirect(LINK_WA, 302);
    }

    // ✅ Langsung tampilkan daftar selamanya tanpa batas waktu
    try {
      const res = await fetch(FILE_DAFTAR, {
        headers: {
          "User-Agent": ua,
          "Referer": "https://heruaje23.github.io/",
          "Accept": "*/*"
        },
        redirect: "follow"
      });

      if (!res.ok) throw new Error(`Gagal memuat: ${res.status} ${res.statusText}`);

      return new Response(res.body, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-Content-Type-Options": "nosniff"
        }
      });

    } catch (err) {
      return new Response(
`#EXTM3U
#EXTINF:-1 group-title="⚠️ KESALAHAN",Tidak dapat memuat daftar
${BANNER}
#EXTINF:-1 group-title="📞 HUBUNGI ADMIN",📲 WA: 6289673371560
${LINK_WA}`,
        {
          headers: {
            "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
            "Cache-Control": "no-store"
          }
        }
      );
    }
  }
};
