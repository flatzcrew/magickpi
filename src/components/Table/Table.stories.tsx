import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Stack, Stateful, Width } from '../../catalog/Catalog'
import type { TableColumn, TableRow } from './Table'
import { Table } from './Table'

const COLUMNS: TableColumn[] = [
  { key: 'name', title: 'Сотрудник', header: { checkbox: {} } },
  { key: 'department', title: 'Отдел' },
  { key: 'weight', title: 'Вес' },
  { key: 'kpi', title: 'Выполнение плана' },
]

const ROWS: TableRow[] = [
  {
    id: '1',
    cells: {
      name: { children: 'Иван Петров', description: 'Менеджер', checkbox: {} },
      department: 'Отдел продаж',
      weight: '30%',
      kpi: { tags: [{ label: '98%', type: 'success' }] },
    },
  },
  {
    id: '2',
    cells: {
      name: { children: 'Анна Смирнова', description: 'Руководитель', checkbox: {} },
      department: 'Маркетинг',
      weight: '25%',
      kpi: { tags: [{ label: '74%', type: 'warning' }] },
    },
  },
  {
    id: '3',
    cells: {
      name: { children: 'Олег Ким', description: 'Аналитик', checkbox: {} },
      department: 'Отдел продаж',
      weight: '45%',
      kpi: { tags: [{ label: '52%', type: 'danger' }] },
    },
  },
]

/**
 * Таблица целиком. Figma: кит, `Table` `12123:12697` — одиночный, +3 (Pagination, Scroller, Sheet).
 * Sheet — сетка из `TableCell`: строка заголовков header md, тело — default lg (`cellSize`).
 * Ячейка задаётся содержимым (Primary-text) или пропсами `TableCell`. Наведение вложенных контролов нативное.
 */
const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: {
    columns: COLUMNS,
    rows: ROWS,
    cellSize: 'lg',
    pagination: { page: 'center', current: 2, total: 5 },
    scroller: true,
  },
  argTypes: {
    columns: { control: 'object' },
    rows: { control: 'object' },
    cellSize: { control: 'inline-radio', options: ['md', 'lg'] },
    pagination: { control: 'object' },
    scroller: { control: 'boolean' },
    sheet: { control: false },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Width size="xl">
          <Story />
        </Width>
      ),
  ],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

/** Как в ките: тело lg, пагинация и полоса прокрутки. */
export const Default: Story = {}
/** Плотная таблица: ячейки md. */
export const Compact: Story = { args: { cellSize: 'md' } }
/** Без пагинации и прокрутки. */
export const Bare: Story = { args: { pagination: false, scroller: false } }
/** Загрузка: ячейки тела в состоянии loading. */
export const Loading: Story = {
  args: {
    rows: ['1', '2', '3'].map((id) => ({
      id,
      cells: Object.fromEntries(COLUMNS.map((c) => [c.key, { state: 'loading' as const }])),
    })),
    pagination: false,
  },
}
/** Живая пагинация под таблицей. */
export const LivePagination: Story = {
  render: (args) => (
    <Stateful initial={1}>
      {(v, set) => <Table {...args} pagination={{ page: 'center', current: v, total: 5, onChange: set }} />}
    </Stateful>
  ),
}

/** Все варианты: lg · md · без пагинации. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="cellSize lg + Pagination + Scroller">
        <Width size="xl">
          <Table columns={COLUMNS} rows={ROWS} pagination={{ page: 'center', current: 2, total: 5 }} />
        </Width>
      </Block>
      <Block title="cellSize md">
        <Width size="xl">
          <Table columns={COLUMNS} rows={ROWS} cellSize="md" pagination={{ page: 'less-pages', current: 1, total: 3 }} />
        </Width>
      </Block>
      <Block title="pagination=false · scroller=false">
        <Width size="xl">
          <Table columns={COLUMNS} rows={ROWS} pagination={false} scroller={false} />
        </Width>
      </Block>
    </Stack>
  ),
}

/* ---------- Глубже: длинный контент и крайние состояния ---------- */

const LONG_ROWS: TableRow[] = Array.from({ length: 12 }, (_, i) => ({
  id: `long-${i}`,
  cells: {
    name: {
      children: i === 0 ? 'Константин Александрович Вознесенский-Рождественский' : ['Иван Петров', 'Анна Смирнова', 'Олег Ким', 'Мария Иванова'][i % 4],
      description: i === 0 ? 'Ведущий менеджер по работе с ключевыми клиентами федеральных сетей' : 'Менеджер по продажам',
      checkbox: {},
    },
    department: i === 1 ? 'Департамент развития региональных продаж и партнёрских программ' : 'Отдел продаж',
    weight: `${10 + ((i * 7) % 40)}%`,
    kpi: { tags: [{ label: `${40 + ((i * 13) % 80)}%`, type: i % 3 === 0 ? 'success' : i % 3 === 1 ? 'warning' : 'danger' }] },
  },
}))

/** Длинный контент: ФИО и должность в две строки, длинное название отдела, 12 строк — как переносится текст и растёт таблица. */
export const LongContent: Story = { args: { rows: LONG_ROWS, pagination: { page: 'center', current: 1, total: 24 } } }

/** Пустая таблица: только заголовки. Пустое состояние с текстом в ките не нарисовано — к релизу (`prototype/coverage.md`). */
export const Empty: Story = { args: { rows: [], pagination: false } }

/** Много колонок в узком контейнере: что происходит с шириной (колонки по 1fr сжимаются). */
export const ManyColumns: Story = {
  args: {
    columns: [
      ...COLUMNS,
      { key: 'plan', title: 'План' },
      { key: 'fact', title: 'Факт' },
      { key: 'score', title: 'Оценка' },
      { key: 'weighted', title: 'Взвешенная' },
      { key: 'period', title: 'Период' },
    ],
    rows: ROWS.map((r) => ({
      ...r,
      cells: { ...r.cells, plan: '1 200 000 ₽', fact: '1 176 000 ₽', score: '98%', weighted: '29%', period: 'Ноябрь 2026' },
    })),
    pagination: false,
  },
}
