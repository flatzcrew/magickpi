import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Button, CheckboxLabel, Dropdown, Dropmenu, InputField, List, ToggleLabel } from '../components'
import s from './Sandboxes.module.css'

/**
 * Песочница «Форма»: InputField, Dropdown с Dropmenu, CheckboxLabel, ToggleLabel и кнопки «Отмена» / «Сохранить».
 * Проверка — по нажатию «Сохранить»: пустые и неверные поля уходят в danger с текстом ошибки, сверху — Alert.
 */
const meta = {
  title: 'Sandboxes/Форма',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const PERIODS = ['Ноябрь 2026', 'IV квартал 2026', '2026 год']
const UNITS = ['₽', '%', 'шт.']

interface Values {
  name: string
  plan: string
  period: string
  unit: string
  higherIsBetter: boolean
  notify: boolean
}

function validate(v: Values) {
  const errors: Partial<Record<keyof Values, string>> = {}
  if (!v.name.trim()) errors.name = 'Укажите название показателя'
  if (!v.plan.trim()) errors.plan = 'Укажите план'
  else if (!/^\d[\d\s]*([.,]\d+)?$/.test(v.plan.trim())) errors.plan = 'Только число, например 1 200 000'
  if (!v.period) errors.period = 'Выберите период'
  return errors
}

function Select({
  label,
  value,
  options,
  error,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  error?: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className={s.dropAnchor}>
      <Dropdown
        inputLabel={label}
        value={value || undefined}
        placeholder="Выберите"
        rightIcon="chevron-down"
        open={open}
        state={error ? 'danger' : undefined}
        inputHint={error}
        onClick={() => setOpen((o) => !o)}
      />
      {open && (
        <div className={s.dropMenu}>
          <Dropmenu>
            {options.map((o) => (
              <List
                key={o}
                state={o === value ? 'active' : undefined}
                onClick={() => {
                  onChange(o)
                  setOpen(false)
                }}
              >
                {o}
              </List>
            ))}
          </Dropmenu>
        </div>
      )}
    </div>
  )
}

function FormSandbox({ initial, submitted: initialSubmitted }: { initial: Values; submitted?: boolean }) {
  const [v, setV] = useState(initial)
  const [submitted, setSubmitted] = useState(Boolean(initialSubmitted))
  const [saved, setSaved] = useState(false)
  const errors = submitted ? validate(v) : {}
  const hasErrors = Object.keys(errors).length > 0
  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setSaved(false)
    setV((p) => ({ ...p, [k]: val }))
  }

  return (
    <div className={s.canvas}>
      <form
        className={`${s.card} ${s.narrow}`}
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
          setSaved(Object.keys(validate(v)).length === 0)
        }}
      >
        <h2 className="ui-heading-1-semibold">Показатель KPI</h2>
        {hasErrors && <Alert state="danger" icon="alert" title="Проверьте поля" description="Заполните обязательные поля, отмеченные красным" />}
        {saved && <Alert state="success" icon="check" title="Показатель сохранён" description={`${v.name} · план ${v.plan} ${v.unit} · ${v.period}`} />}
        <InputField
          inputLabel="Название"
          placeholder="Например, Выручка"
          value={v.name}
          onChange={(e) => set('name', e.target.value)}
          state={errors.name ? 'danger' : undefined}
          inputHint={errors.name}
        />
        <div className={s.fields}>
          <InputField
            inputLabel="План"
            placeholder="1 200 000"
            value={v.plan}
            inputMode="decimal"
            onChange={(e) => set('plan', e.target.value)}
            state={errors.plan ? 'danger' : undefined}
            inputHint={errors.plan}
          />
          <Select label="Единица" value={v.unit} options={UNITS} onChange={(x) => set('unit', x)} />
        </div>
        <Select label="Период" value={v.period} options={PERIODS} error={errors.period} onChange={(x) => set('period', x)} />
        <CheckboxLabel checked={v.higherIsBetter} onChange={(e) => set('higherIsBetter', e.target.checked)} description="Иначе выполнение считается по снижению">
          Чем больше, тем лучше
        </CheckboxLabel>
        <ToggleLabel checked={v.notify} onChange={(e) => set('notify', e.target.checked)}>
          Уведомить сотрудника
        </ToggleLabel>
        <div className={`${s.row} ${s.end}`}>
          <Button
            type="secondary"
            onClick={() => {
              setV(initial)
              setSubmitted(false)
              setSaved(false)
            }}
          >
            Отмена
          </Button>
          <Button htmlType="submit">Сохранить</Button>
        </div>
      </form>
    </div>
  )
}

const FILLED: Values = { name: 'Выручка', plan: '1 200 000', period: 'Ноябрь 2026', unit: '₽', higherIsBetter: true, notify: true }
const EMPTY: Values = { name: '', plan: '', period: '', unit: '₽', higherIsBetter: true, notify: false }

/** Заполненная форма: меняй поля, выбирай период в списке, жми «Сохранить». */
export const Filled: Story = { name: 'Заполнена', render: () => <FormSandbox initial={FILLED} /> }

/** Состояние ошибки: пустая форма после попытки сохранить. */
export const WithErrors: Story = { name: 'С ошибками', render: () => <FormSandbox initial={{ ...EMPTY, plan: 'много' }} submitted /> }
