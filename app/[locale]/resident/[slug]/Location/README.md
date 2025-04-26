# Location Component

This component displays a Google Map with the property location and a list of distances to nearby amenities.

## Setup Requirements

1. You need to create a `.env.local` file in the root of your project with your Google Maps API key:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

2. Make sure the following dependencies are installed:
   - @react-google-maps/api
   - react-icons

To install these dependencies:
```bash
npm install @react-google-maps/api react-icons
```

## Component Usage

The Location component is used to display:
- A Google Map centered on the property location
- A list of distances to nearby amenities with icons

The component is fully responsive and styled with Tailwind CSS. 