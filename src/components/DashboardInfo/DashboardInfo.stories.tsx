import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Row, Stack } from '../../catalog/Catalog'
import { DashboardInfo } from './DashboardInfo'

const TONES = ['success', 'neutral'] as const

/**
 * Блок-сводка дашборда: метрика и изменение. Figma: кит, `Dashboard-info` `16189:4286` — одиночный, без свойств
 * (тень `--elevation-e2`, фон `--blur-96`).
 * `changeTone` — оверрайд карточек-сводок (neutral), в ките изменение success. Ширина 400.
 */
const meta = {
  title: 'Components/DashboardInfo',
  component: DashboardInfo,
  tags: ['autodocs'],
  args: {
    label: 'Выполнение плана',
    labelIcon: 'info',
    value: '98%',
    change: '4%',
    changeIcon: 'up',
    changeTone: 'success',
    featureIcon: 'arrow-right-up',
  },
  argTypes: {
    label: { control: 'text' },
    labelIcon: { control: 'text' },
    value: { control: 'text' },
    change: { control: 'text' },
    changeIcon: { control: 'text' },
    changeTone: { control: 'inline-radio', options: TONES },
    featureIcon: { control: 'text' },
    action: { control: 'object' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DashboardInfo>

export default meta
type Story = StoryObj<typeof meta>

/** Рост — success. */
export const Success: Story = { args: { changeTone: 'success' } }
/** Без изменения — neutral, без иконки «вверх». */
export const Neutral: Story = { args: { label: 'Открытых задач', value: '19', change: '0', changeIcon: false, changeTone: 'neutral' } }
/** Без иконок — карточка-сводка SMART. */
export const Plain: Story = { args: { label: 'Сотрудников в команде', value: '12', labelIcon: false, featureIcon: false, change: null } }
/** Стрелка — кнопка перехода. */
export const WithAction: Story = { args: { action: { 'aria-label': 'Открыть матрицу', onClick: fn() } } }

/** changeTone и набор слоёв. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="changeTone">
        <Row>
          {TONES.map((t) => (
            <Labeled key={t} label={t}>
              <DashboardInfo label="Выполнение плана" value="98%" change={t === 'success' ? '4%' : '0%'} changeTone={t} />
            </Labeled>
          ))}
          <Labeled label="без иконок">
            <DashboardInfo label="Сотрудников в команде" value="12" labelIcon={false} featureIcon={false} change={null} />
          </Labeled>
        </Row>
      </Block>
    </Stack>
  ),
}
