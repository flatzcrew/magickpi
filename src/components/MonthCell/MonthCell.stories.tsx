import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Row, Stack, Stateful } from '../../catalog/Catalog'
import { MonthCell } from './MonthCell'

const PERIODS = ['closed', 'open', 'future'] as const
const STATES = ['default', 'hover', 'focus', 'selected', 'disabled'] as const
const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'] as const

/**
 * Ячейка месяца в поповере выбора периода (сетка 4 × 3). Figma: kpi-bro · web, ext `MonthCell` `226:1029` —
 * Period: closed · open · future × State: default · hover · focus · selected · disabled (9 ячеек в Figma); текст month.
 *
 * Period=open — зелёная точка в углу; future не кликабелен (всегда disabled).
 * Наведение и фокус — нативные; `state` только фиксирует состояние для сверки с Figma. Выбор — булев `selected`.
 * **На экранах не используется** (SCR-10 собран на Datepicker, решение 2026-11-25), в ДС остаётся.
 */
const meta = {
  title: 'Components/MonthCell',
  component: MonthCell,
  tags: ['autodocs'],
  args: {
    period: 'closed',
    month: 'Ноя',
    selected: false,
    onClick: fn(),
  },
  argTypes: {
    period: { control: 'inline-radio', options: PERIODS },
    state: { control: 'select', options: [undefined, ...STATES] },
    selected: { control: 'boolean' },
    month: { control: 'text' },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MonthCell>

export default meta
type Story = StoryObj<typeof meta>

/** Закрытый месяц: итоги подведены. */
export const Closed: Story = { args: { period: 'closed', month: 'Окт' } }
/** Открытый месяц — идёт работа. */
export const Open: Story = { args: { period: 'open', month: 'Ноя' } }
/** Будущий месяц — недоступен. */
export const Future: Story = { args: { period: 'future', month: 'Дек' } }
/** Выбранный месяц. */
export const Selected: Story = { args: { period: 'open', selected: true } }

/** Живой выбор месяца в сетке 4 × 3 (ноябрь 2026 открыт, декабрь — будущий). */
export const LiveGrid: Story = {
  render: () => (
    <Stateful initial="Ноя">
      {(v, set) => (
        <Row>
          {MONTHS.map((m, i) => (
            <MonthCell key={m} month={m} period={i < 10 ? 'closed' : i === 10 ? 'open' : 'future'} selected={v === m} onClick={() => set(m)} />
          ))}
        </Row>
      )}
    </Stateful>
  ),
}

/** Матрица Period × State; у future любое состояние сводится к disabled. Нижний блок — без state, наведение живое. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Period × State">
        <Matrix
          rows={PERIODS}
          cols={STATES}
          render={(p, st) => <MonthCell period={p} state={st} selected={st === 'selected'} month="Ноя" />}
        />
      </Block>
      <Block title="Без state (наведи и нажми Tab — переход живой)">
        <Row>
          {PERIODS.map((p) => (
            <MonthCell key={p} period={p} month="Ноя" />
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
