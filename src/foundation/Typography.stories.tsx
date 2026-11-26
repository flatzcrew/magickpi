import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextStyles, TypefaceVars } from './Foundation'

/**
 * Типографика: 84 TextStyle кита строкой-примером и слой Typeface/*, через который они привязаны к 🆎 Font.
 * Источник — src/tokens/typography.css. На ширине до 767px размеры подменяются мобильными (Typeface-1-Mobile).
 */
const meta = {
  title: 'Foundation/Typography',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Все TextStyle. */
export const TextStylesAll: Story = { name: 'Text styles', render: () => <TextStyles /> }
/** Typeface/* — семейства, размеры, веса, межстрочные и трекинг для TextStyle. */
export const Typeface: Story = { render: () => <TypefaceVars /> }
