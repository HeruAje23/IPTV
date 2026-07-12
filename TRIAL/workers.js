export default {
  async fetch(request) {
    const req = new URL(request.url);
    const ua = request.headers.get("User-Agent") || "";

    // ⚙️ KONFIGURASI UTAMA
    const FILE_DAFTAR = "https://heruaje23.github.io/IPTV/IPTV16juni2026.m3u";
    const BANNER = "https://heruaje23.github.io/IPTV/BANNER/Banner.m3u8";
    const LINK_WA = "https://wa.me/6289673371560";
    const LINK_TELEGRAM = "https://t.me/heruaje23";

    // ⏱️ Waktu kadaluarsa WIB
    const kadaluarsaWIB = new Date(2026, 5, 26, 23, 59);
    const KADALUARSA = Math.floor(kadaluarsaWIB.getTime() / 1000) - 7 * 3600;
    const SEKARANG = Math.floor(Date.now() / 1000);

    // ✅ Deteksi pemutar IPTV
    const isPlayer = /ExoPlayer|VLC|FFmpeg|MPV|OTT Navigator|IPTV|hls|dash|mpd|okhttp|Dalvik|Android|Kodi|XBMC|Xtream/i.test(ua);
    // ✅ Deteksi browser
    const isBrowser = /Chrome|Safari|Firefox|Edg|Edge|Opera|OPR|UC|SamsungBrowser|MiuiBrowser/i.test(ua);

    // ❌ Lempar ke WA kalau dibuka lewat browser / bukan pemutar
    if (!isPlayer || isBrowser) {
      return Response.redirect(LINK_WA, 302);
    }

    // ⏳ Kalau masa percobaan habis
    if (SEKARANG > KADALUARSA) {
      return new Response(
`#EXTM3U
#EXTINF:-1 group-title="❌ TRIAL HABIS ❌",TRIAL HABIS
${BANNER}
#EXTINF:-1 group-title="📞 HUBUNGI ADMIN",📲 WA: 6289673371560
${LINK_WA}
#EXTINF:-1 group-title="📞 HUBUNGI ADMIN",📢 Telegram: @heruaje23
${LINK_TELEGRAM}`,
      {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // ✅ Tampilkan daftar channel saat masih aktif
    try {
      const res = await fetch(FILE_DAFTAR, {
        headers: { "User-Agent": ua, "Referer": "https://heruaje23.github.io/" },
        redirect: "follow"
      });
      if (!res.ok) throw new Error("Gagal memuat daftar");
      return new Response(res.body, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, no-cache"
        }
      });
    } catch (err) {
      return new Response(
`#EXTM3U
#EXTINF:-1,❌ ERROR: ${err.message}
${BANNER}
# Hubungi WA: 6289673371560`,
        { headers: { "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8" } }
      );
    }
  }
};
