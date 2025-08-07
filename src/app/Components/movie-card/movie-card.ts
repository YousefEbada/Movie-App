import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  @Input() movie!: Movie;
  @Output() watchlistToggle = new EventEmitter<Movie>();

  constructor(private router: Router, private movieService: MovieService) {}

  toggleWatchlist(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.watchlistToggle.emit(this.movie);
  }

  navigateToDetail(): void {
    this.router.navigate(['/movie', this.movie.id]);
  }

  getYear(date?: string): string {
    if (!date) return '';
    return new Date(date).getFullYear().toString();
  }
}
