import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Frame, Labeled, Row, Stack, Width } from '../../catalog/Catalog'
import { Scroller } from './Scroller'

const TYPES = ['vertical', 'horizontal'] as const

/**
 * Полоса прокрутки. Figma: кит, `Scroller` `12124:22602` — Type: vertical · horizontal.
 *
 * Визуальная полоса: длина по родителю, ползунок 64. Положение и длину ползунка задаёт потребитель
 * CSS-переменными `--scroller-offset` и `--scroller-thumb`. Интерактивных состояний нет.
 * Ползунок полупрозрачный белый — лучше виден в тёмной теме.
 */
const meta = {
  title: 'Components/Scroller',
  component: Scroller,
  tags: ['autodocs'],
  args: {
    type: 'vertical',
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
  },
  parameters: { layout: 'centered' },
  render: (args) =>
    args.type === 'horizontal' ? (
      <Width size="sm">
        <Scroller {...args} />
      </Width>
    ) : (
      <Frame>
        <Scroller {...args} />
      </Frame>
    ),
} satisfies Meta<typeof Scroller>

export default meta
type Story = StoryObj<typeof meta>

/** Вертикальная — у списка сотрудников. */
export const Vertical: Story = { args: { type: 'vertical' } }
/** Горизонтальная — у широкой таблицы KPI. */
export const Horizontal: Story = { args: { type: 'horizontal' } }

/** Оба Type. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type">
        <Row>
          <Labeled label="vertical">
            <Frame>
              <Scroller type="vertical" />
            </Frame>
          </Labeled>
          <Labeled label="horizontal">
            <Width size="sm">
              <Scroller type="horizontal" />
            </Width>
          </Labeled>
        </Row>
      </Block>
    </Stack>
  ),
}
