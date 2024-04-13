import React from 'react'
import { Route, useParams, Routes } from 'react-router-dom'
import Home from './Home/Home'
import Movie from './Movie/Movie'
import Languages from './Languages/Languages'
import Collections from './Collections/Collections'
import Genres from './Genres/Genres'
import Movies from './Movies/Movies'
import useQuery from '../hooks/useQuery'
import NewMovie from './NewMovie/NewMovie'

function MovieWithID() {
  const { id } = useParams();
  return <Movie movieID={id as string} />;
}

function MoviesByGenre() {
  const query = useQuery()
  const nameGenre = query.get('name')
  return <Movies type='genre' filter={nameGenre as string} />;
}

function MoviesByLanguage() {
  const query = useQuery()
  const nameLanguage = query.get('name')
  return <Movies type='language' filter={nameLanguage as string} />;
}

function MoviesByCollection() {
  const query = useQuery()
  const nameCollection = query.get('name')
  return <Movies type='collection' filter={nameCollection as string} />;
}

const Page = () => {
  return (
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={<MovieWithID />} />
          <Route path="/new" element={<NewMovie />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/language" element={<MoviesByLanguage />} />
          <Route path='/collections' element={<Collections />} />
          <Route path="/collection" element={<MoviesByCollection />} />
          <Route path='/genres' element={<Genres />} />
          <Route path="/genre" element={<MoviesByGenre />} />
        </Routes>
      </main>
  )
}

export default Page