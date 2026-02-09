# Forms

Forms in Filament are built using a fluent, declarative API with 20+ field types.

## Defining a Form

```typescript
import { Form } from '@filament-ts/forms'
import { TextField, EmailField, SelectField } from '@filament-ts/fields'

static form(form: Form): Form {
  return form.schema([
    TextField.make('name')
      .label('Name')
      .required()
      .minLength(3)
      .placeholder('Enter name'),

    EmailField.make('email')
      .label('Email')
      .required()
      .unique('users', 'email'),

    SelectField.make('role')
      .label('Role')
      .options([
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ])
      .default('user'),
  ])
}
```

## Field Types

### Text Fields
- `TextField` - Single line text input
- `TextArea` - Multi-line text input
- `RichEditor` - WYSIWYG editor
- `MarkdownEditor` - Markdown editor

### Choice Fields
- `SelectField` - Dropdown select
- `RadioField` - Radio buttons
- `CheckboxField` - Single checkbox
- `CheckboxListField` - Multiple checkboxes
- `ToggleField` - On/off toggle

### Date & Time
- `DatePicker` - Date picker
- `DateTimePicker` - Date and time picker
- `TimePicker` - Time picker

### Numeric
- `NumberField` - Number input
- `RangeField` - Slider
- `CurrencyField` - Currency input

### Other
- `FileUpload` - File uploads
- `ColorPicker` - Color selection
- `TagsInput` - Tag input
- `KeyValueEditor` - Key-value pairs
- `Repeater` - Repeatable field groups
- `Builder` - Dynamic block templates

## Validation

```typescript
TextField.make('email')
  .required()
  .email()
  .unique('users', 'email')
  .rules(['email', 'max:255'])
```

## Layout

Organize fields into sections and grids:

```typescript
static form(form: Form): Form {
  return form.schema([
    Section.make('User Information')
      .schema([
        TextField.make('name').label('Name'),
        EmailField.make('email').label('Email'),
      ]),

    Section.make('Settings')
      .schema([
        ToggleField.make('active').label('Active'),
        SelectField.make('role').label('Role'),
      ]),
  ])
}
```

## Multi-Step Wizard

```typescript
static form(form: Form): Form {
  return form
    .wizard(true)
    .steps([
      WizardStep.make('Basic Info')
        .schema([TextField.make('name')]),
      WizardStep.make('Settings')
        .schema([ToggleField.make('active')]),
    ])
}
```

## Next

- [Tables](/resources/tables)
- [Actions](/resources/actions)
