# Server-Driven UI

Server-Driven UI (SDUI) is the core concept behind Filament. Instead of writing frontend code to build your admin panel, you define it on the server using declarative schemas.

## How It Works

1. **Server Definition**: You define forms, tables, and resources using TypeScript classes
2. **Serialization**: These definitions are serialized to JSON
3. **Client Rendering**: The client receives the JSON and renders the UI

## Example Flow

```mermaid
sequenceDiagram
    participant Server
    participant Client

    Server->>Client: Schema JSON
    Note over Client: {
      "type": "form",
      "fields": [
        {"type": "text", "label": "Name"},
        {"type": "email", "label": "Email"}
      ]
    }

    Client->>Client: Render Form
    User->>Client: Submit Form
    Client->>Server: Form Data
    Server->>Client: Response + Errors (if any)
```

## Benefits

- **No Frontend Code**: Focus on backend logic, not UI implementation
- **Instant Updates**: Change the UI without redeploying the frontend
- **Type Safety**: Shared types between server and client
- **Consistency**: All UIs follow the same patterns

## Schema Protocol

The SDUI protocol is based on a simple JSON schema:

```typescript
interface Schema {
  type: string           // Component type
  id?: string            // Unique identifier
  props?: Record<string, any>  // Properties
  children?: Schema[]    // Nested components
  meta?: SchemaMeta      // Metadata
}
```

Learn more in the [Architecture](/guide/architecture) guide.
