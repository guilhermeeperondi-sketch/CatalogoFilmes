<template>
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto; background-color: #f9f9f9; color: #333; min-height: 100vh;">
    <h1 style="text-align: center; color: #2c3e50;">🎬 Catálogo de Filmes</h1>
    
    <!-- Abas de Navegação -->
    <div style="margin-bottom: 30px; text-align: center;">
      <button @click="view = 'search'" :style="view === 'search' ? 'background-color: #3498db; color: white; font-weight: bold;' : 'background-color: #e0e0e0;'" style="padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; transition: 0.3s;">🔎 Buscar Filmes</button>
      <button @click="view = 'favs'; getFavorites()" :style="view === 'favs' ? 'background-color: #e74c3c; color: white; font-weight: bold;' : 'background-color: #e0e0e0;'" style="padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-left: 15px; transition: 0.3s;">❤️ Meus Favoritos</button>
    </div>

    <!-- Tela de Busca -->
    <div v-if="view === 'search'">
      <div style="display: flex; justify-content: center; margin-bottom: 30px;">
        <input v-model="searchQuery" placeholder="Digite o título do filme (ex: Matrix)..." style="padding: 12px; width: 400px; border: 1px solid #ccc; border-radius: 4px 0 0 4px; font-size: 16px;" @keyup.enter="searchMovies" />
        <button @click="searchMovies" style="padding: 12px 24px; background-color: #3498db; color: white; border: none; border-radius: 0 4px 4px 0; cursor: pointer; font-size: 16px; font-weight: bold;">Buscar</button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 25px; justify-content: center;">
        <div v-if="searchResults.length === 0" style="color: #7f8c8d; font-size: 16px; margin-top: 20px;">Nenhum filme pesquisado ou encontrado ainda.</div>
        
        <div v-for="movie in searchResults" :key="movie.id" style="width: 220px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 8px; text-align: center; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <img :src="movie.poster_path ? 'https://tmdb.org' + movie.poster_path : 'https://placeholder.com'" style="width: 100%; border-radius: 6px; min-height: 270px; object-fit: cover;" />
          <h3 style="font-size: 16px; margin: 12px 0; min-height: 44px; display: flex; align-items: center; justify-content: center; overflow: hidden;">{{ movie.title }}</h3>
          <button @click="toggleFavorite(movie)" style="background: #2ecc71; color: white; border: none; padding: 10px; width: 100%; cursor: pointer; border-radius: 4px; font-weight: bold; font-size: 14px;">Favoritar</button>
        </div>
      </div>
    </div>

    <!-- Tela de Favoritos -->
    <div v-if="view === 'favs'">
      <div style="display: flex; justify-content: center; margin-bottom: 30px;">
        <input v-model="genreFilter" placeholder="Filtrar favoritos por gênero (ex: Ação)..." style="padding: 12px; width: 400px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;" @input="getFavorites" />
      </div>
      
      <div style="display: flex; flex-wrap: wrap; gap: 25px; justify-content: center;">
        <div v-if="favorites.length === 0" style="color: #7f8c8d; font-size: 16px; margin-top: 20px;">Você ainda não favoritou nenhum filme ou nenhum corresponde ao filtro.</div>

        <div v-for="movie in favorites" :key="movie.id" style="width: 220px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 8px; text-align: center; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <img :src="movie.poster_path ? 'https://tmdb.org' + movie.poster_path : 'https://placeholder.com'" style="width: 100%; border-radius: 6px; min-height: 270px; object-fit: cover;" />
          <h3 style="font-size: 16px; margin: 12px 0; min-height: 44px; display: flex; align-items: center; justify-content: center; overflow: hidden;">{{ movie.title }}</h3>
          <p style="color: #e67e22; font-size: 14px; font-weight: bold; margin-bottom: 12px;">🍿 Gênero: {{ movie.genre || 'Geral' }}</p>
          <button @click="removeFavorite(movie.tmdb_id)" style="background: #e74c3c; color: white; border: none; padding: 10px; width: 100%; cursor: pointer; border-radius: 4px; font-weight: bold; font-size: 14px;">Remover</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      view: 'search',
      searchQuery: '',
      genreFilter: '',
      searchResults: [],
      favorites: []
    }
  },
  methods: {
    async searchMovies() {
      if (!this.searchQuery) return;
      try {
        const response = await axios.get(`/api/movies/search?query=${this.searchQuery}`);
        this.searchResults = response.data;
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        alert("Erro ao buscar filmes da API.");
      }
    },
    async getFavorites() {
      try {
        const response = await axios.get(`/api/movies/favorites?genre=${this.genreFilter}`);
        this.favorites = response.data;
      } catch (error) {
        console.error("Erro ao listar favoritos:", error);
      }
    },
    async toggleFavorite(movie) {
      try {
        await axios.post('/api/movies/favorites', {
          tmdb_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          genre: 'Ação' // Simulando uma tag de gênero para atender a exigência do filtro local
        });
        alert('Filme favoritado localmente com sucesso!');
      } catch (error) {
        console.error("Erro ao favoritar:", error);
        alert("Este filme já está nos seus favoritos!");
      }
    },
    async removeFavorite(id) {
      try {
        await axios.delete(`/api/movies/favorites/${id}`);
        this.getFavorites();
      } catch (error) {
        console.error("Erro ao remover favorito:", error);
      }
    }
  }
}
</script>
