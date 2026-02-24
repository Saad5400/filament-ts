import assert from 'node:assert/strict'

import { test } from '@japa/runner'

import {
  Alignment,
  AMBER,
  BLUE,
  CanBeCollapsed,
  CanBeCopied,
  CanOpenUrl,
  CanSpanColumns,
  Cancel,
  ColorManager,
  Component,
  FontFamily,
  FontWeight,
  GREEN,
  Halt,
  HasActions,
  HasAlignment,
  HasBadge,
  HasChildComponents,
  HasColor,
  HasDescription,
  HasExtraAttributes,
  HasHint,
  HasIcon,
  HasId,
  HasLabel,
  HasMeta,
  HasName,
  HasState,
  HasTooltip,
  HasVisibility,
  HasWeight,
  HasWidth,
  IconManager,
  IconPosition,
  IconSize,
  Operation,
  RED,
  Size,
  Width,
  cn,
  convertToOklch,
  generatePalette,
  isLightColor,
  labelFromName,
  resolve,
  slugify,
} from '@driven/support'

test.group('Milestone 1: Resolve + Component', () => {
  test('resolve supports static values and callbacks', () => {
    assert.equal(resolve('hello', {}), 'hello')

    const value = resolve((context) => context.operation, {
      operation: Operation.Edit,
    })

    assert.equal(value, Operation.Edit)
  })

  test('resolve uses provided context object in callback evaluation', () => {
    const value = resolve((context) => `${context.operation}:${context.state?.id}`, {
      operation: Operation.View,
      state: { id: 14 },
    })

    assert.equal(value, 'view:14')
  })

  test('Component supports context evaluation', () => {
    class SampleComponent extends Component {}

    const component = new SampleComponent({ operation: Operation.View })
    const value = component.evaluate((context) => context.operation)

    assert.equal(value, Operation.View)
  })

  test('Configurable defaults are applied to make/new instances', () => {
    class ConfigurableComponent extends Component {
      value = 0
    }

    ConfigurableComponent.configureUsing((component) => {
      component.value = 42
    })

    const made = ConfigurableComponent.make()
    assert.equal(made.value, 42)
    assert.equal(new ConfigurableComponent().value, 0)
  })

  test('Configurable inherits and orders callbacks from parent to child', () => {
    class Parent extends Component {
      trace = []
    }

    class Child extends Parent {}

    Parent.configureUsing((component) => {
      component.trace.push('parent')
    })

    Child.configureUsing((component) => {
      component.trace.push('child')
    })

    const instance = Child.make()
    assert.deepEqual(instance.trace, ['parent', 'child'])
  })
})

test.group('Milestone 1: Concerns', () => {
  test('HasLabel + HasName + HasIcon + HasColor composition works', () => {
    class Subject extends HasColor(HasIcon(HasLabel(HasName(Component)))) {}

    const subject = Subject.make()
      .name('post_title')
      .label((context) => `${context.operation ?? 'none'} label`)
      .hiddenLabel(false)
      .icon('lucide:file')
      .color('primary')

    assert.equal(subject.getName(), 'post_title')
    assert.equal(subject.getLabel({ operation: Operation.Create }), 'create label')
    assert.equal(subject.isLabelHidden(), false)
    assert.equal(subject.getIcon(), 'lucide:file')
    assert.equal(subject.getColor(), 'primary')
  })

  test('HasColor falls back to defaultColor when color is absent', () => {
    class Subject extends HasColor(Component) {}

    const subject = Subject.make().defaultColor('warning')

    assert.equal(subject.getColor(), 'warning')
  })

  test('HasId returns custom ids with fallback', () => {
    class Subject extends HasId(Component) {}

    const subject = Subject.make().id('custom-id')

    assert.equal(subject.getCustomId(), 'custom-id')
    assert.equal(subject.getId('fallback'), 'custom-id')
  })

  test('HasVisibility supports visible/hidden + operation-specific rules', () => {
    class Subject extends HasVisibility(Component) {}

    const hiddenOnEdit = Subject.make().hiddenOn(Operation.Edit)
    assert.equal(hiddenOnEdit.isHidden({ operation: Operation.Edit }), true)
    assert.equal(hiddenOnEdit.isVisible({ operation: Operation.Create }), true)

    const visibleOnView = Subject.make().visibleOn([Operation.View, Operation.Edit])
    assert.equal(visibleOnView.isVisible({ operation: Operation.View }), true)
    assert.equal(visibleOnView.isHidden({ operation: Operation.Create }), true)
  })

  test('HasVisibility prioritizes hidden over visible conditions', () => {
    class Subject extends HasVisibility(Component) {}

    const subject = Subject.make().visible(true).hidden(true)

    assert.equal(subject.isHidden(), true)
    assert.equal(subject.isVisible(), false)
  })

  test('HasDescription + HasHint + HasTooltip resolve dynamic values', () => {
    class Subject extends HasTooltip(HasHint(HasDescription(Component))) {}

    const subject = Subject.make()
      .description((context) => `desc:${context.operation}`)
      .hint('help text')
      .tooltip((context) => `tip:${context.operation}`)

    assert.equal(subject.getDescription({ operation: Operation.Create }), 'desc:create')
    assert.equal(subject.hasHint(), true)
    assert.equal(subject.getHint(), 'help text')
    assert.equal(subject.getTooltip({ operation: Operation.View }), 'tip:view')
  })

  test('HasBadge handles values and color', () => {
    class Subject extends HasBadge(Component) {}

    const subject = Subject.make().badge(3).badgeColor('success')

    assert.equal(subject.getBadge(), 3)
    assert.equal(subject.getBadgeColor(), 'success')
  })

  test('HasAlignment resolves enum helpers', () => {
    class Subject extends HasAlignment(Component) {}

    const subject = Subject.make().alignCenter()

    assert.equal(subject.getAlignment(), Alignment.Center)
  })

  test('HasWeight + HasWidth return normalized values', () => {
    class Subject extends HasWidth(HasWeight(Component)) {}

    const subject = Subject.make().weight(FontWeight.Bold).width(320)

    assert.equal(subject.getWeight(), FontWeight.Bold)
    assert.equal(subject.getWidth(), '320px')
  })

  test('HasExtraAttributes merges with class concatenation', () => {
    class Subject extends HasExtraAttributes(Component) {}

    const subject = Subject.make()
      .extraAttributes({ class: 'a', 'data-id': 1 })
      .extraAttributes({ class: 'b', role: 'button' }, true)

    assert.deepEqual(subject.getExtraAttributes(), {
      class: 'a b',
      'data-id': 1,
      role: 'button',
    })
  })

  test('HasExtraAttributes replaces previous attributes when merge=false', () => {
    class Subject extends HasExtraAttributes(Component) {}

    const subject = Subject.make()
      .extraAttributes({ class: 'first', 'data-id': 1 })
      .extraAttributes({ class: 'second' }, false)

    assert.deepEqual(subject.getExtraAttributes(), {
      class: 'second',
    })
  })

  test('CanOpenUrl supports state/context based urls and target flag', () => {
    class Subject extends CanOpenUrl(Component) {}

    const subject = Subject.make().url((context) => `/records/${context.state?.id}`, true)

    assert.equal(subject.hasStateBasedUrls(), true)
    assert.equal(subject.getUrl({ state: { id: 9 } }), '/records/9')
    assert.equal(subject.shouldOpenUrlInNewTab(), true)
  })

  test('CanOpenUrl detects state-based urls only when callback expects args', () => {
    class Subject extends CanOpenUrl(Component) {}

    const staticUrl = Subject.make().url('/static')
    const closureWithoutArgs = Subject.make().url(() => '/computed')

    assert.equal(staticUrl.hasStateBasedUrls(), false)
    assert.equal(closureWithoutArgs.hasStateBasedUrls(), false)
  })

  test('CanBeCopied configures copy behavior and defaults', () => {
    class Subject extends CanBeCopied(Component) {}

    const subject = Subject.make()
      .copyable()
      .copyableState('ABC')
      .copyMessage('Done')
      .copyMessageDuration(3000)

    assert.equal(subject.isCopyable(), true)
    assert.equal(subject.getCopyableState(), 'ABC')
    assert.equal(subject.getCopyMessage(), 'Done')
    assert.equal(subject.getCopyMessageDuration(), 3000)

    const defaults = Subject.make().copyable()
    assert.equal(defaults.getCopyMessage(), 'Copied')
    assert.equal(defaults.getCopyMessageDuration(), 2000)
  })

  test('HasMeta supports deep paths and multi-get checks', () => {
    class Subject extends HasMeta(Component) {}

    const subject = Subject.make().meta('section.title', 'Posts').meta('enabled', true)

    assert.equal(subject.getMeta('section.title'), 'Posts')
    assert.deepEqual(subject.getMeta(['section.title', 'enabled']), {
      'section.title': 'Posts',
      enabled: true,
    })
    assert.equal(subject.hasMeta(['section.title', 'enabled']), true)
  })

  test('HasMeta returns undefined/false for missing keys', () => {
    class Subject extends HasMeta(Component) {}

    const subject = Subject.make().meta('existing.key', 1)

    assert.equal(subject.getMeta('missing.key'), undefined)
    assert.equal(subject.hasMeta('missing.key'), false)
  })

  test('CanBeCollapsed tracks collapsible state', () => {
    class Subject extends CanBeCollapsed(Component) {}

    const subject = Subject.make().collapsed().persistCollapsed()

    assert.equal(subject.isCollapsed(), true)
    assert.equal(subject.isCollapsible(), true)
    assert.equal(subject.shouldPersistCollapsed(), true)
  })

  test('CanSpanColumns resolves spans and starts', () => {
    class Subject extends CanSpanColumns(Component) {}

    const subject = Subject.make().columnSpan(2).columnStart({ lg: 3 }).columnSpanFull()

    assert.equal(subject.getColumnSpan('default'), 'full')
    assert.equal(subject.getColumnStart('lg'), 3)
  })

  test('CanSpanColumns supports closure values returning breakpoint maps', () => {
    class Subject extends CanSpanColumns(Component) {}

    const subject = Subject.make().columnSpan((context) => ({
      default: context.operation === Operation.Create ? 2 : 1,
      xl: 4,
    }))

    assert.equal(subject.getColumnSpan('default', { operation: Operation.Create }), 2)
    assert.equal(subject.getColumnSpan('xl'), 4)
  })

  test('HasChildComponents handles keyed component lists', () => {
    class Subject extends HasChildComponents(Component) {}

    const subject = Subject.make()
      .components([{ key: 'a' }])
      .childComponents((context) => [{ key: context.operation }], 'footer')

    assert.deepEqual(subject.getDefaultChildComponents(), [{ key: 'a' }])
    assert.deepEqual(subject.getChildComponents('footer', { operation: Operation.Edit }), [
      { key: Operation.Edit },
    ])

    const schemas = subject.getChildSchemas({ operation: Operation.View })
    assert.deepEqual(Object.keys(schemas).sort(), ['default', 'footer'])
  })

  test('HasState supports default values, hooks, casts, and dehydration', () => {
    class Subject extends HasState(Component) {}

    let hydrated = false
    let oldValue

    const stateCast = {
      get(value) {
        return Number(value) * 2
      },
      set(value) {
        return Number(value) / 2
      },
    }

    const subject = Subject.make()
      .statePath('count')
      .default(5)
      .stateCast(stateCast)
      .afterStateHydrated(() => {
        hydrated = true
      })
      .afterStateUpdated((state, oldState) => {
        oldValue = oldState
        assert.equal(state, 8)
      })
      .beforeStateDehydrated((state) => Number(state) + 1)

    assert.equal(subject.getState(), 5)

    subject.state(8)
    assert.equal(oldValue, undefined)

    const dehydrated = subject.dehydrateState()
    assert.deepEqual(dehydrated, {
      count: 18,
    })

    subject.hydrateState(20)
    assert.equal(hydrated, true)
    assert.equal(subject.getState(), 10)
  })

  test('HasState respects dehydration flag and scalar output without state path', () => {
    class Subject extends HasState(Component) {}

    const subject = Subject.make().default(7).dehydrated(false)
    assert.equal(subject.dehydrateState(), undefined)

    subject.dehydrated(true)
    assert.equal(subject.dehydrateState(), 7)
  })

  test('HasState clearAfterStateUpdatedHooks removes all callbacks', () => {
    class Subject extends HasState(Component) {}

    let calls = 0
    const subject = Subject.make().afterStateUpdated(() => {
      calls += 1
    })

    subject.state(1)
    subject.clearAfterStateUpdatedHooks()
    subject.state(2)

    assert.equal(calls, 1)
  })

  test('HasActions registers and resolves named actions', () => {
    class Subject extends HasActions(Component) {}

    const edit = { name: 'edit', label: 'Edit' }
    const view = { name: 'view', label: 'View' }

    const subject = Subject.make().registerActions([edit, () => [view]])

    assert.equal(subject.hasAction('edit'), true)
    assert.equal(subject.getAction('view')?.label, 'View')

    subject.action(edit)
    assert.equal(subject.getAction()?.name, 'edit')
  })

  test('HasActions last registration wins for same action name', () => {
    class Subject extends HasActions(Component) {}

    const subject = Subject.make().registerActions([
      { name: 'edit', label: 'Old Edit' },
      { name: 'edit', label: 'New Edit' },
    ])

    assert.equal(subject.getAction('edit')?.label, 'New Edit')
  })

  test('HasActions resolves context-sensitive closures per context', () => {
    class Subject extends HasActions(Component) {}

    let calls = 0
    const subject = Subject.make().registerActions([
      (context) => {
        calls += 1

        return { name: 'edit', label: context.operation }
      },
    ])

    assert.equal(subject.getAction('edit', { operation: Operation.Create })?.label, Operation.Create)
    assert.equal(subject.getAction('edit', { operation: Operation.View })?.label, Operation.View)
    assert.equal(calls, 2)
  })
})

test.group('Milestone 1: Colors + Icons + Utils + Enums + Exceptions', () => {
  test('Color utilities and manager provide semantic palettes', () => {
    const oklch = convertToOklch('#ff0000')
    assert.equal(oklch.startsWith('oklch('), true)

    const palette = generatePalette('#ff0000')
    assert.equal(Object.keys(palette).length, 11)
    assert.equal(palette[500].includes('oklch('), true)

    assert.equal(isLightColor('#ffffff'), true)

    const manager = new ColorManager().register({ custom: '#3366ff' })
    const colors = manager.getColors()

    assert.deepEqual(colors.primary, AMBER)
    assert.deepEqual(colors.danger, RED)
    assert.deepEqual(colors.success, GREEN)
    assert.deepEqual(colors.info, BLUE)
    assert.equal(colors.custom[500].includes('oklch('), true)
  })

  test('generatePalette keeps achromatic colors at zero chroma', () => {
    const palette = generatePalette('#808080')

    assert.equal(palette[500].includes(' 0 '), true)
    assert.equal(palette[900].includes(' 0 '), true)
  })

  test('ColorManager supports closure-based registration with context', () => {
    const manager = new ColorManager().register((context) => ({
      contextual: context.operation === Operation.Edit ? '#00ff00' : '#ff00ff',
    }))

    const editColor = manager.getColor('contextual', { operation: Operation.Edit })
    const createColor = manager.getColor('contextual', { operation: Operation.Create })

    assert.equal(Boolean(editColor?.[500]?.includes('oklch(')), true)
    assert.equal(Boolean(createColor?.[500]?.includes('oklch(')), true)
    assert.notEqual(editColor?.[500], createColor?.[500])
  })

  test('IconManager resolves registered aliases and lucide defaults', () => {
    const manager = new IconManager().register({ danger: 'lucide:triangle-alert' })

    assert.equal(manager.resolve('danger'), 'lucide:triangle-alert')
    assert.equal(manager.resolve('plus'), 'lucide:plus')
  })

  test('IconManager resolves fallback aliases and custom resolvers', () => {
    const manager = new IconManager()
      .register({ one: 'lucide:1-circle' })
      .registerResolver((name) => (name === 'brand-logo' ? 'custom:brand-logo' : null))

    assert.equal(manager.resolve(['missing', 'one']), 'lucide:1-circle')
    assert.equal(manager.resolve('brand-logo'), 'custom:brand-logo')
  })

  test('string utilities and cn helper work', () => {
    assert.equal(labelFromName('postTitle_name'), 'Post Title Name')
    assert.equal(slugify('Hello World!'), 'hello-world')
    assert.equal(cn('px-2', 'px-4', ['text-sm', false, null]), 'px-4 text-sm')
  })

  test('string utilities normalize accented input', () => {
    assert.equal(slugify('Crème Brûlée'), 'creme-brulee')
  })

  test('flow control exceptions expose rollback toggles', () => {
    const cancel = new Cancel().rollBackDatabaseTransaction()
    const halt = new Halt().rollBackDatabaseTransaction()

    assert.equal(cancel.shouldRollbackDatabaseTransaction(), true)
    assert.equal(halt.shouldRollbackDatabaseTransaction(), true)
  })

  test('flow control exceptions default to no rollback', () => {
    assert.equal(new Cancel().shouldRollbackDatabaseTransaction(), false)
    assert.equal(new Halt().shouldRollbackDatabaseTransaction(), false)
  })

  test('enums expose expected canonical values', () => {
    assert.equal(Operation.Create, 'create')
    assert.equal(Operation.Edit, 'edit')
    assert.equal(Operation.View, 'view')

    assert.equal(Alignment.Center, 'center')
    assert.equal(Size.Medium, 'md')
    assert.equal(Width.Full, 'full')
    assert.equal(IconPosition.After, 'after')
    assert.equal(IconSize.TwoExtraLarge, '2xl')
    assert.equal(FontFamily.Sans, 'sans')
    assert.equal(FontWeight.SemiBold, 'semibold')
  })
})
