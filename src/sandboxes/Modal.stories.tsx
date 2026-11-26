import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, InputField, Modal, Tag, Toast } from '../components'
import s from './Sandboxes.module.css'

/**
 * Песочница «Модальное окно»: Modal + шапка + два InputField + Tag + пара кнопок (secondary + primary).
 * Всё — реальные компоненты базы. Окно открывается кнопкой, закрывается крестиком, подложкой, Esc и «Отмена»;
 * вес проверяется на лету — пока поле с ошибкой, «Сохранить» недоступна; после сохранения — Toast.
 */
const meta = {
  title: 'Sandboxes/Модальное окно',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function ModalSandbox({ initialOpen }: { initialOpen: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  const [name, setName] = useState('Конверсия в сделку')
  const [weight, setWeight] = useState('30')
  const [saved, setSaved] = useState(false)

  const w = Number(weight)
  const weightError = weight.trim() === '' ? 'Укажите вес' : !Number.isFinite(w) || w <= 0 || w > 100 ? 'Вес — от 1 до 100%' : null
  const nameError = name.trim() === '' ? 'Укажите название' : null
  const invalid = Boolean(weightError || nameError)

  return (
    <div className={s.canvas}>
      <div className={s.screen}>
        <div className={s.screenBody}>
          <h2 className="ui-heading-1-semibold">Матрица KPI · Ноябрь 2026</h2>
          <p className={`ui-para-normal ${s.muted}`}>Иван Петров · Менеджер по продажам</p>
          <div className={s.row}>
            <Button leftIcon="plus" onClick={() => setOpen(true)}>
              Добавить показатель
            </Button>
          </div>
        </div>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          header={{
            headerIcon: 'analytics',
            heading: 'Новый показатель',
            description: 'Показатель попадёт в матрицу сотрудника на текущий месяц',
            onClose: () => setOpen(false),
          }}
          actions={{
            secondaryLabel: 'Отмена',
            onSecondary: () => setOpen(false),
            primaryLabel: 'Сохранить',
            primaryDisabled: invalid,
            onPrimary: () => {
              setOpen(false)
              setSaved(true)
            },
          }}
        >
          <div className={s.stack}>
            <div className={s.row}>
              <Tag type="primary-light" size="sm">
                Ноябрь 2026
              </Tag>
              <Tag type="neutral" size="sm">
                Отдел продаж
              </Tag>
            </div>
            <InputField
              inputLabel="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              state={nameError ? 'danger' : undefined}
              inputHint={nameError ?? undefined}
            />
            <InputField
              inputLabel="Вес, %"
              value={weight}
              inputMode="numeric"
              onChange={(e) => setWeight(e.target.value)}
              state={weightError ? 'danger' : undefined}
              inputHint={weightError ?? 'Сумма весов в матрице — 100%'}
            />
          </div>
        </Modal>

        {saved && (
          <div className={s.toasts}>
            <Toast
              state="success"
              icon="check"
              title="Показатель добавлен"
              description={`${name} · вес ${weight}%`}
              onClose={() => setSaved(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/** Окно открыто сразу: поменяй вес на 0 или 150 — поле покажет ошибку, «Сохранить» станет недоступна. */
export const Open: Story = { name: 'Открыто', render: () => <ModalSandbox initialOpen /> }

/** Экран с кнопкой: открытие и закрытие окна, Toast после сохранения. */
export const FromButton: Story = { name: 'Открытие по кнопке', render: () => <ModalSandbox initialOpen={false} /> }
