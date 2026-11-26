import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { Tag } from './Tag'

const TYPES = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'danger', 'primary-light'] as const
const SIZES = ['xs', 'sm', 'md'] as const
const STATES = ['default', 'hover', 'disabled'] as const

/**
 * Тег-метка. Figma: кит, `Tag` `10106:4651` — 9 Type × 3 Size × 3 State, иконки, вторичный текст, картинка.
 *
 * Без `onClick` — статичный `<span>`; с `onClick` — `<button>` с нативным hover и фокусом.
 * Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    type: 'success',
    size: 'md',
    children: 'Выполнено',
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    children: { control: 'text' },
    secondaryText: { control: 'text' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    image: { control: 'text' },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

/** Брендовый тег: подразделение. */
export const Primary: Story = { args: { type: 'primary', children: 'Отдел продаж' } }
export const Secondary: Story = { args: { type: 'secondary', children: 'Отдел продаж' } }
export const Tertiary: Story = { args: { type: 'tertiary', children: 'Отдел продаж' } }
/** Нейтральный: черновик плана. */
export const Neutral: Story = { args: { type: 'neutral', children: 'Черновик' } }
/** Информационный: на согласовании. */
export const Info: Story = { args: { type: 'info', children: 'На согласовании' } }
/** План выполнен. */
export const Success: Story = { args: { type: 'success', children: 'Выполнено' } }
/** Риск: выполнение ниже плана. */
export const Warning: Story = { args: { type: 'warning', children: 'В работе', secondaryText: '72%' } }
/** Отклонено руководителем. */
export const Danger: Story = { args: { type: 'danger', children: 'Отклонено' } }
/** Мягкий акцент: месяц. */
export const PrimaryLight: Story = { args: { type: 'primary-light', children: 'Ноябрь' } }
/** Кликабельный тег-фильтр: `<button>` с нативным hover. */
export const Clickable: Story = { args: { type: 'neutral', children: 'Все сотрудники', rightIcon: 'cross', onClick: fn() } }
/** С иконкой и счётчиком. */
export const WithIcons: Story = { args: { type: 'primary-light', leftIcon: 'calender', children: 'Задачи', secondaryText: '3' } }
/** Недоступен. */
export const Disabled: Story = { args: { disabled: true } }

/** Матрица Type × Size и Type × State. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <Tag type={t} size={sz}>Выполнено</Tag>} />
      </Block>
      <Block title="Type × State (default кликабельный — наведи, переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <Tag
              type={t}
              state={st === 'default' ? undefined : st}
              onClick={st === 'default' ? () => {} : undefined}
              leftIcon="calender"
              rightIcon="cross"
              secondaryText="3"
            >
              Задачи
            </Tag>
          )}
        />
      </Block>
    </Stack>
  ),
}
