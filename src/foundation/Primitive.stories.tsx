import type { Meta, StoryObj } from '@storybook/react-vite'
import { PrimitiveSection } from './Foundation'

/*
 * Foundation — все переменные ДС наглядно. Источник — src/tokens/*.css (снято из Figma Atomize PRO 3.4),
 * значения читаются из файлов, не копируются. Переключатель «Тема» на панели меняет Light / Dark.
 */

/* ---------- Primitive (глобальные) ---------- */

/** Глобальные переменные (Primitive): палитра, акцент, шрифт, отступы, радиусы, тени и размытия. */
const primitiveMeta = {
  title: 'Foundation/Primitive',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default primitiveMeta
type Story = StoryObj<typeof primitiveMeta>

/** 🍄 Primitives — базовая палитра: brand, grays, functional (info / success / warning / danger), black / white и альфа. */
export const Palette: Story = { render: () => <PrimitiveSection match={(s) => s.startsWith('🍄')} /> }

/** 🎨 Color Accent — палитры проектов (режим Accent-1); Color/brand/* ссылается сюда. */
export const ColorAccent: Story = { name: 'Color Accent', render: () => <PrimitiveSection match={(s) => s.startsWith('🎨')} /> }

/** 🆎 Font — семейства, размеры (web и mobile), веса, межстрочные, трекинг. */
export const Font: Story = { render: () => <PrimitiveSection match={(s) => s.startsWith('🆎')} /> }

/** 📐 Space — шкала отступов. */
export const Space: Story = { render: () => <PrimitiveSection match={(s) => s.startsWith('📐')} /> }

/** 🟢 Radius — шкала радиусов (общие, small-component, big-component). */
export const Radius: Story = { render: () => <PrimitiveSection match={(s) => s.startsWith('🟢')} /> }

/** Effect styles — тени Elevation, Pressed, эффекты компонентов (цвет — из Theme, поэтому зависят от темы). */
export const Effects: Story = { render: () => <PrimitiveSection match={(s) => s === 'Effect styles'} /> }

/** Blur — значения для backdrop-filter. */
export const Blur: Story = { render: () => <PrimitiveSection match={(s) => s === 'Blur'} /> }

