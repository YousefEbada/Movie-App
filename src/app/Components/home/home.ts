import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { Pagination } from '../pagination/pagination';
import { MovieCard } from '../movie-card/movie-card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination, MovieCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  movies: Movie[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  loading: boolean = false;
  isSearchMode: boolean = false;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;

    const request = this.isSearchMode
      ? this.movieService.searchMovies(this.searchQuery, this.currentPage)
      : this.movieService.getPopularMovies(this.currentPage);

    request.subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalPages = Math.min(response.total_pages, 500);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.isSearchMode = true;
      this.currentPage = 1;
      this.loadMovies();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isSearchMode = false;
    this.currentPage = 1;
    this.loadMovies();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onWatchlistToggle(movie: Movie): void {
    this.movieService.toggleWatchlist(movie);

    const movieIndex = this.movies.findIndex((m) => m.id === movie.id);
    if (movieIndex > -1) {
      this.movies[movieIndex].isInWatchlist =
        !this.movies[movieIndex].isInWatchlist;
    }
  }
}
