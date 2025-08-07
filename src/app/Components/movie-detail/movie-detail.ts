import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie, MovieDetails } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule, DecimalPipe, MovieCard],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css',
})
export class MovieDetail implements OnInit {
  movie: MovieDetails | null = null;
  recommendations: Movie[] = [];
  loading: boolean = false;

  private languageNames: { [key: string]: string } = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ru: 'Russian',
    pt: 'Portuguese',
  };

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const movieId = +params['id'];
      this.loadMovieDetails(movieId);
      this.loadRecommendations(movieId);
    });
  }

  loadMovieDetails(id: number): void {
    this.loading = true;
    this.movieService.getMovieDetails(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movie details:', error);
        this.loading = false;
      },
    });
  }

  loadRecommendations(id: number): void {
    this.movieService.getMovieRecommendations(id).subscribe({
      next: (movies) => {
        this.recommendations = movies;
      },
      error: (error) => {
        console.error('Error loading recommendations:', error);
      },
    });
  }

  toggleWatchlist(): void {
    if (this.movie) {
      this.movieService.toggleWatchlist(this.movie);
      this.movie.isInWatchlist = !this.movie.isInWatchlist;
    }
  }

  onWatchlistToggle(movie: Movie): void {
    this.movieService.toggleWatchlist(movie);

    const movieIndex = this.recommendations.findIndex((m) => m.id === movie.id);
    if (movieIndex > -1) {
      this.recommendations[movieIndex].isInWatchlist =
        !this.recommendations[movieIndex].isInWatchlist;
    }
  }

  getStars(): { filled: boolean }[] {
    const rating = this.movie?.vote_average || 0;
    const stars = [];
    const fullStars = Math.floor(rating / 2);

    for (let i = 0; i < 5; i++) {
      stars.push({ filled: i < fullStars });
    }

    return stars;
  }

  getYear(date?: string): string {
    if (!date) return 'N/A';
    return new Date(date).getFullYear().toString();
  }

  formatRuntime(minutes: number): string {
    return this.movieService.formatRuntime(minutes);
  }

  getLanguageName(code: string): string {
    return this.languageNames[code] || code.toUpperCase();
  }
}
