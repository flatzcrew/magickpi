import type { Meta, StoryObj } from '@storybook/react-vite'
import { SemanticSection } from './Foundation'

/**
 * Смысловые переменные (Semantic, 🌈 Theme): каждая ссылается на примитив — отдельно в Light и в Dark.
 * Превью — живая переменная в текущей теме (переключатель «Тема» на панели). Источник — src/tokens/semantics.css.
 */
const meta = {
  title: 'Foundation/Semantic',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Все семантические переменные. */
export const All: Story = { name: 'Все', render: () => <SemanticSection /> }
/** Surface/* — фоны. */
export const Surface: Story = { render: () => <SemanticSection group="surface" /> }
/** Text/* — цвета текста. */
export const Text: Story = { render: () => <SemanticSection group="text" /> }
/** Outline/* — обводки. */
export const Outline: Story = { render: () => <SemanticSection group="outline" /> }
/** Inverse/* — альфа-слои белого и чёрного, инвертируются темой. */
export const Inverse: Story = { render: () => <SemanticSection group="inverse" /> }
/** Overlay/* — затемнения и наложения. */
export const Overlay: Story = { render: () => <SemanticSection group="overlay" /> }
/** Elevation/* — цвета теней и подсветок (геометрия теней — в Primitive → Effects). */
export const Elevation: Story = { render: () => <SemanticSection group="elevation" /> }
/** Keyboard/* — перенесены ради полноты Theme (компонент клавиатуры не переносится). */
export const Keyboard: Story = { render: () => <SemanticSection group="keyboard" /> }
/** Transparent/*. */
export const Transparent: Story = { render: () => <SemanticSection group="transparent" /> }
