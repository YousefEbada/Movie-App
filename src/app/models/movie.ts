export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  runtime?: number;
  overview: string;
  genres?: Genre[];
  original_language: string;
  isInWatchlist?: boolean;
  genre_ids?: number[];
  popularity?: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  production_companies: ProductionCompany[];
  homepage?: string;
}

export interface ApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
