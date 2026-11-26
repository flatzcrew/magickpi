import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Stack, Stateful } from '../../catalog/Catalog'
import type { DateRange, DatepickerShortcut } from './Datepicker'
import { Datepicker } from './Datepicker'

const TYPES = ['range', 'single', 'single-sm'] as const

const MONTHS_RU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const WEEKDAYS_RU = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
const WEEKDAYS_SHORT_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const SHORTCUTS_RU: DatepickerShortcut[] = [
  { value: 'month', label: 'Текущий месяц' },
  { value: 'prev', label: 'Прошлый месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'half', label: 'Полугодие' },
  { value: 'year', label: 'Год' },
]

const RU = {
  monthNames: MONTHS_RU,
  weekdayNames: WEEKDAYS_RU,
  weekdayShortNames: WEEKDAYS_SHORT_RU,
  cancelLabel: 'Отмена',
  applyLabel: 'Применить',
}

/**
 * Календарь выбора даты или периода. Figma: кит, `Datepicker` `14131:86649` — Type range · single · single-sm, +3
 * (Shortcuts, Date-field, sidebar-nav).
 * range — два месяца, быстрые периоды слева и поля дат; single — крупная дата сверху; single-sm — ячейки 32 и поле даты.
 * Тексты кита английские — для экранов передаются русские (`monthNames`, `weekdayNames`, подписи кнопок).
 * Значение работает и без контроля (`defaultValue` / `defaultRange`). Наведение ячеек нативное.
 */
const meta = {
  title: 'Components/Datepicker',
  component: Datepicker,
  tags: ['autodocs'],
  args: {
    type: 'range',
    ...RU,
    shortcuts: SHORTCUTS_RU,
    defaultValue: new Date(2026, 5, 15),
    defaultRange: { start: new Date(2026, 5, 1), end: new Date(2026, 5, 30) },
    dateField: true,
    onChange: fn(),
    onRangeChange: fn(),
    onMonthChange: fn(),
    onShortcutChange: fn(),
    onCancel: fn(),
    onApply: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    value: { control: false },
    defaultValue: { control: false },
    onChange: { control: false },
    range: { control: false },
    defaultRange: { control: false },
    onRangeChange: { control: false },
    month: { control: false },
    onMonthChange: { control: false },
    shortcuts: { control: 'object' },
    shortcut: { control: 'text' },
    onShortcutChange: { control: false },
    dateField: { control: 'boolean' },
    monthNames: { control: 'object' },
    weekdayNames: { control: 'object' },
    weekdayShortNames: { control: 'object' },
    cancelLabel: { control: 'text' },
    applyLabel: { control: 'text' },
    onCancel: { control: false },
    onApply: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Datepicker>

export default meta
type Story = StoryObj<typeof meta>

/** Период отчёта: два месяца и быстрые периоды. */
export const Range: Story = { args: { type: 'range' } }
/** Одна дата — крупная дата сверху. */
export const Single: Story = { args: { type: 'single' } }
/** Компактный: ячейки 32 и поле с датой. */
export const SingleSm: Story = { args: { type: 'single-sm' } }
/** Период без быстрых периодов. */
export const RangeWithoutShortcuts: Story = { args: { type: 'range', shortcuts: false } }

/** Живой выбор даты (контролируемо): дата показана под календарём. */
export const LiveSingle: Story = {
  args: { type: 'single-sm' },
  render: (args) => (
    <Stateful<Date | null> initial={new Date(2026, 5, 15)}>
      {(v, set) => (
        <Labeled label={v ? `Срок задачи: ${v.toLocaleDateString('ru-RU')}` : 'Срок не выбран'}>
          <Datepicker {...args} value={v} onChange={set} />
        </Labeled>
      )}
    </Stateful>
  ),
}
/** Живой выбор периода (контролируемо): первый клик — начало, второй — конец. */
export const LiveRange: Story = {
  args: { type: 'range' },
  render: (args) => (
    <Stateful<DateRange> initial={{ start: new Date(2026, 5, 1), end: new Date(2026, 5, 30) }}>
      {(v, set) => (
        <Labeled
          label={`Период: ${v.start?.toLocaleDateString('ru-RU') ?? '—'} — ${v.end?.toLocaleDateString('ru-RU') ?? '—'}`}
        >
          <Datepicker {...args} range={v} onRangeChange={set} />
        </Labeled>
      )}
    </Stateful>
  ),
}

/** Все Type. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type">
        <Stack>
          {TYPES.map((t) => (
            <Labeled key={t} label={t}>
              <Datepicker
                type={t}
                {...RU}
                shortcuts={SHORTCUTS_RU}
                defaultValue={new Date(2026, 5, 15)}
                defaultRange={{ start: new Date(2026, 5, 8), end: new Date(2026, 6, 12) }}
              />
            </Labeled>
          ))}
        </Stack>
      </Block>
    </Stack>
  ),
}

/* ---------- Глубже: крайние состояния ---------- */

/** Период через границу года: 15.12.2026 — 15.01.2027, два месяца в разных годах. */
export const YearBoundary: Story = {
  args: {
    type: 'range',
    defaultRange: { start: new Date(2026, 11, 15), end: new Date(2027, 0, 15) },
  },
}

/** Високосный день: 29.02.2028 — шестая неделя месяца и короткий февраль. */
export const LeapDay: Story = { args: { type: 'single', defaultValue: new Date(2028, 1, 29) } }

/** Один день как период: начало и конец совпадают. */
export const SingleDayRange: Story = {
  args: { type: 'range', defaultRange: { start: new Date(2026, 10, 30), end: new Date(2026, 10, 30) } },
}
