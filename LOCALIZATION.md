# Localization System

This project uses next-intl for localization. Here's how to use and extend the system:

## Structure

- `/languages/` - Contains language JSON files (en.json, tr.json)
- `/app/i18n/` - Contains configuration for supported locales
- `/middleware.ts` - Handles locale routing
- `/app/[locale]/` - Locale-specific routes

## How to Use Translations

### In Server Components

```tsx
import { getTranslations } from 'next-intl/server';

export default async function YourServerComponent() {
  const t = await getTranslations('namespace');
  
  return <div>{t('key')}</div>;
}
```

### In Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function YourClientComponent() {
  const t = useTranslations('namespace');
  
  return <div>{t('key')}</div>;
}
```

### Language Switcher

The `LanguageSwitcher` component is already set up in the header. It will automatically switch between available languages.

## Adding New Translations

1. Add your translation keys and values to the JSON files in `/languages/`
2. Use the same structure across language files
3. Organize by namespaces (common, header, etc.)

## Available Languages

- English (en)
- Turkish (tr)

## Adding New Languages

1. Add the language code to the `locales` array in `/app/i18n/index.ts`
2. Create a new JSON file in `/languages/` (e.g., `fr.json`)
3. Copy the structure from an existing language file and translate the values

## Testing

To test different languages, navigate to:

- English: `/en`
- Turkish: `/tr`

Or use the language switcher in the header. 