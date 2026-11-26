import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Row, Stack, Stateful } from '../../catalog/Catalog'
import { Button } from '../Button'
import { PageIndicator } from './PageIndicator'

/**
 * Точки-индикаторы страниц (онбординг «Мои KPI», слайдер подсказок). Figma: кит, `Page-indicator` `14195:5866` — одиночный, +2 (Dot_3, Dot_4).
 * Ряд `Indicator`: текущая точка — active-1, остальные — inactive. Булевы Dot_3 / Dot_4 → `count`.
 * Не интерактивен сам по себе: текущую страницу задаёт `active`.
 */
const meta = {
  title: 'Components/PageIndicator',
  component: PageIndicator,
  tags: ['autodocs'],
  args: {
    count: 4,
    active: 0,
  },
  argTypes: {
    count: { control: { type: 'number', min: 2, max: 8 } },
    active: { control: { type: 'number', min: 0, max: 7 } },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PageIndicator>

export default meta
type Story = StoryObj<typeof meta>

/** Четыре точки, первая текущая — как в ките. */
export const Default: Story = {}
/** Две точки (Dot_3 и Dot_4 выключены). */
export const TwoDots: Story = { args: { count: 2 } }
/** Три точки (Dot_4 выключена). */
export const ThreeDots: Story = { args: { count: 3, active: 1 } }
/** Последняя страница. */
export const Last: Story = { args: { active: 3 } }

/** Живой онбординг: кнопки листают шаги. */
export const Interactive: Story = {
  render: (args) => (
    <Stateful initial={0}>
      {(v, set) => {
        const count = args.count ?? 4
        return (
          <Stack>
            <PageIndicator {...args} count={count} active={v} />
            <Row>
              <Button type="secondary" size="sm" disabled={v === 0} onClick={() => set(v - 1)}>
                Назад
              </Button>
              <Button type="primary" size="sm" disabled={v === count - 1} onClick={() => set(v + 1)}>
                Далее
              </Button>
            </Row>
          </Stack>
        )
      }}
    </Stateful>
  ),
}

/** Все положения текущей точки при count 2–4. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      {[2, 3, 4].map((count) => (
        <Block key={count} title={`count = ${count}`}>
          <Row>
            {Array.from({ length: count }, (_, a) => (
              <Labeled key={a} label={`active=${a}`}>
                <PageIndicator count={count} active={a} />
              </Labeled>
            ))}
          </Row>
        </Block>
      ))}
    </Stack>
  ),
}
