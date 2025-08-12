import useAuthStore from "../stores/authStore";
import axiosInstance from "./axiosInstance";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

export async function getAccessToken() {
  const { accessToken, expiresAt, setAuth } = useAuthStore.getState();

  if (accessToken && expiresAt && Date.now() < expiresAt) {
    return accessToken; 
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${ CLIENT_SECRET}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  const data = await res.json();

  setAuth({
    accessToken: data.access_token,
    expiresIn: data.expires_in, 
  });

  return data.access_token;
}


export async function fetchNewReleases() {

  const res = await axiosInstance.get("/browse/new-releases");
  return res.data.albums.items;  
}
export async function fetchAlbumById(albumId) {
  try {
    const res = await axiosInstance.get(`/albums/${albumId}`);
    return res.data;
  } catch (error){
    throw new Error(`앨범 정보를 가져오지 못했습니다. 상태코드: ${error.response?.status}`);
  }
  }
export async function searchArtistByName(name) {
  const res = await axiosInstance.get('/search',{
    params:{
      q: name,
      type: "artist",
      limit: 1,
    }
  });
  return res.data.artists.items[0];
}
export async function getArtistTopTracks(artistId) {
  try {
    const res = await axiosInstance.get(`/artists/${artistId}/top-tracks`,{
      params: {
        market: "US",
      },
    });
    return res.data.tracks;
  } catch (error) {
    throw new Error(`대표곡을 가져오지 못했습니다. 상태코드: ${error.response?.status}`);
  }
}
export async function getArtistInfo(artistId) {
  try {
    const res = await axiosInstance.get(`/artists/${artistId}`);
    return res.data
  } catch (error) {
    throw new Error(`아티스트 정보를 불러오지 못했습니다. 상태코드: ${error.response?.status}`);
  }
}