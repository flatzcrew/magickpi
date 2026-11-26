import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Width } from '../../catalog/Catalog'
import { List } from './List'

const SIZES = ['sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover', 'active'] as const

/**
 * Строка списка. Figma: кит, `List` `10063:2066` — Size sm · md · lg · xl × State default · hover · active, +31 слот:
 * чекбокс, иконка / картинка слева, Primary + Secondary + Tag-main, Description, трейлинг-тексты, до 3 иконок, теги,
 * Icon-button и Button справа.
 *
 * Наведение нативное (`:hover`); `active` — выбранная строка, задаётся пропом.
 * Проп `state` фиксирует hover только для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  args: {
    size: 'md',
    leftIcon: 'user',
    children: 'Иван Петров',
    secondaryText: 'Отдел продаж',
    description: 'Выполнение плана 98%',
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    checkbox: { control: 'object' },
    leftIcon: { control: 'text' },
    image: { control: 'text' },
    imageSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: 'text' },
    secondaryText: { control: 'text' },
    tag: { control: 'text' },
    description: { control: 'text' },
    descriptionIcon: { control: 'text' },
    trailText: { control: 'text' },
    trailSecondaryText: { control: 'text' },
    trailDescription: { control: 'text' },
    trailDescriptionIcon: { control: 'text' },
    rightIcons: { control: 'object' },
    tags: { control: 'object' },
    iconButton: { control: 'object' },
    button: { control: 'object' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Width size="md">
          <Story />
        </Width>
      ),
  ],
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }
export const ExtraLarge: Story = { args: { size: 'xl' } }
/** Выбранная строка (`state="active"`). */
export const Active: Story = { args: { state: 'active' } }
/** Наведение — зафиксировано для сверки с Figma. */
export const Hover: Story = { args: { state: 'hover' } }
/** Показатель KPI: чекбокс, тег веса, план/факт справа и статус. */
export const KpiRow: Story = {
  args: {
    size: 'lg',
    checkbox: {},
    leftIcon: 'pie-chart',
    children: 'Количество сделок',
    secondaryText: undefined,
    tag: 'вес 30%',
    description: 'План 40 · факт 39',
    trailText: '98%',
    trailDescription: 'июнь',
    tags: [{ label: 'в процессе', type: 'warning' }],
    iconButton: { icon: 'more-horizontal', 'aria-label': 'Действия с показателем', onClick: fn() },
  },
}
/** С кнопкой действия справа. */
export const WithButton: Story = {
  args: { button: { label: 'Открыть', onClick: fn() }, rightIcons: ['notification'] },
}

/** Матрица Size × State. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="Size × State">
        <Matrix
          rows={SIZES}
          cols={STATES}
          render={(sz, st) => (
            <Width size="md">
              <List
                size={sz}
                state={st === 'default' ? undefined : st}
                leftIcon="user"
                description="Отдел продаж"
                trailText="98%"
                tags={[{ label: 'выполнен', type: 'success' }]}
              >
                Иван Петров
              </List>
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
