import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Matrix, Stack, Width } from '../../catalog/Catalog'
import { ResultBanner } from './ResultBanner'

const TYPES = ['month-result', 'my-matrix'] as const
const STATUSES = ['done', 'progress', 'fail', 'nodata'] as const

/**
 * Итог месяца. Figma: kpi-bro · web, ext `ResultBanner` `174:1349` — Type: month-result · my-matrix (2 ячейки); текст title.
 *
 * month-result — заголовок и `KpiStatus` в строку (SCR-03); my-matrix — заголовок, статус и ссылка столбцом (SCR-13).
 * Сам баннер не интерактивен, кликабельна только ссылка (наведение у неё нативное).
 */
const meta = {
  title: 'Components/ResultBanner',
  component: ResultBanner,
  tags: ['autodocs'],
  args: {
    type: 'month-result',
    title: 'Результат за ноябрь — 98%',
    status: 'done',
    linkLabel: 'Ваши задачи не отправлены',
    onLinkClick: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    title: { control: 'text' },
    status: { control: 'inline-radio', options: STATUSES },
    linkLabel: { control: 'text' },
    linkHref: { control: 'text' },
    onLinkClick: { control: false },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Width size="lg">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof ResultBanner>

export default meta
type Story = StoryObj<typeof meta>

/** Итог месяца на экране матрицы (SCR-03). */
export const MonthResult: Story = { args: { type: 'month-result' } }
/** Моя матрица: итог и ссылка на неотправленные задачи (SCR-13). */
export const MyMatrix: Story = { args: { type: 'my-matrix', title: 'Результат за ноябрь — 79%', status: 'progress' } }

/** Type и Type × Status для сверки с Figma. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="Type">
        <Stack>
          {TYPES.map((t) => (
            <Labeled key={t} label={t}>
              <Width size="lg">
                <ResultBanner type={t} title="Результат за ноябрь — 79%" status="progress" />
              </Width>
            </Labeled>
          ))}
        </Stack>
      </Block>
      <Block title="Type × Status">
        <Matrix rows={TYPES} cols={STATUSES} render={(t, st) => <ResultBanner type={t} status={st} title="Ноябрь 2026" />} />
      </Block>
    </Stack>
  ),
}
