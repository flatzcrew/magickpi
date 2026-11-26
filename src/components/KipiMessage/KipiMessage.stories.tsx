import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Stack, Width } from '../../catalog/Catalog'
import { InputField } from '../InputField'
import { KipiMessage } from './KipiMessage'

/**
 * Реплика в чате Кипи — AI-ассистента сервиса. Figma: kpi-bro · web, ext `KipiMessage` `174:1350` —
 * Author: kipi · user; State: default · thinking · error (у user только default) — 4 ячейки; текст text.
 *
 * Author=kipi — аватар Кипи и пузырь слева; Author=user — пузырь справа и аватар сотрудника.
 * Ошибка передаётся текстом, не только персонажем. `state` здесь — статус ответа, а не наведение. Не интерактивна.
 */
const meta = {
  title: 'Components/KipiMessage',
  component: KipiMessage,
  tags: ['autodocs'],
  args: {
    author: 'kipi',
    state: 'default',
    text: 'Добрый день, Анна! За ноябрь у отдела продаж 8 задач ждут вашего решения. С чего начнём?',
  },
  argTypes: {
    author: { control: 'inline-radio', options: ['kipi', 'user'] },
    state: { control: 'inline-radio', options: ['default', 'thinking', 'error'] },
    text: { control: 'text' },
    avatarSrc: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Width size="lg">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof KipiMessage>

export default meta
type Story = StoryObj<typeof meta>

/** Ответ Кипи. */
export const Kipi: Story = { args: { author: 'kipi', state: 'default' } }
/** Кипи готовит ответ. */
export const KipiThinking: Story = { args: { author: 'kipi', state: 'thinking', text: 'Смотрю выполнение плана по выручке…' } }
/** Кипи не смог ответить — текст ошибки обязателен. */
export const KipiError: Story = {
  args: { author: 'kipi', state: 'error', text: 'Не удалось загрузить матрицу за ноябрь. Попробуйте ещё раз.' },
}
/** Вопрос сотрудника. */
export const User: Story = { args: { author: 'user', text: 'Почему у меня 74% по конверсии в сделку?' } }

/** Все 4 ячейки для сверки с Figma. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="Author × State">
        <Width size="lg">
          <Stack>
            {(['default', 'thinking', 'error'] as const).map((st) => (
              <Labeled key={st} label={`kipi / ${st}`}>
                <KipiMessage author="kipi" state={st} text="Помогу разобраться с вашими KPI за ноябрь 2026." />
              </Labeled>
            ))}
            <Labeled label="user / default">
              <KipiMessage author="user" text="Почему у меня 74% по выручке?" />
            </Labeled>
          </Stack>
        </Width>
      </Block>
    </Stack>
  ),
}

interface ChatLine {
  id: number
  author: 'kipi' | 'user'
  state: 'default' | 'thinking' | 'error'
  text: string
}

const ANSWERS = [
  'Конверсия в сделку — 22% при плане 20%: выполнение 110%. Это лучший показатель в вашей матрице за ноябрь.',
  'По выручке 1 176 000 ₽ из 1 200 000 ₽ — 98%. До плана не хватает 24 000 ₽, это примерно одна средняя сделка.',
  'Итог ноября пока 97%. Внесите факт по «Заполнению CRM», и я пересчитаю.',
]

function Chat() {
  const [lines, setLines] = useState<ChatLine[]>([
    { id: 0, author: 'kipi', state: 'default', text: 'Добрый день, Иван! Спросите про любой показатель — посчитаю и объясню.' },
  ])
  const [draft, setDraft] = useState('Как у меня с конверсией?')
  const send = () => {
    const q = draft.trim()
    if (!q) return
    const id = Date.now()
    const asked = lines.filter((x) => x.author === 'user').length // ответы по порядку: первый — про конверсию
    setDraft('')
    // Отправка: реплика пользователя въезжает справа; Кипи печатает (точки), затем отвечает — смена State с прыжком
    setLines((l) => [...l, { id, author: 'user', state: 'default', text: q }, { id: id + 1, author: 'kipi', state: 'thinking', text: 'Смотрю матрицу' }])
    setTimeout(() => {
      setLines((l) =>
        l.map((x) => (x.id === id + 1 ? { ...x, state: 'default', text: ANSWERS[asked % ANSWERS.length] } : x)),
      )
    }, 1600)
  }
  return (
    <Stack>
      {lines.map((x) => (
        <KipiMessage key={x.id} author={x.author} state={x.state} text={x.text} />
      ))}
      <InputField
        type="default-with-button"
        placeholder="Спросите Кипи"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        buttonText="Отправить"
        onButtonClick={send}
      />
    </Stack>
  )
}

/**
 * Живой чат: «Отправить» (или Enter) — реплика пользователя въезжает справа, Кипи печатает (бегущие точки,
 * персонаж «дышит»), через 1.6 с отвечает — реплика меняет State, и Кипи подпрыгивает.
 */
export const LiveChat: Story = {
  name: 'Чат (отправка и печать)',
  render: () => <Chat />,
}
