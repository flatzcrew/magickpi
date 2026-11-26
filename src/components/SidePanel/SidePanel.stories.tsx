import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Frame, Labeled, Row, Stack } from '../../catalog/Catalog'
import { KpiStatus } from '../KpiStatus'
import { SidePanel } from './SidePanel'

/**
 * Боковая панель поверх экрана. Figma: kpi-bro · web, ext `SidePanel` `209:997` — один компонент без вариантов;
 * showActions, Body (слот).
 *
 * Шапка `ModalHeader` (compact, крестик) · тело со скроллом · `ModalActions`. Статус кладётся первой строкой тела.
 * Подтверждение и выбор — `Modal` кита. Кнопки и крестик — с нативными состояниями.
 * **На экранах не используется** (решение дизайнера 2026-11-25), в ДС остаётся.
 */
const meta = {
  title: 'Components/SidePanel',
  component: SidePanel,
  tags: ['autodocs'],
  args: {
    heading: 'Выручка',
    showClose: true,
    onClose: fn(),
    showActions: true,
    actionsProps: { primaryLabel: 'Сохранить', secondaryLabel: 'Отмена', onPrimary: fn(), onSecondary: fn() },
  },
  argTypes: {
    heading: { control: 'text' },
    showClose: { control: 'boolean' },
    onClose: { control: false },
    children: { control: false },
    showActions: { control: 'boolean' },
    actionsProps: { control: 'object' },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <Frame wide tall>
        <Story />
      </Frame>
    ),
  ],
} satisfies Meta<typeof SidePanel>

export default meta
type Story = StoryObj<typeof meta>

/** Мастер: тело-заглушка, с действиями. */
export const Default: Story = {}
/** Карточка показателя: статус первой строкой тела. */
export const WithBody: Story = {
  args: {
    children: (
      <Stack>
        <KpiStatus status="done" type="1+1" value="98%" />
        <p className="ui-body-1-normal">Вес 30% · План 1 200 000 ₽ · Факт 1 176 000 ₽. Выполнение плана 98%, ноябрь 2026.</p>
      </Stack>
    ),
  },
}
/** Без блока действий. */
export const WithoutActions: Story = { args: { showActions: false } }
/** Без крестика. */
export const WithoutClose: Story = { args: { showClose: false } }

/** С действиями и без для сверки с Figma. */
export const AllVariants: Story = {
  decorators: [],
  render: () => (
    <Stack>
      <Block title="showActions">
        <Row>
          <Labeled label="showActions=true">
            <Frame wide tall>
              <SidePanel heading="Выручка" onClose={fn()} actionsProps={{ primaryLabel: 'Сохранить', secondaryLabel: 'Отмена' }} />
            </Frame>
          </Labeled>
          <Labeled label="showActions=false">
            <Frame wide tall>
              <SidePanel heading="Конверсия в сделку" onClose={fn()} showActions={false} />
            </Frame>
          </Labeled>
        </Row>
      </Block>
    </Stack>
  ),
}
