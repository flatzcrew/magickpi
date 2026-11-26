import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful, Width } from '../../catalog/Catalog'
import { Dropmenu } from '../Dropmenu'
import { List } from '../List'
import { Dropdown } from './Dropdown'

const STATES = ['default', 'hover', 'pressed', 'active', 'danger', 'disabled', 'naked', 'default-dark', 'naked-disabled', 'primary-light'] as const
const DEPARTMENTS = ['Отдел продаж', 'Маркетинг', 'Поддержка'] as const

/**
 * Поле выбора (триггер списка). Figma: кит, `Dropdown` `12041:1595` — 10 State, +2 (Input-label, Input-hint).
 * InputLabel md + ячейка-кнопка + HintLabel md. Сам список открывает внешний Dropmenu; здесь `open` только меняет вид на pressed.
 * Вариант Auto-layout FALSE · TRUE — технический, в React не переносится.
 *
 * hover, pressed (:active), active (:focus-visible), disabled — нативные; danger, naked, default-dark, primary-light задаются пропом `state`.
 */
const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: {
    state: 'default',
    inputLabel: 'Отдел',
    placeholder: 'Выберите отдел',
    inputHint: 'KPI отдела подтянутся в план сотрудника',
    leftIcon: 'users',
    onClick: fn(),
  },
  argTypes: {
    state: { control: 'select', options: STATES },
    open: { control: 'boolean' },
    inputLabel: { control: 'text' },
    inputHint: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    secondaryText: { control: 'text' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    image: { control: 'text' },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  render: (args) => (
    <Width size="sm">
      <Dropdown {...args} />
    </Width>
  ),
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

/** Значение не выбрано — плейсхолдер. */
export const Default: Story = {}
/** Выбрано значение с пояснением. */
export const WithValue: Story = { args: { value: 'Отдел продаж', secondaryText: '12 сотрудников' } }
/** Список открыт — вид pressed. */
export const Open: Story = { args: { open: true, value: 'Отдел продаж' } }
/** Ошибка: отдел обязателен. */
export const Danger: Story = { args: { state: 'danger', inputHint: 'Выберите отдел, чтобы назначить KPI' } }
/** Недоступно. */
export const Disabled: Story = { args: { state: 'disabled', value: 'Отдел продаж' } }
/** Без рамки — в строке фильтров. */
export const Naked: Story = { args: { state: 'naked', inputLabel: undefined, inputHint: undefined, leftIcon: 'calender', value: 'Квартал' } }
/** Мягкий акцент. */
export const PrimaryLight: Story = { args: { state: 'primary-light', value: 'Маркетинг' } }

/** Живой выбор: клик открывает/закрывает, повторный клик выбирает следующий отдел (списка Dropmenu здесь нет). */
export const Interactive: Story = {
  render: (args) => (
    <Stateful initial={{ open: false, index: -1 }}>
      {(v, set) => (
        <Width size="sm">
          <Dropdown
            {...args}
            open={v.open}
            value={v.index >= 0 ? DEPARTMENTS[v.index] : undefined}
            onClick={(e) => {
              set(v.open ? { open: false, index: (v.index + 1) % DEPARTMENTS.length } : { ...v, open: true })
              args.onClick?.(e)
            }}
          />
        </Width>
      )}
    </Stateful>
  ),
}

/** State × значение; строка default — живая, наведи, нажми, сфокусируй с клавиатуры. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="State × значение">
        <Matrix
          rows={STATES}
          cols={['плейсхолдер', 'значение', 'open'] as const}
          render={(st, c) => (
            <Width size="sm">
              <Dropdown
                state={st}
                open={c === 'open'}
                inputLabel="Отдел"
                inputHint={st === 'danger' ? 'Выберите отдел' : 'Подсказка к полю'}
                placeholder="Выберите отдел"
                leftIcon="users"
                value={c === 'плейсхолдер' ? undefined : 'Отдел продаж'}
              />
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}

/* ---------- Глубже: длинный контент, крайние состояния, появление списка ---------- */

/** Длинное значение и подсказка: значение обрезается в строку, подсказка переносится. */
export const LongValue: Story = {
  args: {
    value: 'Департамент развития региональных продаж и партнёрских программ',
    secondaryText: '148 сотрудников',
    inputHint: 'KPI департамента подтянутся в план каждого сотрудника, а веса можно будет поправить в матрице перед отправкой на согласование',
  },
}

/** Ошибка без подписи сверху: только поле и текст ошибки. */
export const DangerWithoutLabel: Story = {
  args: { state: 'danger', inputLabel: undefined, inputHint: 'Отдел не выбран' },
}

const MANY_DEPARTMENTS = [
  'Отдел продаж', 'Маркетинг', 'Поддержка', 'Разработка', 'Бухгалтерия', 'HR', 'Логистика', 'Закупки',
  'Юридический отдел', 'Аналитика', 'Служба качества', 'Региональные продажи',
]

/** Живая связка с Dropmenu: клик открывает список (выпадает за 0.15s), выбор закрывает и подставляет значение. */
export const WithMenu: Story = {
  render: (args) => (
    <Stateful<{ open: boolean; value?: string }> initial={{ open: false }}>
      {(st, set) => (
        <Width size="sm">
          <Stack>
            <Dropdown
              {...args}
              value={st.value}
              open={st.open}
              rightIcon="chevron-down"
              onClick={() => set({ ...st, open: !st.open })}
            />
            {st.open && (
              <Dropmenu>
                {MANY_DEPARTMENTS.map((d) => (
                  <List key={d} size="md" leftIcon="users" state={d === st.value ? 'active' : undefined} onClick={() => set({ open: false, value: d })}>
                    {d}
                  </List>
                ))}
              </Dropmenu>
            )}
          </Stack>
        </Width>
      )}
    </Stateful>
  ),
}
