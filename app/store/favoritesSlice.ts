import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

interface Favorite {
  _id: string;
  userId: string;
  hotelId: string;
  createdAt: string;
  updatedAt: string;
  hotelDetails?: any;
  populatedData?: any;
  manager?: any;
}

interface FavoritesState {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

// Fetch user favorites
export const fetchUserFavorites = createAsyncThunk(
  "favorites/fetchUserFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/favorites/my");
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch favorites");
    }
  }
);

// Add to favorites
export const addToFavorites = createAsyncThunk(
  "favorites/addToFavorites",
  async (hotelId: string, { rejectWithValue }) => {
    try {
      axiosInstance.post(`/favorites/hotels/${hotelId}`);
      return hotelId;
    } catch (error) {
      return rejectWithValue("Failed to add to favorites");
    }
  }
);

// Remove from favorites
export const removeFromFavorites = createAsyncThunk(
  "favorites/removeFromFavorites",
  async (hotelId: string, { rejectWithValue }) => {
    try {
      axiosInstance.delete(`/favorites/hotels/${hotelId}`);
      return hotelId;
    } catch (error) {
      return rejectWithValue("Failed to remove from favorites");
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to favorites
      .addCase(addToFavorites.fulfilled, (state, action) => {
        // We just add the hotelId to an optimistic favorite object
        // Next fetch will get the full data
        const hotelId = action.payload;
        if (!state.favorites.some((fav) => fav.hotelId === hotelId)) {
          state.favorites.push({
            _id: `temp-${hotelId}`,
            userId: "",
            hotelId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      })

      // Remove from favorites
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        const hotelId = action.payload;
        state.favorites = state.favorites.filter(
          (favorite) => favorite.hotelId !== hotelId
        );
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
