/*
 * Окна экранов по макетам kpi-bro · web — содержимое панелей:
 * карточка показателя (272:17842) с правкой показателя, карточка задачи (276:19739), закрытие задачи (290:14897),
 * матрица сотрудника (из таблицы). Только компоненты базы + ScreenPanel.
 */
import { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  FileItem,
  InfoNote,
  InputField,
  KpiStatus,
  List,
  MatrixRow,
  ScaleChart,
  Switcher,
  TaskStatus,
} from '../../components'
import type { KpiStatusStatus } from '../../components'
import { PanelList, PanelPerson, PanelRow, PanelSection, PanelStack, PanelText, PanelValues, ScreenPanel } from './ScreenPanel'
import { fmtPct, scaleScore } from './data'
import type { Kpi, Person, Task } from './data'

const personAvatar = (p: Person) => <Avatar type="text" size="sm" initials={p.initials} />

/* ---------- Карточка показателя (просмотр + правка) ---------- */

export function KpiCardPanel({
  kpi,
  onClose,
  onSave,
  startInEdit = false,
  details = false,
}: {
  kpi: Kpi | null
  onClose: () => void
  /** Сохранить правку показателя. Не передан — правка недоступна. */
  onSave?: (next: Kpi) => void
  startInEdit?: boolean
  /**
   * Полная карточка как в макете 272:17842 (О показателе, график шкалы). По умолчанию — нет: из матрицы показываются
   * только значения этой строки, списком сверху вниз (решение дизайнера 2026-11-26).
   */
  details?: boolean
}) {
  const [edit, setEdit] = useState(startInEdit)
  const [tab, setTab] = useState('chart')
  const [draft, setDraft] = useState({ name: '', weight: '', plan: '', fact: '' })
  useEffect(() => {
    if (kpi) {
      setDraft({ name: kpi.name, weight: String(kpi.weight), plan: kpi.plan, fact: kpi.fact })
      setEdit(startInEdit)
    }
  }, [kpi, startInEdit])
  if (!kpi) return null

  const weightN = Number(draft.weight)
  const errors = {
    name: draft.name.trim() ? undefined : 'Укажите название показателя',
    weight: Number.isFinite(weightN) && weightN > 0 && weightN <= 100 ? undefined : 'Вес — от 1 до 100%',
    plan: draft.plan.trim() ? undefined : 'Укажите план',
  }
  const invalid = Boolean(errors.name || errors.weight || errors.plan)
  const score = scaleScore(kpi.completion)
  const status: KpiStatusStatus = kpi.status

  if (edit) {
    return (
      <ScreenPanel
        open
        onClose={onClose}
        title="Изменить показатель"
        footer={
          <>
            <Button
              type="primary-gradient"
              size="lg"
              disabled={invalid}
              onClick={() => {
                onSave?.({ ...kpi, name: draft.name.trim(), weight: weightN, plan: draft.plan.trim(), fact: draft.fact.trim() || '—' })
                setEdit(false)
              }}
            >
              Сохранить
            </Button>
            <Button type="tertiary" size="lg" onClick={() => setEdit(false)}>
              Отмена
            </Button>
          </>
        }
      >
        <PanelSection title="Показатель">
          <PanelStack>
            <InputField
              inputLabel="Название"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              state={errors.name ? 'danger' : undefined}
              inputHint={errors.name}
            />
            <InputField
              inputLabel="Вес, %"
              inputMode="numeric"
              value={draft.weight}
              onChange={(e) => setDraft({ ...draft, weight: e.target.value })}
              state={errors.weight ? 'danger' : undefined}
              inputHint={errors.weight ?? 'Сумма весов в матрице — 100%'}
            />
          </PanelStack>
        </PanelSection>
        <PanelSection title="План и факт">
          <PanelStack>
            <InputField
              inputLabel="План"
              value={draft.plan}
              onChange={(e) => setDraft({ ...draft, plan: e.target.value })}
              state={errors.plan ? 'danger' : undefined}
              inputHint={errors.plan}
            />
            <InputField
              inputLabel="Факт"
              value={draft.fact === '—' ? '' : draft.fact}
              placeholder="Ещё не внесён"
              onChange={(e) => setDraft({ ...draft, fact: e.target.value })}
            />
          </PanelStack>
        </PanelSection>
      </ScreenPanel>
    )
  }

  return (
    <ScreenPanel
      open
      onClose={onClose}
      title={kpi.name}
      footer={
        onSave ? (
          <Button type="tertiary" size="lg" leftIcon="edit" onClick={() => setEdit(true)}>
            Изменить показатель
          </Button>
        ) : undefined
      }
    >
      <PanelSection>
        <PanelRow>
          <KpiStatus status={status} value={fmtPct(kpi.completion)} />
        </PanelRow>
        <PanelList
          items={[
            ['Вес', `${kpi.weight}%`],
            ['План', kpi.plan],
            ['Факт', kpi.fact],
            ['Процент выполнения', fmtPct(kpi.completion)],
            ['Результат по шкале', fmtPct(score)],
            ['Результат с весом', fmtPct((score * kpi.weight) / 100)],
          ]}
        />
      </PanelSection>
      {details && (
      <>
      <PanelSection title="О показателе">
        <PanelText>{kpi.about}</PanelText>
        <PanelText>Единица измерения: {kpi.unit}</PanelText>
        <PanelText>Источник данных: {kpi.source}</PanelText>
      </PanelSection>
      <PanelSection title="Как считается результат">
        <Switcher
          size="md"
          items={[
            { value: 'chart', label: 'График результатов' },
            { value: 'log', label: 'Журнал загрузки' },
          ]}
          value={tab}
          onChange={setTab}
        />
        {tab === 'chart' ? (
          <>
            <ScaleChart fact={kpi.completion} you={`Вы здесь: ${fmtPct(kpi.completion)}`} />
            <InfoNote state="info" size="md">
              Меньше 80% — результат 0%. От 80% до 105% — результат равен выполнению. От 105% — результат 117,5%.
            </InfoNote>
          </>
        ) : (
          <PanelStack>
            <List size="md" leftIcon="download" description="25.11, 09:00 · автоматически">
              Загружен факт: {kpi.fact}
            </List>
            <List size="md" leftIcon="download" description="01.11, 09:00 · автоматически">
              Загружен план: {kpi.plan}
            </List>
          </PanelStack>
        )}
      </PanelSection>
      </>
      )}
    </ScreenPanel>
  )
}

/* ---------- Карточка задачи ---------- */

export function TaskCardPanel({
  task,
  onClose,
  onChangeStatus,
}: {
  task: Task | null
  onClose: () => void
  /** «Сменить статус» — например, открыть закрытие задачи. */
  onChangeStatus?: (task: Task) => void
}) {
  if (!task) return null
  return (
    <ScreenPanel
      open
      onClose={onClose}
      title="Задание"
      footer={
        <>
          <Button type="primary-gradient" size="lg" onClick={() => onChangeStatus?.(task)}>
            Сменить статус
          </Button>
          <Button type="tertiary" size="lg">
            Изменить
          </Button>
        </>
      }
    >
      <PanelSection>
        <PanelRow>
          <TaskStatus status={task.status} />
        </PanelRow>
        <PanelStack>
          <h3 className="ui-title-2-semibold">{task.title}</h3>
          <PanelText>{task.description}</PanelText>
        </PanelStack>
        <PanelValues
          items={[
            ['План', task.plan],
            ['Факт', task.fact],
            ['Вес', task.weight],
          ]}
        />
      </PanelSection>
      <PanelSection title="Исполнитель">
        <PanelPerson avatar={personAvatar(task.assignee)} name={task.assignee.name} role={task.assignee.role} />
      </PanelSection>
      <PanelSection title="Файлы">
        <PanelText>Сотрудник ещё не прикладывал файлы</PanelText>
      </PanelSection>
      <PanelSection title="История">
        {task.history.map((h) => (
          <List key={h.when} size="md" leftIcon="user-round" description={h.when}>
            {h.who} · {h.what}
          </List>
        ))}
      </PanelSection>
    </ScreenPanel>
  )
}

/* ---------- Закрытие задачи ---------- */

export function TaskClosePanel({ task, onClose, onDone }: { task: Task | null; onClose: () => void; onDone?: (fact: string) => void }) {
  const [fact, setFact] = useState('')
  useEffect(() => {
    setFact(task?.plan ?? '')
  }, [task])
  if (!task) return null
  const factError = fact.trim() === '' ? 'Укажите, сколько сделано' : !/^\d+$/.test(fact.trim()) ? 'Только число' : undefined
  return (
    <ScreenPanel
      open
      onClose={onClose}
      title="Закрыть задачу"
      footer={
        <>
          <Button type="primary-gradient" size="lg" disabled={Boolean(factError)} onClick={() => onDone?.(fact.trim())}>
            Закрыть
          </Button>
          <Button type="tertiary" size="lg" onClick={onClose}>
            Отменить
          </Button>
        </>
      }
    >
      <PanelSection>
        <PanelRow>
          <TaskStatus status={task.status} />
        </PanelRow>
        <PanelStack>
          <h3 className="ui-title-2-semibold">{task.title}</h3>
          <PanelText>{task.description}</PanelText>
        </PanelStack>
        <PanelValues columns={1} items={[['План', task.plan]]} />
        <InputField
          inputLabel="Факт"
          inputMode="numeric"
          value={fact}
          onChange={(e) => setFact(e.target.value)}
          state={factError ? 'danger' : undefined}
          inputHint={factError ?? `Сколько сделано из плана ${task.plan}`}
        />
      </PanelSection>
      <PanelSection title="Файлы">
        <PanelText>Подтвердите файлами Excel, PDF, фото и сканы, до 20 МБ каждый</PanelText>
        <PanelRow>
          <Button type="secondary" size="sm" leftIcon="attachement">
            Прикрепить файлы
          </Button>
        </PanelRow>
        <PanelStack>
          <FileItem state="done" icon="image" name="Фото_дегустация_1.jpg" size="2,4 МБ" />
          <FileItem state="done" icon="doc" name="Отчёт.xlsx" size="48 КБ" />
          <FileItem state="error" icon="doc" name="Скан_акта.pdf" errorText="Файл больше 20 МБ — прикрепите поменьше" />
          <FileItem state="loading" icon="doc" name="Скан_акта2.pdf" size="1,1 МБ" />
        </PanelStack>
      </PanelSection>
    </ScreenPanel>
  )
}

/* ---------- Матрица сотрудника (из таблицы) ---------- */

export function EmployeeMatrixPanel({
  employee,
  kpis,
  onClose,
  onOpenKpi,
}: {
  employee: (Person & { completion: number }) | null
  kpis: Kpi[]
  onClose: () => void
  onOpenKpi: (kpi: Kpi) => void
}) {
  if (!employee) return null
  return (
    <ScreenPanel open onClose={onClose} title={`Матрица · ${employee.name}`}>
      <PanelSection>
        <PanelPerson avatar={personAvatar(employee)} name={employee.name} role={employee.role} />
        <PanelValues
          items={[
            ['Период', 'Ноябрь 2026'],
            ['Показателей', String(kpis.length)],
            ['Итог месяца', fmtPct(employee.completion)],
          ]}
        />
      </PanelSection>
      <PanelSection title="Показатели">
        <PanelText>Нажмите на показатель, чтобы открыть его карточку.</PanelText>
        <PanelStack>
          {kpis.map((k) => (
            <MatrixRow
              key={k.id}
              level="item"
              name={k.name}
              status={k.status}
              statusLabel={fmtPct(scaleScore(k.completion))}
              showCompletion={false}
              values={{ weight: `${k.weight}%`, plan: k.plan, fact: k.fact, score: fmtPct(scaleScore(k.completion)) }}
              tabIndex={0}
              onClick={() => onOpenKpi(k)}
              onKeyDown={(e) => e.key === 'Enter' && onOpenKpi(k)}
            />
          ))}
        </PanelStack>
      </PanelSection>
    </ScreenPanel>
  )
}
