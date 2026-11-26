import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Row, Stack, Stateful } from '../../catalog/Catalog'
import type { TopNavOption } from '../TopNav'
import { Chart, DEMO_CHART_DATA } from './Chart'

const PERIODS: TopNavOption[] = ['Неделя', 'Месяц', 'Квартал', 'Год'].map((p) => ({ value: p, label: p }))
/** Выполнение плана по месяцам, %. */
const MONTHLY: number[] = [62, 70, 68, 81, 77, 90, 94, 88, 98]

/**
 * Карточка-график дашборда. Figma: кит, `Chart` `16187:3670` — одиночный, без свойств.
 * Линия строится из `data` в inline SVG (масштаб по min / max), без графических библиотек; периоды — `TopNav` sm.
 * Переход по стрелке включает `action` — Feature-icon становится кнопкой. Наведение пунктов нативное.
 */
const meta = {
  title: 'Components/Chart',
  component: Chart,
  tags: ['autodocs'],
  args: {
    label: 'Выполнение плана',
    labelIcon: 'info',
    value: '98%',
    change: '+4%',
    data: MONTHLY,
    periods: PERIODS,
    period: 'Месяц',
    featureIcon: 'arrow-right-up',
    onPeriodChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    labelIcon: { control: 'text' },
    value: { control: 'text' },
    change: { control: 'text' },
    data: { control: 'object' },
    periods: { control: 'object' },
    period: { control: 'text' },
    onPeriodChange: { control: false },
    featureIcon: { control: 'text' },
    action: { control: 'object' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Chart>

export default meta
type Story = StoryObj<typeof meta>

/** Выполнение плана по месяцам. */
export const Default: Story = {}
/** Форма линии из кита (`DEMO_CHART_DATA`). */
export const KitShape: Story = { args: { data: DEMO_CHART_DATA, label: 'Закрытые задачи', value: '226', change: '+24%' } }
/** Без переключателя периодов и стрелки. */
export const Minimal: Story = { args: { periods: [], featureIcon: false, labelIcon: false } }
/** Стрелка — кнопка перехода к отчёту. */
export const WithAction: Story = { args: { action: { 'aria-label': 'Открыть отчёт', onClick: fn() } } }
/** Живое переключение периода. */
export const LivePeriod: Story = {
  render: (args) => (
    <Stateful initial="Месяц">{(v, set) => <Chart {...args} period={v} onPeriodChange={set} />}</Stateful>
  ),
}

/** Варианты содержимого рядом. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Содержимое">
        <Row>
          <Labeled label="default">
            <Chart label="Выполнение плана" value="98%" change="+4%" data={MONTHLY} periods={PERIODS} period="Месяц" />
          </Labeled>
          <Labeled label="без периодов и стрелки">
            <Chart label="Закрытые задачи" value="226" change="+24%" periods={[]} featureIcon={false} />
          </Labeled>
        </Row>
      </Block>
    </Stack>
  ),
}
