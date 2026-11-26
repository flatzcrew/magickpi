import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Frame, Labeled, Row, Stack, Stateful } from '../../catalog/Catalog'
import { Button } from '../Button'
import { Toast } from './Toast'

const STATES = ['default', 'info', 'success', 'warning', 'danger'] as const

/**
 * Всплывающее временное уведомление. Figma: кит, `Toast` `12071:5771` — State default · info · success · warning · danger, +8
 * (иконка слева, заголовок, Secondary-text, Description, Button-1 secondary, Button-2 tertiary, крестик, Support-text).
 * success · warning · danger красят внешнюю рамку. Ширина кита 592 — в stories тост живёт в `Frame wide`.
 * Позиционирование на экране (угол, стек) — у потребителя. Наведение и нажатие кнопок нативные.
 */
const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    state: 'default',
    icon: 'check',
    title: 'План сохранён',
    secondaryText: 'сейчас',
    description: 'Черновик плана на июнь доступен в разделе «Мои KPI».',
    primaryAction: { label: 'Открыть', onClick: fn() },
    secondaryAction: { label: 'Отменить', onClick: fn() },
    onClose: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES },
    icon: { control: 'text' },
    title: { control: 'text' },
    secondaryText: { control: 'text' },
    description: { control: 'text' },
    primaryAction: { control: 'object' },
    secondaryAction: { control: 'object' },
    onClose: { control: false },
    closeLabel: { control: 'text' },
    supportText: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Frame wide>
          <Story />
        </Frame>
      ),
  ],
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { state: 'default' } }
export const Info: Story = { args: { state: 'info', icon: 'info', title: 'Новая задача', description: 'Анна Смирнова назначила вам задачу.' } }
export const Success: Story = { args: { state: 'success', title: 'План согласован', description: 'Выполнение плана 98%.' } }
export const Warning: Story = { args: { state: 'warning', icon: 'info', title: 'Срок близко', description: 'Факт за июнь нужно внести до 30 июня.' } }
export const Danger: Story = { args: { state: 'danger', icon: 'cross', title: 'Не удалось сохранить', description: 'Проверьте соединение и повторите.', primaryAction: { label: 'Повторить' }, secondaryAction: undefined } }
/** С подписью под карточкой — таймер автозакрытия. */
export const WithSupportText: Story = { args: { supportText: 'Закроется через 5 секунд' } }

/** Показ и закрытие настоящей кнопкой. */
export const ShowHide: Story = {
  parameters: { bare: true },
  render: (args) => (
    <Stateful initial={false}>
      {(open, setOpen) => (
        <Stack>
          <Button onClick={() => setOpen(true)}>Сохранить план</Button>
          {open && <Toast {...args} state="success" onClose={() => setOpen(false)} secondaryAction={{ label: 'Отменить', onClick: () => setOpen(false) }} />}
        </Stack>
      )}
    </Stateful>
  ),
}

/** Все State. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="State">
        <Stack>
          {STATES.map((st) => (
            <Labeled key={st} label={st}>
              <Toast
                state={st}
                icon="check"
                title="План сохранён"
                secondaryText="сейчас"
                description="Черновик доступен в разделе «Мои KPI»"
                primaryAction={{ label: 'Открыть' }}
                secondaryAction={{ label: 'Отменить' }}
                onClose={() => {}}
              />
            </Labeled>
          ))}
        </Stack>
      </Block>
    </Stack>
  ),
}

/* ---------- Глубже: длинный контент, крайние состояния, появление ---------- */

/** Длинный текст: заголовок и описание в несколько строк, длинные подписи кнопок. */
export const LongText: Story = {
  args: {
    state: 'warning',
    icon: 'info',
    title: 'Факт по показателю «Конверсия в сделку из квалифицированного лида» не внесён',
    secondaryText: '5 мин назад',
    description:
      'До закрытия периода «Ноябрь 2026» осталось два дня. Без факта показатель уйдёт в итог как «нет данных», а выполнение плана отдела продаж будет посчитано без него.',
    primaryAction: { label: 'Внести факт сейчас' },
    secondaryAction: { label: 'Напомнить завтра утром' },
  },
}

/** Минимум: только заголовок, без описания, кнопок и времени. */
export const TitleOnly: Story = {
  args: { title: 'Изменения сохранены', secondaryText: undefined, description: undefined, primaryAction: undefined, secondaryAction: undefined },
}

/** Стопка и появление: каждый Toast всплывает снизу за 0.2s; держим не больше трёх, старые уходят. */
export const StackAppear: Story = {
  parameters: { bare: true, layout: 'padded' },
  render: () => {
    const EVENTS = [
      { state: 'success', icon: 'check', title: 'План согласован', description: 'Иван Петров · Ноябрь 2026' },
      { state: 'info', icon: 'info', title: 'Новая задача', description: 'Анна Смирнова назначила задачу «Согласовать план на декабрь»' },
      { state: 'warning', icon: 'info', title: 'Срок близко', description: 'Факт за ноябрь — до 30 ноября' },
      { state: 'danger', icon: 'cross', title: 'Не удалось сохранить', description: 'Проверьте соединение и повторите' },
    ] as const
    return (
      <Stateful<number[]> initial={[]}>
        {(list, set) => (
          <Stack>
            <Row>
              <Button onClick={() => set([...list.slice(-2), (list.at(-1) ?? -1) + 1])}>Показать уведомление</Button>
            </Row>
            <Stack>
              {list.map((id) => {
                const e = EVENTS[id % EVENTS.length]
                return <Toast key={id} {...e} onClose={() => set(list.filter((x) => x !== id))} />
              })}
            </Stack>
          </Stack>
        )}
      </Stateful>
    )
  },
}
