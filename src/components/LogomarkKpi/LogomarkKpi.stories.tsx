import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Row, Stack } from '../../catalog/Catalog'
import { LogomarkKpi } from './LogomarkKpi'

const SIZES = [28, 32, 36] as const

/**
 * Логомарк продукта KPI (шапка Sidebar, экран входа). Figma: кит, набор `Logomark-KPI`
 * (set key `012e8b44f8c07a479db2cf18c162b0b3916fa5e9`, id узла в ките не определён); копия в kpi-bro · web `46:1418`. Type: default.
 *
 * Знак — src/assets/logomark-kpi/logomark.svg, снят из сайдбара экранов kpi-bro · web (Sidebar 91:969) 2026-11-26.
 * Размеры инстансов кита: 36 (Sidebar expanded) · 28 (Sidebar collapsed-compact).
 */
const meta = {
  title: 'Components/LogomarkKpi',
  component: LogomarkKpi,
  tags: ['autodocs'],
  args: {
    type: 'default',
    size: 36,
    label: 'KPI Bro',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['default'] },
    size: { control: 'inline-radio', options: SIZES },
    label: { control: 'text' },
    children: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LogomarkKpi>

export default meta
type Story = StoryObj<typeof meta>

/** 36 — шапка развёрнутого Sidebar. */
export const Size36: Story = { args: { size: 36 } }
/** 28 — шапка свёрнутого Sidebar. */
export const Size28: Story = { args: { size: 28 } }

/** Оба размера. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type default × Size">
        <Row>
          {SIZES.map((sz) => (
            <Labeled key={sz} label={String(sz)}>
              <LogomarkKpi size={sz} />
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
