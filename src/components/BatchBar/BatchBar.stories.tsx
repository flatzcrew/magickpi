import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Row, Stack, Stateful, Width } from '../../catalog/Catalog'
import { Button } from '../Button'
import { BatchBar } from './BatchBar'

/** «Выбрано N» с правильным окончанием. */
const countLabel = (n: number) => `Выбрано ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'задача' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'задачи' : 'задач'} у Ивана Петрова`

/**
 * Плавающая панель режима выбора задач. Figma: kpi-bro · web, ext `BatchBar` `176:2623` —
 * State: default · hint (2 ячейки); тексты count, hint; showClear (в React — `clearAction`, `null` скрывает).
 *
 * Слева — счётчик выбранного (и подсказка в hint), справа — «Снять выбор» и «Сменить статус».
 * Обе кнопки второстепенные — так задумано (решение 2026-11-21). `state` здесь — вариант содержимого, не наведение.
 */
const meta = {
  title: 'Components/BatchBar',
  component: BatchBar,
  tags: ['autodocs'],
  args: {
    state: 'default',
    count: 'Выбрано 2 задачи у Ивана Петрова',
    hint: 'Можно выбрать задачи только одного сотрудника',
    clearAction: { label: 'Снять выбор', onClick: fn() },
    primaryAction: { label: 'Сменить статус', onClick: fn() },
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['default', 'hint'] },
    count: { control: 'text' },
    hint: { control: 'text' },
    clearAction: { control: 'object' },
    primaryAction: { control: 'object' },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <Width size="xl">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof BatchBar>

export default meta
type Story = StoryObj<typeof meta>

/** Только счётчик. */
export const Default: Story = {}
/** С подсказкой: выбраны задачи другого сотрудника. */
export const Hint: Story = { args: { state: 'hint' } }
/** Без «Снять выбор». */
export const WithoutClear: Story = { args: { clearAction: null } }

/** Живой счётчик: добавь задачи в выбор, «Снять выбор» обнуляет. */
export const LiveCount: Story = {
  render: () => (
    <Stateful initial={2}>
      {(n, set) => (
        <Stack>
          <Row>
            <Button type="secondary" size="sm" leftIcon="plus" onClick={() => set(n + 1)}>
              Выбрать ещё задачу
            </Button>
          </Row>
          {n > 0 && <BatchBar count={countLabel(n)} clearAction={{ label: 'Снять выбор', onClick: () => set(0) }} />}
        </Stack>
      )}
    </Stateful>
  ),
}

/** State default · hint для сверки с Figma. */
export const AllVariants: Story = {
  decorators: [],
  render: () => (
    <Stack>
      <Block title="State">
        <Width size="xl">
          <Stack>
            {(['default', 'hint'] as const).map((st) => (
              <Labeled key={st} label={st}>
                <BatchBar state={st} count="Выбрано 2 задачи у Ивана Петрова" />
              </Labeled>
            ))}
            <Labeled label="без clearAction">
              <BatchBar count="Выбрано 5 задач у Анны Смирновой" clearAction={null} />
            </Labeled>
          </Stack>
        </Width>
      </Block>
    </Stack>
  ),
}
