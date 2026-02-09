# InfoLists

InfoLists provide read-only display of data, perfect for view pages.

## Defining an InfoList

```typescript
import { InfoList } from '@filament-ts/infolists'
import { TextEntry, IconEntry, ImageEntry } from '@filament-ts/infolists'

static infolist(infolist: InfoList): InfoList {
  return infolist.entries([
    TextEntry.make('name')
      .label('Name'),

    TextEntry.make('email')
      .label('Email'),

    IconEntry.make('status')
      .label('Status')
      ->icon('check-circle')
      ->color('green'),
  ])
}
```

## Entry Types

### Text Entries
- `TextEntry` - Plain text
- `BadgeEntry` - Colored badge
- `IconEntry` - Icon with text

### Media Entries
- `ImageEntry` - Image display
- `ColorEntry` - Color swatch

### Code Entries
- `CodeEntry` - Syntax-highlighted code

### Group Entries
- `RepeatableEntry` - List of items
- `KeyValueEntry` - Key-value pairs

## Layout

Organize entries into sections:

```typescript
static infolist(infolist: InfoList): InfoList {
  return infolist.schema([
    Section.make('User Information')
      ->schema([
        TextEntry.make('name')->label('Name'),
        TextEntry.make('email')->label('Email'),
      ]),

    Section.make('Metadata')
      ->schema([
        TextEntry.make('created_at')
          ->label('Created')
          ->dateFormat('MMM D, YYYY'),
      ]),
  ])
}
```

## Next

- [Actions](/resources/actions)
- [Widgets](/widgets/)
