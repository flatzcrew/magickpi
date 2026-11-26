import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Row, Stack } from '../../catalog/Catalog'
import { Indicator } from './Indicator'

const STATES = ['active-1', 'active-2', 'inactive'] as const

/**
 * Точка-индикатор слайда или шага. Figma: кит, `Indicator` `14225:4055` — State: active-1 · active-2 · inactive.
 *
 * `state` здесь — вид точки, а не интерактивное состояние: active-1 — вытянутая брендовая,
 * active-2 — светлая точка, inactive — приглушённая. Из точек собирается PageIndicator.
 */
const meta = {
  title: 'Components/Indicator',
  component: Indicator,
  tags: ['autodocs'],
  args: {
    state: 'active-1',
    'aria-label': 'Шаг 1 из 3: план',
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Indicator>

export default meta
type Story = StoryObj<typeof meta>

/** Текущий шаг. */
export const Active1: Story = { args: { state: 'active-1' } }
/** Светлая активная точка. */
export const Active2: Story = { args: { state: 'active-2' } }
/** Неактивный шаг. */
export const Inactive: Story = { args: { state: 'inactive', 'aria-label': 'Шаг 2 из 3: факт' } }

/** Все State и ряд шагов «План → Факт → Согласование». */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="State">
        <Row>
          {STATES.map((st) => (
            <Labeled key={st} label={st}>
              <Indicator state={st} />
            </Labeled>
          ))}
        </Row>
      </Block>
      <Block title="Шаги: план · факт · согласование">
        <Row>
          <Indicator state="active-1" />
          <Indicator state="inactive" />
          <Indicator state="inactive" />
        </Row>
      </Block>
    </Stack>
  ),
}
