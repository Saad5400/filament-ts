/**
 * Base schema interface for all SDUI components
 */
export interface Schema {
  type: string
  id?: string
  props?: Record<string, any>
  children?: Schema[]
  meta?: SchemaMeta
}

/**
 * Schema metadata for rendering and behavior control
 */
export interface SchemaMeta {
  label?: string
  description?: string
  hidden?: boolean
  visible?: boolean | ((context: any) => boolean)
  order?: number
  [key: string]: any
}

/**
 * Abstract base class for all schema components
 * Provides fluent API for building declarative UI definitions
 */
export abstract class SchemaComponent {
  readonly id: string
  readonly type: string
  protected props: Map<string, any> = new Map()
  protected meta: Map<string, any> = new Map()

  protected constructor(id: string, type: string) {
    this.id = id
    this.type = type
  }

  /**
   * Set the label for this component
   */
  label(label: string): this {
    this.meta.set('label', label)
    return this
  }

  /**
   * Set the description for this component
   */
  description(description: string): this {
    this.meta.set('description', description)
    return this
  }

  /**
   * Hide this component
   */
  hidden(hidden: boolean = true): this {
    this.meta.set('hidden', hidden)
    return this
  }

  /**
   * Set the order of this component
   */
  order(order: number): this {
    this.meta.set('order', order)
    return this
  }

  /**
   * Serialize this component to JSON
   */
  toJSON(): Schema {
    return {
      type: this.type,
      id: this.id,
      props: this.props.size > 0 ? Object.fromEntries(this.props) : undefined,
      meta: this.meta.size > 0 ? Object.fromEntries(this.meta) : undefined,
    }
  }

  /**
   * Deserialize JSON to a schema component instance
   * This is a placeholder - subclasses should override this
   */
  static fromJSON(json: Schema): SchemaComponent {
    throw new Error('fromJSON must be implemented by subclass')
  }
}

/**
 * Factory to deserialize JSON to schema components
 */
export class SchemaFactory {
  private static registry = new Map<string, typeof SchemaComponent>()

  static register(type: string, component: typeof SchemaComponent): void {
    this.registry.set(type, component)
  }

  static fromJSON(json: Schema): SchemaComponent {
    const Component = this.registry.get(json.type)
    if (!Component) {
      throw new Error(`Unknown schema type: ${json.type}`)
    }
    return Component.fromJSON(json)
  }
}
