
export  const getITunesPreviewUrl = async (trackName, artistName) => {
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(`${artistName} ${trackName}`)}&media=music&limit=1`
      );
      const data = await res.json();
      return data.results?.[0]?.previewUrl || null;
    } catch (err) {
      console.error("iTunes fetch 실패:", err);
      return null;
    }
}