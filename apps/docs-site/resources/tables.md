# Tables

Tables display your data with sorting, filtering, and pagination.

## Defining a Table

```typescript
import { Table } from '@filament-ts/tables'
import { TextColumn, BooleanColumn } from '@filament-ts/tables'

static table(table: Table): Table {
  return table.columns([
    TextColumn.make('name')
      .label('Name')
      .sortable()
      .searchable(),

    TextColumn.make('email')
      .label('Email')
      .sortable(),

    BooleanColumn.make('active')
      .label('Active')
      .sortable()
      .toggle(),
  ])
}
```

## Column Types

### Text Columns
- `TextColumn` - Basic text
- `BadgeColumn` - Colored badge
- `IconColumn` - Icon with optional text

### Media Columns
- `ImageColumn` - Image thumbnail
- `ColorColumn` - Color swatch

### Data Columns
- `BooleanColumn` - Yes/No with optional toggle
- `NumberColumn` - Formatted numbers
- `DateColumn` - Formatted dates
- `CurrencyColumn` - Currency formatting

### Select Columns
- `SelectColumn` - Dropdown select
- `CheckboxColumn` - Checkbox
- `ToggleColumn` - Toggle switch

### Input Columns
- `TextInputColumn` - Inline text input
- `CheckboxInputColumn` - Inline checkbox

## Sorting

```typescript
TextColumn.make('name')
  .sortable()           // Enable sorting
  .defaultSort('desc')  // Default sort direction
```

## Searching

```typescript
TextColumn.make('name')
  .searchable()         // Enable global search
```

## Filters

Add filters to your table:

```typescript
static table(table: Table): Table {
  return table
    .columns([...])
    .filters([
      SelectFilter.make('role')
        .label('Role')
        .options(RoleOptions),

      TernaryFilter.make('active')
        .label('Active'),

      QueryBuilderFilter.make('advanced')
        .label('Advanced'),
    ])
}
```

## Actions

Add row and bulk actions:

```typescript
static table(table: Table): Table {
  return table
    .columns([...])
    .actions([
      EditAction.make(),
      DeleteAction.make(),
      ViewAction.make(),
    ])
    .bulkActions([
      BulkDeleteAction.make(),
      BulkExportAction.make(),
    ])
}
```

## Pagination

Configure pagination:

```typescript
static table(table: Table): Table {
  return table
    .columns([...])
    .paginated([10, 25, 50, 100])
    .defaultPerPage(25)
}
```

## Next

- [InfoLists](/resources/infolists)
- [Actions](/resources/actions)
