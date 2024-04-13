import { createRouter } from '@storeon/router'

export default createRouter([
  ['/', () => ({ page: 'home' })],
  ['/movies', () => ({ page: 'movies' })],
  ['/movies/:id', (id) => ({ page: 'movie', id })],
  ['/new', () => ({ page: 'new' })],
  ['/languages', () => ({ page: 'languages' })],
  ['/languages/:name', (name) => ({ page: 'language', name })],
  ['/collections', () => ({ page: 'collections' })],
  ['/collections/:name', (name) => ({ page: 'collection', name })],
  ['/genres', () => ({ page: 'genres' })],
  ['/genres/:name', (name) => ({ page: 'genre', name })],
  ['*', () => ({ page: 'notFound' })],

])