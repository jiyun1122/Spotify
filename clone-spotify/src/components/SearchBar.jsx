// components/SearchBar.jsx
import { useState, useEffect } from 'react';
import { getAccessToken } from '../api/spotify'; // 토큰 자동 갱신 함수

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchSpotify = async () => {
      try {
        const token = await getAccessToken();

        const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album,track&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const albums = data.albums?.items ?? [];
        const tracks = data.tracks?.items ?? [];

        const merged = [
          ...albums.map((a) => ({
            type: 'album',
            name: a.name,
            artist: a.artists[0]?.name,
            image: a.images[0]?.url,
          })),
          ...tracks.map((t) => ({
            type: 'track',
            name: t.name,
            artist: t.artists[0]?.name,
            image: t.album?.images[0]?.url,
          })),
        ];

        setResults(merged);
      } catch (err) {
        console.error('Spotify API 오류:', err);
      }
    };

    fetchSpotify();
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="원하는 음악을 검색하세요."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-white rounded-lg px-3 py-1 text-sm text-white"
      />

      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-8 bg-white shadow rounded-lg max-h-64 overflow-y-auto z-50">
          {results.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-10 h-10 rounded" />
              )}
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500">{item.artist} · {item.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}