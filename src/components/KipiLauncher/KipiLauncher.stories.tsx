import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Row, Stack, Stateful } from '../../catalog/Catalog'
import { KipiLauncher } from './KipiLauncher'

const STATES = ['idle', 'thinking', 'error', 'success'] as const

/**
 * Плавающая кнопка вызова Кипи — AI-ассистента сервиса. Figma: kpi-bro · web, ext `KipiLauncher` `165:897` — State 4 ячейки.
 *
 * Круг с `KipiAvatar` того же состояния. На экране стоит в правом нижнем углу (позицию задаёт родитель).
 * Здесь `state` — реальный статус Кипи (ждёт, думает, ошибка, готово), а не принудительное состояние;
 * наведение, нажатие и фокус — нативные.
 */
const meta = {
  title: 'Components/KipiLauncher',
  component: KipiLauncher,
  tags: ['autodocs'],
  args: {
    state: 'idle',
    onClick: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof KipiLauncher>

export default meta
type Story = StoryObj<typeof meta>

/** Кипи ждёт вопроса. */
export const Idle: Story = { args: { state: 'idle' } }
/** Кипи готовит ответ. */
export const Thinking: Story = { args: { state: 'thinking' } }
/** Ответ не получен. */
export const ErrorState: Story = { name: 'Error', args: { state: 'error' } }
/** Ответ готов — например, разбор выполнения плана за ноябрь. */
export const Success: Story = { args: { state: 'success' } }

/** Все 4 состояния; наведи и нажми — переход живой. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="State">
        <Row>
          {STATES.map((st) => (
            <Labeled key={st} label={st}>
              <KipiLauncher state={st} />
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}

const CYCLE = ['idle', 'thinking', 'success', 'error'] as const

/** Клик: круг чуть сжимается, Кипи подпрыгивает и переходит в следующее состояние (смена тоже с прыжком). */
export const ClickBounce: Story = {
  name: 'Клик (прыжок)',
  render: () => (
    <Stateful<number> initial={0}>
      {(i, set) => (
        <Labeled label={`Состояние: ${CYCLE[i % CYCLE.length]} — нажми на Кипи`}>
          <KipiLauncher state={CYCLE[i % CYCLE.length]} onClick={() => set(i + 1)} />
        </Labeled>
      )}
    </Stateful>
  ),
}
