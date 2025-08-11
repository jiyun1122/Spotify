import NewReleases from "./pages/NewReleases"
import { BrowserRouter, Routes,Route } from "react-router-dom"
import { Layout } from "./components/layout/layout"
import { Home } from "./pages/Home"
import AlbumPageContainer from "./pages/AlbumPageContainer"
import ArtistPage from "./pages/ArtistPage"
import AudioPlayer from "./components/AudioPlayer"
import { AudioProvider } from "./context/AudioContext"
function App() {
 

  return (
    <AudioProvider>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/new" element={<NewReleases />} />
            <Route path="/album/:albumId" element={<AlbumPageContainer />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
          </Route>
      </Routes>

       <AudioPlayer />
      </BrowserRouter>
    </AudioProvider>
  )
}

export default App
