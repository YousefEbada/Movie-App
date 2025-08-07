import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Movie, ApiResponse, MovieDetails } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly API_KEY = 'f5a452626cda4ba2ce56b27606b67f70';
  private readonly BASE_URL = 'https://api.themoviedb.org/3';
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  private readonly BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

  private watchlistSubject = new BehaviorSubject<Movie[]>([]);
  public watchlist$ = this.watchlistSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedWatchlist = localStorage.getItem('movieWatchlist');
    if (savedWatchlist) {
      this.watchlistSubject.next(JSON.parse(savedWatchlist));
    }
  }

  getPopularMovies(page: number = 1): Observable<ApiResponse> {
    return this.http
      .get<any>(
        `${this.BASE_URL}/movie/popular?api_key=${this.API_KEY}&page=${page}`
      )
      .pipe(
        map((response) => ({
          page: response.page,
          total_pages: response.total_pages,
          total_results: response.total_results,
          results: response.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title || movie.original_title || 'Untitled',
            original_title: movie.original_title || movie.title || 'Untitled',
            poster_path: movie.poster_path
              ? `${this.IMAGE_BASE_URL}${movie.poster_path}`
              : '/placeholder.svg?height=300&width=200&text=No+Image',
            backdrop_path: movie.backdrop_path
              ? `${this.IMAGE_BASE_URL}${movie.backdrop_path}`
              : undefined,
            vote_average: movie.vote_average ?? 0,
            release_date: movie.release_date || '',
            runtime: movie.runtime ?? 0,
            overview: movie.overview || 'No overview available.',
            genres: movie.genres || [],
            genre_ids: movie.genre_ids || [],
            popularity: movie.popularity ?? 0,
            original_language: movie.original_language || 'N/A',
            isInWatchlist: this.isInWatchlist(movie.id),
          })),
        }))
      );
  }

  getMovieDetails(id: number): Observable<MovieDetails> {
    return this.http
      .get<MovieDetails>(`${this.BASE_URL}/movie/${id}?api_key=${this.API_KEY}`)
      .pipe(
        map((movie) => ({
          ...movie,
          poster_path: movie.poster_path
            ? `${this.IMAGE_BASE_URL}${movie.poster_path}`
            : '/placeholder.svg?height=400&width=300&text=No+Image',
          backdrop_path: movie.backdrop_path
            ? `${this.BACKDROP_BASE_URL}${movie.backdrop_path}`
            : undefined,
          isInWatchlist: this.isInWatchlist(movie.id),
        }))
      );
  }

  getMovieRecommendations(id: number): Observable<Movie[]> {
    return this.http
      .get<any>(
        `${this.BASE_URL}/movie/${id}/recommendations?api_key=${this.API_KEY}`
      )
      .pipe(
        map((response) =>
          response.results.slice(0, 6).map((movie: any) => ({
            id: movie.id,
            title: movie.title || movie.original_title || 'Untitled',
            original_title: movie.original_title || movie.title || 'Untitled',
            poster_path: movie.poster_path
              ? `${this.IMAGE_BASE_URL}${movie.poster_path}`
              : '/placeholder.svg?height=300&width=200&text=No+Image',
            backdrop_path: movie.backdrop_path
              ? `${this.IMAGE_BASE_URL}${movie.backdrop_path}`
              : undefined,
            vote_average: movie.vote_average ?? 0,
            release_date: movie.release_date || '',
            runtime: movie.runtime ?? 0,
            overview: movie.overview || '',
            genres: movie.genres || [],
            genre_ids: movie.genre_ids || [],
            popularity: movie.popularity ?? 0,
            original_language: movie.original_language || 'N/A',
            isInWatchlist: this.isInWatchlist(movie.id),
          }))
        )
      );
  }

  searchMovies(query: string, page: number = 1): Observable<ApiResponse> {
    return this.http
      .get<any>(
        `${this.BASE_URL}/search/movie?api_key=${this.API_KEY}&query=${query}&page=${page}`
      )
      .pipe(
        map((response) => ({
          page: response.page,
          total_pages: response.total_pages,
          total_results: response.total_results,
          results: response.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title || movie.original_title || 'Untitled',
            original_title: movie.original_title || movie.title || 'Untitled',
            poster_path: movie.poster_path
              ? `${this.IMAGE_BASE_URL}${movie.poster_path}`
              : '/placeholder.svg?height=300&width=200&text=No+Image',
            backdrop_path: movie.backdrop_path
              ? `${this.IMAGE_BASE_URL}${movie.backdrop_path}`
              : undefined,
            vote_average: movie.vote_average ?? 0,
            release_date: movie.release_date || '',
            runtime: movie.runtime ?? 0,
            overview: movie.overview || '',
            genres: movie.genres || [],
            genre_ids: movie.genre_ids || [],
            popularity: movie.popularity ?? 0,
            original_language: movie.original_language || 'N/A',
            isInWatchlist: this.isInWatchlist(movie.id),
          })),
        }))
      );
  }

  toggleWatchlist(movie: Movie): void {
    const currentWatchlist = this.watchlistSubject.value;
    const index = currentWatchlist.findIndex((m) => m.id === movie.id);

    if (index > -1) {
      currentWatchlist.splice(index, 1);
    } else {
      currentWatchlist.push({ ...movie, isInWatchlist: true });
    }

    this.watchlistSubject.next([...currentWatchlist]);
    localStorage.setItem('movieWatchlist', JSON.stringify(currentWatchlist));
  }

  isInWatchlist(movieId: number): boolean {
    return this.watchlistSubject.value.some((movie) => movie.id === movieId);
  }

  getWatchlist(): Observable<Movie[]> {
    return this.watchlist$;
  }

  formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  getYear(dateString: string): number {
    return new Date(dateString).getFullYear();
  }
}
