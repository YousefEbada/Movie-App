import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { CommonModule, DecimalPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-watchlist',
  imports: [CommonModule, RouterModule, DecimalPipe, SlicePipe],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.css',
})
export class Watchlist implements OnInit, OnDestroy {
  watchlistMovies: Movie[] = [];
  private watchlistSubscription: Subscription = new Subscription();

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.watchlistSubscription = this.movieService
      .getWatchlist()
      .subscribe((movies) => {
        this.watchlistMovies = movies;
      });
  }

  ngOnDestroy(): void {
    this.watchlistSubscription.unsubscribe();
  }

  removeFromWatchlist(movie: Movie): void {
    this.movieService.toggleWatchlist(movie);
  }

  navigateToDetail(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
  }

  getStars(rating: number): { filled: boolean }[] {
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
}
