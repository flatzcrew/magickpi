import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Matrix, Stack, Width } from '../../catalog/Catalog'
import { MonthProgress } from './MonthProgress'

const STATUSES = ['done', 'progress', 'fail', 'nodata'] as const
const VALUES = [0, 25, 50, 75, 100] as const

/**
 * Прогресс месяца в колонке матрицы сотрудника. Figma: kpi-bro · web, ext `MonthProgress` `174:1319` —
 * Status 4 × Value 5 = 20 ячеек; тексты label, value (в React — `valueText`), period; булев showPeriod.
 *
 * Шкала из 4 сегментов с шагом 25%: закрашено Value/25 сегментов цветом статуса.
 * Точное значение — подписью `valueText`. Не интерактивен.
 */
const meta = {
  title: 'Components/MonthProgress',
  component: MonthProgress,
  tags: ['autodocs'],
  args: {
    status: 'progress',
    value: 75,
    label: 'Выполнение плана',
    valueText: '79%',
    period: 'Ноябрь 2026',
    showPeriod: true,
  },
  argTypes: {
    status: { control: 'inline-radio', options: STATUSES },
    value: { control: 'inline-radio', options: VALUES },
    label: { control: 'text' },
    valueText: { control: 'text' },
    period: { control: 'text' },
    showPeriod: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Width size="md">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof MonthProgress>

export default meta
type Story = StoryObj<typeof meta>

/** План месяца выполнен. */
export const Done: Story = { args: { status: 'done', value: 100, valueText: '98%' } }
/** Месяц в процессе. */
export const Progress: Story = { args: { status: 'progress', value: 50, valueText: '52%' } }
/** План не выполнен. */
export const Fail: Story = { args: { status: 'fail', value: 25, valueText: '31%' } }
/** Данных за месяц нет. */
export const NoData: Story = { args: { status: 'nodata', value: 0, valueText: '—' } }
/** Без подписи периода. */
export const WithoutPeriod: Story = { args: { showPeriod: false } }

/** Матрица Status × Value — 20 ячеек для сверки с Figma. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="Status × Value">
        <Matrix
          rows={STATUSES}
          cols={VALUES}
          render={(st, v) => (
            <Width size="md">
              <MonthProgress status={st} value={v} label="Ноябрь 2026" valueText={`${v}%`} period="1–30 ноября" showPeriod />
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
