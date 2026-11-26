import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Width } from '../../catalog/Catalog'
import { TableCell } from './TableCell'

const SIZES = ['md', 'lg'] as const
const STATES = ['default', 'loading'] as const
const TYPES = ['default', 'header'] as const
const ROWS = ['header / default', 'default / default', 'default / loading'] as const

/**
 * Ячейка таблицы. Figma: кит, `Table-cell` `16115:25252` — Size md · lg × State default · loading × Type default · header
 * (header — только md, высота 40), +31 слот: чекбокс, иконка / картинка слева, тексты, трейлинг-тексты, иконки справа,
 * теги, Icon-button, Dropdown, Button-1/2.
 *
 * `state="loading"` — скелетон вместо содержимого. Наведение и фокус вложенных контролов нативные.
 * Обрати внимание: по умолчанию `type="header"` — для ячеек тела передавай `type="default"`.
 */
const meta = {
  title: 'Components/TableCell',
  component: TableCell,
  tags: ['autodocs'],
  args: {
    type: 'default',
    size: 'lg',
    state: 'default',
    children: 'Иван Петров',
    secondaryText: 'Отдел продаж',
    description: 'Менеджер по работе с клиентами',
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: STATES },
    type: { control: 'inline-radio', options: TYPES },
    checkbox: { control: 'object' },
    leftIcon: { control: 'text' },
    image: { control: 'text' },
    imageSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: 'text' },
    secondaryText: { control: 'text' },
    description: { control: 'text' },
    descriptionIcon: { control: 'text' },
    trailText: { control: 'text' },
    trailSecondaryText: { control: 'text' },
    trailDescription: { control: 'text' },
    trailDescriptionIcon: { control: 'text' },
    rightIcons: { control: 'object' },
    tags: { control: 'object' },
    iconButton: { control: 'object' },
    dropdown: { control: 'object' },
    button: { control: 'object' },
    button2: { control: 'object' },
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
} satisfies Meta<typeof TableCell>

export default meta
type Story = StoryObj<typeof meta>

/** Заголовок колонки: md, текст Text/low-em, чекбокс «выбрать всех». */
export const Header: Story = {
  args: { type: 'header', size: 'md', children: 'Сотрудник', secondaryText: undefined, description: undefined, checkbox: {} },
}
/** Ячейка тела md. */
export const DefaultMd: Story = { args: { size: 'md' } }
/** Ячейка тела lg — как в ките Table. */
export const DefaultLg: Story = { args: { size: 'lg', checkbox: {}, leftIcon: 'user' } }
/** С трейлинг-текстами и тегом статуса справа. */
export const WithTrailAndTags: Story = {
  args: {
    children: 'Выполнение плана',
    secondaryText: undefined,
    description: 'Вес 30%',
    descriptionIcon: 'info',
    trailText: '98%',
    trailDescription: 'план 100%',
    tags: [{ label: 'в процессе', type: 'warning' }],
  },
}
/** С Dropdown и кнопками действий справа. */
export const WithControls: Story = {
  args: {
    children: 'Количество сделок',
    secondaryText: undefined,
    description: 'Июнь',
    dropdown: { value: 'Месяц' },
    iconButton: { icon: 'edit', 'aria-label': 'Изменить показатель', onClick: fn() },
    button: { label: 'Согласовать', onClick: fn() },
    button2: { label: 'Отклонить', onClick: fn() },
  },
}
/** Скелетон загрузки. */
export const Loading: Story = { args: { state: 'loading' } }

/** Матрица Type / State × Size — все варианты кита. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="Type / State × Size">
        <Matrix
          rows={ROWS}
          cols={SIZES}
          render={(r, sz) => {
            const [t, st] = r.split(' / ') as [(typeof TYPES)[number], (typeof STATES)[number]]
            return (
              <Width size="md">
                <TableCell
                  type={t}
                  size={sz}
                  state={st}
                  checkbox={{}}
                  leftIcon="user"
                  secondaryText="Отдел продаж"
                  description="Менеджер"
                  tags={[{ label: '98%', type: 'success' }]}
                >
                  Иван Петров
                </TableCell>
              </Width>
            )
          }}
        />
      </Block>
    </Stack>
  ),
}
