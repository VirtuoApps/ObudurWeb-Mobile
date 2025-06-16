// utils/googlePlacesService.ts
export class GooglePlacesService {
  private static readonly BASE_URL = '/api/places';

  static async getCountrySuggestions(input: string): Promise<any[]> {
    const response = await fetch(
      `${this.BASE_URL}/autocomplete?input=${encodeURIComponent(input)}&types=(regions)&language=tr`
    );
    const data = await response.json();
    return data.predictions || [];
  }

  static async getStateSuggestions(input: string, countryCode: string): Promise<any[]> {
    const response = await fetch(
      `${this.BASE_URL}/autocomplete?input=${encodeURIComponent(input)}&types=administrative_area_level_1&components=country:${countryCode}&language=tr`
    );
    const data = await response.json();
    return data.predictions || [];
  }

  static async getCitySuggestions(input: string, countryCode: string): Promise<any[]> {
    const response = await fetch(
      `${this.BASE_URL}/autocomplete?input=${encodeURIComponent(input)}&types=(cities)&components=country:${countryCode}&language=tr`
    );
    const data = await response.json();
    return data.predictions || [];
  }

  static async getDistrictSuggestions(input: string, countryCode: string): Promise<any[]> {
    const response = await fetch(
      `${this.BASE_URL}/autocomplete?input=${encodeURIComponent(input)}&types=sublocality&components=country:${countryCode}&language=tr`
    );
    const data = await response.json();
    return data.predictions || [];
  }

  static async getPlaceDetails(placeId: string): Promise<any> {
    const response = await fetch(`${this.BASE_URL}/details?place_id=${placeId}&language=tr`);
    const data = await response.json();
    return data.result;
  }
}