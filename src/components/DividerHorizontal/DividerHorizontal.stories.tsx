import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Matrix, Stack, Width } from '../../catalog/Catalog'
import { DividerHorizontal } from './DividerHorizontal'

const ALIGNS = ['bottom', 'center', 'top', 'center-double'] as const
const ENDS = ['pointed', 'rounded'] as const

/**
 * Горизонтальный разделитель. Figma: кит, `Divider-horizontal` `12124:22493` — 4 Align × 2 Ends.
 *
 * Align — где линия 1px внутри полосы 8px; center-double — две линии в полосе 2px.
 * Ширина — по родителю. Интерактивных состояний нет.
 */
const meta = {
  title: 'Components/DividerHorizontal',
  component: DividerHorizontal,
  tags: ['autodocs'],
  args: {
    align: 'center',
    ends: 'pointed',
  },
  argTypes: {
    align: { control: 'inline-radio', options: ALIGNS },
    ends: { control: 'inline-radio', options: ENDS },
  },
  parameters: { layout: 'centered' },
  render: (args) => (
    <Width size="sm">
      <DividerHorizontal {...args} />
    </Width>
  ),
} satisfies Meta<typeof DividerHorizontal>

export default meta
type Story = StoryObj<typeof meta>

/** Линия по центру полосы — между блоками карточки. */
export const Center: Story = {}
/** Линия у нижнего края. */
export const Bottom: Story = { args: { align: 'bottom' } }
/** Линия у верхнего края. */
export const Top: Story = { args: { align: 'top' } }
/** Двойная линия — граница разделов. */
export const CenterDouble: Story = { args: { align: 'center-double' } }
/** Скруглённые концы. */
export const Rounded: Story = { args: { ends: 'rounded' } }

/** Матрица Align × Ends. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Align × Ends">
        <Matrix
          rows={ALIGNS}
          cols={ENDS}
          render={(a, e) => (
            <Width size="sm">
              <DividerHorizontal align={a} ends={e} />
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
