import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Matrix, Row, Stack } from '../../catalog/Catalog'
import { Button } from '../Button'
import { DividerVertical } from './DividerVertical'

const ALIGNS = ['right', 'center', 'left', 'center-double'] as const
const ENDS = ['pointed', 'rounded'] as const

/**
 * Вертикальный разделитель. Figma: кит, `Divider-vertical` `12124:22532` — 4 Align × 2 Ends.
 *
 * Align — где линия 1px внутри полосы 8px; center-double — две линии в полосе 2px.
 * Высота — по родителю (`align-self: stretch`), поэтому в stories он стоит между двумя кнопками в ряду.
 * Интерактивных состояний нет.
 */
const meta = {
  title: 'Components/DividerVertical',
  component: DividerVertical,
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
    <Row>
      <Button type="flat" size="xl">План</Button>
      <DividerVertical {...args} />
      <Button type="flat" size="xl">Факт</Button>
    </Row>
  ),
} satisfies Meta<typeof DividerVertical>

export default meta
type Story = StoryObj<typeof meta>

/** Линия по центру полосы — между группами действий. */
export const Center: Story = {}
/** Линия у правого края. */
export const Right: Story = { args: { align: 'right' } }
/** Линия у левого края. */
export const Left: Story = { args: { align: 'left' } }
/** Двойная линия — граница колонок. */
export const CenterDouble: Story = { args: { align: 'center-double' } }
/** Скруглённые концы. */
export const Rounded: Story = { args: { ends: 'rounded' } }

/** Матрица Ends × Align. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Ends × Align">
        <Matrix
          rows={ENDS}
          cols={ALIGNS}
          render={(e, a) => (
            <Row>
              <Button type="flat" size="xl">План</Button>
              <DividerVertical align={a} ends={e} />
              <Button type="flat" size="xl">Факт</Button>
            </Row>
          )}
        />
      </Block>
    </Stack>
  ),
}
