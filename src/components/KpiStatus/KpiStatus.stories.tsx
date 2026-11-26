import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Matrix, Row, Stack } from '../../catalog/Catalog'
import { KpiStatus } from './KpiStatus'

const STATUSES = ['done', 'progress', 'fail', 'nodata'] as const
const TYPES = ['1', '1+1'] as const

/**
 * Статус выполнения KPI-показателя. Figma: kpi-bro · web, ext `KpiStatus` `164:663` —
 * Status done · progress · fail · nodata × Type 1 · 1+1 (8 ячеек); showLabel.
 * 1+1 — бейдж статуса + бейдж-значение (у nodata второго бейджа нет). Подпись в 1+1 показана всегда.
 */
const meta = {
  title: 'Components/KpiStatus',
  component: KpiStatus,
  tags: ['autodocs'],
  args: {
    status: 'done',
    type: '1',
    showLabel: true,
  },
  argTypes: {
    status: { control: 'inline-radio', options: STATUSES },
    type: { control: 'inline-radio', options: TYPES },
    showLabel: { control: 'boolean' },
    value: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof KpiStatus>

export default meta
type Story = StoryObj<typeof meta>

/** План выполнен. */
export const Done: Story = { args: { status: 'done' } }
/** В процессе. */
export const Progress: Story = { args: { status: 'progress' } }
/** Не выполнен. */
export const Fail: Story = { args: { status: 'fail' } }
/** Нет данных за период. */
export const NoData: Story = { args: { status: 'nodata' } }
/** Статус + значение: «Выполнение плана 98%». */
export const WithValue: Story = { args: { status: 'progress', type: '1+1', value: '98%' } }
/** Только иконка, без подписи. */
export const IconOnly: Story = { args: { showLabel: false } }

/** Матрица Type × Status и showLabel=false. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Status">
        <Matrix rows={TYPES} cols={STATUSES} render={(t, st) => <KpiStatus type={t} status={st} />} />
      </Block>
      <Block title="showLabel=false">
        <Row>
          {STATUSES.map((st) => (
            <KpiStatus key={st} status={st} showLabel={false} />
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
