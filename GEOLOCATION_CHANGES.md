# Geolocation-Based Hotel Filtering

This document outlines the changes made to implement geolocation-based hotel filtering instead of text-based location filtering.

## Overview

The application now filters hotels based on their proximity to a selected location using geographic coordinates rather than text matching.

## Key Changes

### 1. New API Endpoint
- **File**: `app/api/places/details/route.ts`
- **Purpose**: Fetches place details including coordinates from Google Places API
- **Usage**: Called when a user selects a location to get its coordinates

### 2. Geolocation Utilities
- **File**: `app/utils/geoUtils.ts`
- **Functions**:
  - `calculateDistance()`: Calculates distance between two coordinates using Haversine formula
  - `filterHotelsByProximity()`: Filters hotels within a specified radius of a target location

### 3. Enhanced LocationSelect Component
- **File**: `app/HomePage/Header/MiddleSearchBox/LocationSelect/LocationSelect.tsx`
- **Changes**:
  - Fetches coordinates when a location is selected
  - Stores coordinates in the location object
  - Added radius selector (10km, 25km, 50km, 100km)
  - Shows current radius in the location display

### 4. Updated Filtering Logic
- **File**: `app/HomePage/HomePage.tsx`
- **Changes**:
  - Replaced text-based location filtering with proximity-based filtering
  - Added `searchRadius` state (default: 50km)
  - Uses `filterHotelsByProximity()` function

### 5. Map Visualization
- **File**: `app/HomePage/MapView/MapView.tsx`
- **Changes**:
  - Added Circle component to visualize search radius
  - Added marker for selected location center
  - Visual feedback for the search area

## How It Works

1. **Location Selection**: User searches and selects a location from Google Places autocomplete
2. **Coordinate Fetching**: System fetches the location's coordinates using Google Places Details API
3. **Radius Selection**: User can choose search radius (10km, 25km, 50km, or 100km)
4. **Hotel Filtering**: Hotels are filtered based on their proximity to the selected location
5. **Map Visualization**: Selected location and search radius are displayed on the map

## Data Structure

Hotels have geolocation data in this format:
```json
{
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  }
}
```

Selected locations now include coordinates:
```json
{
  "name": "Location Name",
  "description": "Location Description",
  "place_id": "google_place_id",
  "coordinates": [longitude, latitude]
}
```

## Benefits

1. **Accurate Filtering**: Uses actual geographic distance instead of text matching
2. **Flexible Radius**: Users can adjust search radius based on their needs
3. **Visual Feedback**: Map shows the search area clearly
4. **Better UX**: More intuitive location-based search experience

## Technical Notes

- Coordinates are stored in GeoJSON format: [longitude, latitude]
- Distance calculations use the Haversine formula for accuracy
- Default search radius is 50km
- Google Places API is used for location search and coordinate fetching 