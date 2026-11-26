import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Matrix, Row, Stack, Stateful } from '../../catalog/Catalog'
import { Button } from '../Button'
import { KipiAvatar } from './KipiAvatar'

const STATES = ['welcome', 'idle', 'thinking', 'error', 'success'] as const
const SIZES = [36, 96] as const

/**
 * Персонаж-ассистент Кипи. Figma: kpi-bro · web, ext · illustration `KipiAvatar` `165:719` —
 * State welcome · idle · thinking · error · success × Size 36 · 96 (10 ячеек).
 * Не аватар пользователя. Art — SVG дизайнера (hex допустим только в слое Art). Состояние нельзя передавать
 * только персонажем — рядом нужен текст. Без `label` иллюстрация декоративная.
 */
const meta = {
  title: 'Components/KipiAvatar',
  component: KipiAvatar,
  tags: ['autodocs'],
  args: {
    state: 'welcome',
    size: 96,
    label: 'Кипи',
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES },
    size: { control: 'inline-radio', options: SIZES },
    label: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof KipiAvatar>

export default meta
type Story = StoryObj<typeof meta>

/** Приветствие — пустой экран чата. */
export const Welcome: Story = { args: { state: 'welcome', label: 'Кипи приветствует' } }
/** Ожидание. */
export const Idle: Story = { args: { state: 'idle', label: 'Кипи ждёт вопрос' } }
/** Кипи думает над ответом. */
export const Thinking: Story = { args: { state: 'thinking', label: 'Кипи думает' } }
/** Ошибка ответа. */
export const ErrorState: Story = { args: { state: 'error', label: 'Кипи не смог ответить' } }
/** Успех — план собран. */
export const Success: Story = { args: { state: 'success', label: 'Кипи собрал план' } }
/** Маленький размер — в сообщении чата. */
export const Small: Story = { args: { size: 36 } }

/** Матрица Size × State. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Size × State">
        <Matrix rows={SIZES} cols={STATES} render={(sz, st) => <KipiAvatar size={sz} state={st} />} />
      </Block>
    </Stack>
  ),
}

const LIVE_STATES = ['welcome', 'idle', 'thinking', 'success', 'error'] as const

/** Живая смена состояния: каждое переключение — Кипи слегка подпрыгивает; в thinking тихо «дышит». */
export const StateSwitch: Story = {
  name: 'Смена состояния (прыжок)',
  args: { size: 96 },
  render: (args) => (
    <Stateful<number> initial={0}>
      {(i, set) => (
        <Stack>
          <KipiAvatar {...args} state={LIVE_STATES[i % LIVE_STATES.length]} label="Кипи" />
          <Row>
            <Button type="secondary" size="sm" onClick={() => set(i + 1)}>
              Следующее состояние · сейчас {LIVE_STATES[i % LIVE_STATES.length]}
            </Button>
          </Row>
        </Stack>
      )}
    </Stateful>
  ),
}
