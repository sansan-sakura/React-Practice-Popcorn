import { useEffect, useState } from "react";
const API_KEY = "1442ef2";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("somthing went wrong with fetching movies");

        const data = await res.json();
        console.log(data);
        if (data.Response === "False") throw new Error("Movie is not found");
        setMovies(data.Search);
      } catch (error) {
        console.error(error);
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
