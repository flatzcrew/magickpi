/*
 * Экран «Ассистент Кипи» по макету Screen/Home (95:2136, SCR-13) — с живыми состояниями Кипи:
 * welcome (первый вход) → thinking (печатает) → success (нашёл) / error (не понял) → idle.
 * Кипи доступен всем сотрудникам независимо от роли (решение дизайнера 2026-11-26). Макет у сотрудника тот же —
 * чат и краткая сводка по матрице, только без всего, что про сотрудников: нет сводок по команде (согласование, закрытие,
 * красная зона), подсказок про команду и ответов о других сотрудниках.
 */
import { useEffect, useRef, useState } from 'react'
import { Chip, DashboardInfo, InputField, KipiAvatar, KipiMessage, KpiStatus, Link } from '../../components'
import type { KipiAvatarState } from '../../components'
import s from './KipiPage.module.css'

export type Role = 'manager' | 'employee'

interface Line {
  id: number
  author: 'kipi' | 'user'
  state: 'default' | 'thinking' | 'error'
  text: string
}

/** Подпись под именем — словами, какое сейчас состояние (персонажем одним состояние не передаём). */
export const KIPI_STATE_TEXT: Record<KipiAvatarState, string> = {
  welcome: 'Ваш личный помощник на портале',
  idle: 'Готов помочь',
  thinking: 'Думает…',
  success: 'Нашёл ответ',
  error: 'Не смог ответить',
}

/** team — ответ про других сотрудников: только руководителю. */
const ANSWERS: { match: RegExp; text: string; team?: boolean }[] = [
  { team: true, match: /согласован/i, text: 'На согласовании 5 задач у трёх сотрудников: Пётр Сидоров — 2, Мария Белова — 2, Денис Орлов — 1.' },
  { team: true, match: /сотрудник|найди|сидоров|белов|орлов/i, text: 'Нашёл: Пётр Сидоров, торговый представитель. Итог ноября — 97%, две задачи в работе.' },
  { team: true, match: /красн/i, text: 'В красной зоне двое: Денис Орлов (68%) и Олег Ким (74%). Открыть их матрицы?' },
  { match: /счита|результат/i, text: 'Результат по показателю считается по шкале: меньше 80% — 0, от 80 до 105% — равен выполнению, выше 105% — 117,5%.' },
  { match: /задач|матриц|kpi|показател|план/i, text: 'Ваша матрица за ноябрь: выполнение 74%, в процессе. До плана по выручке — 220 000 ₽, две задачи ещё не отправлены.' },
]

const SUGGEST: Record<Role, string[]> = {
  manager: ['Покажи задачи на согласовании', 'Найди сотрудника', 'Кто в команде в красной зоне?', 'Как считается мой результат?'],
  employee: ['Что у меня по задачам?', 'Как считается мой результат?', 'Сколько осталось до плана?', 'Что по моей матрице?'],
}

export function KipiPage({
  role,
  name,
  onStateChange,
}: {
  role: Role
  name: string
  /** Состояние Кипи наружу — для KipiLauncher на других экранах. */
  onStateChange?: (state: KipiAvatarState) => void
}) {
  const first = name.split(' ')[0]
  const [lines, setLines] = useState<Line[]>([
    {
      id: 0,
      author: 'kipi',
      state: 'default',
      text:
        role === 'manager'
          ? `Добрый день, ${first}! За ноябрь у команды 8 задач ждут вашего решения. С чего начнём?`
          : `Добрый день, ${first}! За ноябрь в вашей матрице 2 задачи ещё не отправлены. С чего начнём?`,
    },
  ])
  const [state, setState] = useState<KipiAvatarState>('welcome')
  const [draft, setDraft] = useState('')
  const feed = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    onStateChange?.(state)
  }, [state, onStateChange])
  useEffect(() => {
    feed.current?.scrollTo({ top: feed.current.scrollHeight, behavior: 'smooth' })
  }, [lines])
  useEffect(() => {
    const list = timers.current
    return () => list.forEach(clearTimeout)
  }, [])

  const ask = (q: string) => {
    const text = q.trim()
    if (!text || state === 'thinking') return
    const id = Date.now()
    setDraft('')
    setState('thinking')
    setLines((l) => [
      ...l,
      { id, author: 'user', state: 'default', text },
      { id: id + 1, author: 'kipi', state: 'thinking', text: 'Смотрю данные' },
    ])
    timers.current.push(
      window.setTimeout(() => {
        const hit = ANSWERS.find((a) => (role === 'manager' || !a.team) && a.match.test(text))
        setLines((l) =>
          l.map((x) =>
            x.id === id + 1
              ? hit
                ? { ...x, state: 'default', text: hit.text }
                : { ...x, state: 'error', text: 'Не нашёл ответа. Спросите иначе — например, имя сотрудника или название показателя.' }
              : x,
          ),
        )
        setState(hit ? 'success' : 'error')
        timers.current.push(window.setTimeout(() => setState('idle'), 2400))
      }, 1500),
    )
  }

  const tile = (label: string, value: string, sub: string) => (
    <DashboardInfo
      key={label}
      label={label}
      labelIcon={false}
      value={value}
      change={sub}
      changeIcon={false}
      changeTone="neutral"
      featureIcon={false}
      action={{ 'aria-label': `Открыть: ${label}` }}
    />
  )

  return (
    <div className={s.page}>
      <section className={s.chat} aria-label="Чат с Кипи">
        <div className={s.head}>
          <KipiAvatar state={state} size={36} label={`Кипи: ${KIPI_STATE_TEXT[state]}`} />
          <div className={s.headText}>
            <h2 className="ui-heading-2-medium">Ассистент Кипи</h2>
            <span className={`${s.state} ui-body-2-normal`} aria-live="polite">
              {KIPI_STATE_TEXT[state]}
            </span>
          </div>
        </div>
        <div className={s.feed} ref={feed}>
          {lines.map((x) => (
            <KipiMessage key={x.id} author={x.author} state={x.state} text={x.text} />
          ))}
        </div>
        <div className={s.chips}>
          {SUGGEST[role].map((q) => (
            <Chip key={q} size="sm" disabled={state === 'thinking'} onClick={() => ask(q)}>
              {q}
            </Chip>
          ))}
        </div>
        <InputField
          type="default-with-button"
          placeholder="Спросите Кипи или найдите сотрудника…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask(draft)}
          buttonText="Отправить"
          onButtonClick={() => ask(draft)}
        />
      </section>

      <section className={s.side}>
        <h2 className="ui-heading-1-semibold">Ждёт вашего решения</h2>
        {/* Сводки по команде — только у руководителя; у сотрудника остаётся краткая сводка по своей матрице */}
        {role === 'manager' && (
          <div className={s.tiles}>
            {[tile('На согласовании', '5 задач', 'у 3 сотрудников'), tile('Ждут закрытия', '3 задачи', 'у 2 сотрудников'), tile('Команда', '2 сотрудника', 'в красной зоне')]}
          </div>
        )}
        <div className={s.card}>
          <p className="ui-body-1-semibold">Моя матрица — выполнение 74%</p>
          <KpiStatus status="progress" />
          <Link type="primary" size="sm" href="#">
            Ваши задачи не отправлены
          </Link>
        </div>
      </section>
    </div>
  )
}
