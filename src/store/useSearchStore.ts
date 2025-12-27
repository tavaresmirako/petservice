import { create } from 'zustand';

interface SearchState {
  searchTerm: string;
  selectedCategory: string;
  selectedCity: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedCity: (city: string) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchTerm: '',
  selectedCategory: 'all',
  selectedCity: 'all',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedCity: (selectedCity) => set({ selectedCity }),
  resetFilters: () => set({ searchTerm: '', selectedCategory: 'all', selectedCity: 'all' }),
}));
