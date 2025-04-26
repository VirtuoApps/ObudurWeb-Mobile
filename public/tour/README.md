# 360 Virtual Tour Assets

This directory contains the images used for the 360-degree virtual tour feature.

## Directory Structure

- `/house/` - Contains 360-degree tour images for the house interior
  - Expected format: `house_1.jpg`, `house_2.jpg`, etc. (36 total images)

## Image Requirements

- Images should be high-quality JPGs
- All images should have the same dimensions for a smooth viewing experience
- Recommended dimensions: 2000px × 1000px (2:1 aspect ratio for 360-degree content)
- Images should be taken in sequence with consistent lighting

## Features

The 360-degree viewer supports:
- 360° View
- Zoom
- Pan
- Autoplay (with customizable speed and loops)
- Spin direction control
- Image caching
- Mobile-responsive design

## Usage

These images are loaded by the `ThreeSixty` component in the PanoramicView component to create an interactive 360-degree viewing experience.

## Customization

The component can be customized with these props:
- `amount`: Number of images (required)
- `imagePath`: Path to images (required)
- `fileName`: File name format with {index} placeholder (required)
- `spinReverse`: Reverse spin direction (optional, default: false)
- `autoplay`: Frames per second for autoplay (optional, default: 24)
- `loop`: Number of autoplay loops (optional, default: 1)
- `boxShadow`: Apply box shadow (optional, default: false)
- `buttonClass`: Button styling ("light" or "dark", optional, default: "light")
- `paddingIndex`: Add leading zeros to image index (optional, default: false)

To update the tour:
1. Replace the existing images with new ones
2. Keep the same naming convention (e.g., `house_1.jpg`, `house_2.jpg`, etc.)
3. Update the `amount` prop in the component if you change the number of frames 