import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Frame, Labeled, Row, Stack, Stateful } from '../../catalog/Catalog'
import { Button } from '../Button'
import { Modal } from './Modal'

const SIZES = ['compact', 'large'] as const

/**
 * Модальное окно. Figma: кит, `Modal` `16414:19664` — Size compact · large, +3 (Modal-actions, Scroller, Body).
 * Состав: `ModalHeader` (Spacing = Size) · Body (слот) · `ModalActions`. Подложка — `ModalOverlay`;
 * клик по подложке, крестик и Esc вызывают `onClose`.
 *
 * Слой окна `position: fixed`, поэтому в stories окно живёт внутри `Frame` (рамка — containing block).
 * `overlay={false}` — окно в потоке, для сверки с Figma.
 */
const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    size: 'compact',
    open: true,
    overlay: true,
    scroller: true,
    onClose: fn(),
    header: {
      heading: 'Согласовать план KPI',
      description: 'План на июнь уйдёт руководителю отдела продаж',
      headerIcon: 'pie-chart',
    },
    actions: { primaryLabel: 'Отправить', secondaryLabel: 'Отмена' },
    children: <p className="ui-para-normal">5 показателей, суммарный вес 100%. Иван Петров получит уведомление.</p>,
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    open: { control: 'boolean' },
    onClose: { control: false },
    overlay: { control: 'boolean' },
    header: { control: 'object' },
    children: { control: false },
    actions: { control: 'object' },
    scroller: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Frame tall wide>
          <Story />
        </Frame>
      ),
  ],
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

/** Компактное окно с подложкой. */
export const Compact: Story = { args: { size: 'compact' } }
/** Крупное окно: шапка large. */
export const Large: Story = {
  args: {
    size: 'large',
    header: { heading: 'Новая задача', description: 'Задача попадёт в Мои KPI', headerIcon: 'plus' },
    actions: { primaryLabel: 'Создать', secondaryLabel: 'Отмена' },
  },
}
/** Без подложки — окно в потоке. */
export const WithoutOverlay: Story = { args: { overlay: false } }
/** Без кнопок внизу. */
export const WithoutActions: Story = { args: { actions: false } }

/** Открытие и закрытие настоящей кнопкой; закрыть — Esc, крестик, подложка или кнопки. */
export const OpenClose: Story = {
  render: (args) => (
    <Stateful initial={false}>
      {(open, setOpen) => (
        <>
          <Button onClick={() => setOpen(true)}>Удалить задачу</Button>
          <Modal
            {...args}
            open={open}
            onClose={() => setOpen(false)}
            header={{ heading: 'Удалить задачу?', description: 'Задача «Провести 40 встреч» исчезнет из плана' }}
            actions={{
              primaryLabel: 'Удалить',
              onPrimary: () => setOpen(false),
              secondaryLabel: 'Отмена',
              onSecondary: () => setOpen(false),
            }}
          >
            <p className="ui-para-normal">Действие нельзя отменить.</p>
          </Modal>
        </>
      )}
    </Stateful>
  ),
}

/** Size compact · large без подложки и окно с подложкой в рамке. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="Size (overlay=false)">
        <Row>
          {SIZES.map((sz) => (
            <Labeled key={sz} label={sz}>
              <Modal
                size={sz}
                overlay={false}
                header={{ heading: sz === 'compact' ? 'Удалить задачу?' : 'Новая задача', headerIcon: sz === 'large' ? 'plus' : undefined, description: 'План на июнь' }}
                actions={{ primaryLabel: sz === 'compact' ? 'Удалить' : 'Создать', secondaryLabel: 'Отмена' }}
              >
                <p className="ui-para-normal">Содержимое окна: показатели и веса.</p>
              </Modal>
            </Labeled>
          ))}
        </Row>
      </Block>
      <Block title="С подложкой (в рамке)">
        <Frame tall wide>
          <Modal size="compact" header={{ heading: 'Согласовать план KPI' }} actions={{ primaryLabel: 'Отправить' }}>
            <p className="ui-para-normal">Подложка ограничена рамкой.</p>
          </Modal>
        </Frame>
      </Block>
    </Stack>
  ),
}

/* ---------- Глубже: длинный контент, крайние состояния, появление ---------- */

/** Длинное содержимое: Body прокручивается внутри окна (Scroller справа), шапка и кнопки на месте. */
export const LongBody: Story = {
  args: {
    header: { heading: 'Правила расчёта KPI', description: 'Ноябрь 2026 · Отдел продаж', headerIcon: 'info' },
    actions: { primaryLabel: 'Понятно', secondaryLabel: null },
    children: (
      <>
        {[
          'Выполнение показателя — факт, делённый на план. Для показателей «чем меньше, тем лучше» — план, делённый на факт.',
          'Оценка ограничена шкалой: ниже порога — 0%, выше потолка — потолок шкалы.',
          'Взвешенная оценка — оценка, умноженная на вес показателя. Сумма весов в матрице — 100%.',
          'Итог месяца — сумма взвешенных оценок. Показатель без факта уходит в итог как «нет данных».',
          'Руководитель может скорректировать оценку до закрытия периода; корректировка видна сотруднику с комментарием.',
          'После закрытия периода матрица доступна только для чтения, изменения — через новый период.',
          'Задачи сотрудника не влияют на итог напрямую, но учитываются при оценке руководителя.',
        ].map((t) => (
          <p key={t} className="ui-para-normal">
            {t}
          </p>
        ))}
      </>
    ),
  },
}

/** Длинный заголовок и описание: перенос в шапке. */
export const LongHeading: Story = {
  args: {
    header: {
      heading: 'Отправить итоги месяца по всем сотрудникам отдела на согласование директору по продажам?',
      description: 'После отправки изменить факт и оценки можно будет только через запрос на корректировку у руководителя отдела',
      headerIcon: 'pie-chart',
    },
    actions: { primaryLabel: 'Отправить на согласование', secondaryLabel: 'Вернуться к редактированию' },
  },
}

/** Появление: подложка проявляется, окно — из прозрачности с лёгким увеличением (0.2s). Нажми кнопку несколько раз. */
export const Appear: Story = {
  render: (args) => (
    <Stateful initial={false}>
      {(open, setOpen) => (
        <>
          <Button onClick={() => setOpen(true)}>Открыть окно</Button>
          <Modal
            {...args}
            open={open}
            onClose={() => setOpen(false)}
            actions={{ primaryLabel: 'Закрыть', onPrimary: () => setOpen(false), secondaryLabel: null }}
          />
        </>
      )}
    </Stateful>
  ),
}
