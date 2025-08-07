import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { MovieDetail } from './Components/movie-detail/movie-detail';
import { Watchlist } from './Components/watchlist/watchlist';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movie/:id', component: MovieDetail },
  { path: 'watchlist', component: Watchlist },
];
