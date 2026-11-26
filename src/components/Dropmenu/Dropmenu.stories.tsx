import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Row, Stack, Stateful, Width } from '../../catalog/Catalog'
import { Button } from '../Button'
import { DividerHorizontal } from '../DividerHorizontal'
import { List } from '../List'
import { Dropmenu } from './Dropmenu'

const DEPARTMENTS = ['Отдел продаж', 'Маркетинг', 'Разработка', 'Бухгалтерия'] as const

/**
 * Выпадающее меню. Figma: кит, `Dropmenu` `12127:30113` — одиночный, +1 слот Body.
 * Body: поле поиска (Input-field без label и hint) + строки `List` md, разделённые `DividerHorizontal` (rounded).
 * Строки передаются детьми; выбранная строка — `List state="active"`, наведение нативное.
 */
const meta = {
  title: 'Components/Dropmenu',
  component: Dropmenu,
  tags: ['autodocs'],
  args: {
    search: { placeholder: 'Поиск отдела' },
    children: (
      <>
        <List size="md" leftIcon="users">Отдел продаж</List>
        <List size="md" leftIcon="users" state="active">Маркетинг</List>
        <List size="md" leftIcon="users">Разработка</List>
      </>
    ),
  },
  argTypes: {
    search: { control: 'object' },
    children: { control: false },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Width size="sm">
          <Story />
        </Width>
      ),
  ],
} satisfies Meta<typeof Dropmenu>

export default meta
type Story = StoryObj<typeof meta>

/** С полем поиска. */
export const WithSearch: Story = {}
/** Без поиска: короткий список месяцев. */
export const WithoutSearch: Story = {
  args: {
    search: undefined,
    children: (
      <>
        <List size="md">Апрель</List>
        <List size="md" state="active">Май</List>
        <List size="md">Июнь</List>
      </>
    ),
  },
}
/** С разделителем между группами. */
export const WithDivider: Story = {
  args: {
    search: undefined,
    children: (
      <>
        <List size="md" leftIcon="user">Мои KPI</List>
        <List size="md" leftIcon="users">Команда</List>
        <DividerHorizontal ends="rounded" />
        <List size="md" leftIcon="logout">Выйти</List>
      </>
    ),
  },
}
/** Живой выбор: клик по строке делает её активной. */
export const Selectable: Story = {
  render: (args) => (
    <Stateful<string> initial="Маркетинг">
      {(v, set) => (
        <Dropmenu {...args}>
          {DEPARTMENTS.map((d) => (
            <List
              key={d}
              size="md"
              leftIcon="users"
              state={d === v ? 'active' : undefined}
              role="menuitemradio"
              aria-checked={d === v}
              tabIndex={0}
              onClick={() => set(d)}
            >
              {d}
            </List>
          ))}
        </Dropmenu>
      )}
    </Stateful>
  ),
}

/** Варианты состава Body рядом. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="Body: с поиском · без поиска · с разделителем">
        <Row>
          <Width size="sm">
            <Dropmenu search={{}}>
              <List size="md" leftIcon="users">Отдел продаж</List>
              <List size="md" leftIcon="users" state="hover">Маркетинг</List>
              <List size="md" leftIcon="users" state="active">Разработка</List>
            </Dropmenu>
          </Width>
          <Width size="sm">
            <Dropmenu>
              <List size="md">Апрель</List>
              <List size="md" state="active">Май</List>
              <List size="md">Июнь</List>
            </Dropmenu>
          </Width>
          <Width size="sm">
            <Dropmenu>
              <List size="md" leftIcon="user">Мои KPI</List>
              <List size="md" leftIcon="users">Команда</List>
              <DividerHorizontal ends="rounded" />
              <List size="md" leftIcon="logout">Выйти</List>
            </Dropmenu>
          </Width>
        </Row>
      </Block>
    </Stack>
  ),
}

/* ---------- Глубже: длинный контент, крайние состояния, появление ---------- */

const MANY_EMPLOYEES = [
  'Иван Петров', 'Анна Смирнова', 'Олег Ким', 'Мария Иванова', 'Дмитрий Орлов', 'Елена Соколова', 'Павел Морозов',
  'Ольга Волкова', 'Сергей Лебедев', 'Наталья Козлова', 'Алексей Новиков', 'Татьяна Павлова', 'Максим Фёдоров',
  'Юлия Егорова', 'Николай Семёнов', 'Ирина Голубева', 'Андрей Виноградов', 'Светлана Богданова', 'Роман Тихонов', 'Ксения Белова',
]

/** Длинный список: 20 сотрудников. У Dropmenu нет ограничения высоты — список растёт целиком (ограничивает экран). */
export const LongList: Story = {
  args: {
    search: { placeholder: 'Поиск сотрудника' },
    children: (
      <>
        {MANY_EMPLOYEES.map((n, i) => (
          <List key={n} size="md" leftIcon="user" state={i === 3 ? 'active' : undefined}>
            {n}
          </List>
        ))}
      </>
    ),
  },
}

/** Длинные подписи строк: перенос внутри ширины меню. */
export const LongLabels: Story = {
  args: {
    search: undefined,
    children: (
      <>
        <List size="md" leftIcon="users">Департамент развития региональных продаж и партнёрских программ</List>
        <List size="md" leftIcon="users" state="active">Управление по работе с ключевыми клиентами федеральных сетей</List>
        <List size="md" leftIcon="users">Маркетинг</List>
      </>
    ),
  },
}

/** Живой поиск: фильтр по вводу; ничего не найдено — пустое Body (пустое состояние в ките не нарисовано). */
export const SearchNoResults: Story = {
  render: (args) => (
    <Stateful initial="Петр">
      {(q, setQ) => {
        const found = MANY_EMPLOYEES.filter((n) => n.toLowerCase().includes(q.trim().toLowerCase()))
        return (
          <Dropmenu {...args} search={{ placeholder: 'Поиск сотрудника', value: q, onChange: (e) => setQ(e.target.value) }}>
            {found.map((n) => (
              <List key={n} size="md" leftIcon="user">
                {n}
              </List>
            ))}
          </Dropmenu>
        )
      }}
    </Stateful>
  ),
}

/** Появление: меню выпадает сверху за 0.15s при каждом открытии. Нажми кнопку несколько раз. */
export const Appear: Story = {
  render: (args) => (
    <Stateful initial={0}>
      {(n, set) => (
        <Stack>
          <Row>
            <Button type="secondary" size="sm" onClick={() => set(n + 1)}>
              Открыть заново
            </Button>
          </Row>
          <Dropmenu key={n} {...args} />
        </Stack>
      )}
    </Stateful>
  ),
}
