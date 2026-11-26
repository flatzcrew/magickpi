import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Matrix, Stack, Width } from '../../catalog/Catalog'
import { NotificationItem } from './NotificationItem'

const READS = ['read=false', 'read=true'] as const
const STATES = ['default', 'hover'] as const

/**
 * Строка уведомления (SCR-11). Figma: kpi-bro · web, ext `NotificationItem` `227:1038` —
 * Read: false · true × State: default · hover = 4 ячейки; тексты text, time.
 *
 * Иконка события, текст до 3 строк, время; у непрочитанного — подложка и `NavDot`.
 * Иконки на SCR-11: на согласовании и напоминание — history, выполнено — check, факт — info, оценка — star.
 * Наведение нативное; `state` только фиксирует hover для сверки с Figma.
 */
const meta = {
  title: 'Components/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  args: {
    read: false,
    text: 'Иван Петров отправил задачу «Согласовать план на декабрь» на согласование',
    time: '10:42',
    icon: 'history',
  },
  argTypes: {
    read: { control: 'boolean' },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    text: { control: 'text' },
    time: { control: 'text' },
    icon: { control: 'select', options: ['history', 'check', 'info', 'star'] },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Width size="md">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof NotificationItem>

export default meta
type Story = StoryObj<typeof meta>

/** Непрочитанное: подложка и точка. */
export const Unread: Story = {}
/** Прочитанное. */
export const Read: Story = { args: { read: true, icon: 'check', text: 'Руководитель утвердил план на декабрь', time: 'вчера' } }
/** Принудительный hover для сверки с Figma. */
export const Hover: Story = { args: { state: 'hover' } }

/** Матрица Read × State; нижний блок без state — наведение живое. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="Read × State">
        <Matrix
          rows={READS}
          cols={STATES}
          render={(r, st) => (
            <Width size="md">
              <NotificationItem read={r === 'read=true'} state={st} icon="check" text="Руководитель утвердил план на декабрь" time="5 мин назад" />
            </Width>
          )}
        />
      </Block>
      <Block title="Иконки событий (без state — наведи, переход живой)">
        <Width size="md">
          <Stack>
            <Labeled label="history — на согласовании">
              <NotificationItem icon="history" text="Иван Петров отправил задачу «Согласовать план на декабрь» на согласование" time="10:42" />
            </Labeled>
            <Labeled label="check — выполнено">
              <NotificationItem icon="check" text="Анна Смирнова выполнила задачу «Провести 20 встреч с клиентами»" time="09:15" />
            </Labeled>
            <Labeled label="info — факт">
              <NotificationItem read icon="info" text="Внесён факт по показателю «Выручка»: 1 176 000 ₽" time="вчера" />
            </Labeled>
            <Labeled label="star — оценка">
              <NotificationItem read icon="star" text="Руководитель поставил оценку за ноябрь 2026: выполнение плана 98%" time="25 ноября" />
            </Labeled>
          </Stack>
        </Width>
      </Block>
    </Stack>
  ),
}
