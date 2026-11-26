import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Matrix, Row, Stack } from '../../catalog/Catalog'
import { InputLabel } from './InputLabel'

const SIZES = ['sm', 'md', 'lg'] as const
const VIEWS = ['текст', '+ пояснение', '+ иконка'] as const

/**
 * Подпись над полем. Figma: кит, `Input-label` `12021:6068` — 3 Size, плюс пояснение, иконка.
 *
 * Пояснение (`supportText`) — в скобках, приглушённым цветом; иконка 16 справа.
 * `disabled` — оверрайд из InputField в состоянии disabled. Интерактивных состояний нет.
 */
const meta = {
  title: 'Components/InputLabel',
  component: InputLabel,
  tags: ['autodocs'],
  args: {
    size: 'md',
    children: 'План на месяц',
    supportText: '(в рублях)',
    icon: 'info',
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    children: { control: 'text' },
    supportText: { control: 'text' },
    icon: { control: 'text' },
    disabled: { control: 'boolean' },
    htmlFor: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InputLabel>

export default meta
type Story = StoryObj<typeof meta>

/** Маленькая подпись. */
export const Small: Story = { args: { size: 'sm' } }
/** Подпись по умолчанию (md) — как внутри InputField. */
export const Medium: Story = { args: { size: 'md' } }
/** Крупная подпись. */
export const Large: Story = { args: { size: 'lg' } }
/** Только основной текст. */
export const TextOnly: Story = { args: { supportText: undefined, icon: undefined, children: 'Название показателя' } }
/** Поле недоступно. */
export const Disabled: Story = { args: { disabled: true } }

/** Матрица Size × состав и disabled. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Size × состав">
        <Matrix
          rows={SIZES}
          cols={VIEWS}
          render={(sz, v) => (
            <InputLabel size={sz} supportText={v === 'текст' ? undefined : '(в рублях)'} icon={v === '+ иконка' ? 'info' : undefined}>
              План на месяц
            </InputLabel>
          )}
        />
      </Block>
      <Block title="Disabled">
        <Row>
          {SIZES.map((sz) => (
            <Labeled key={sz} label={sz}>
              <InputLabel size={sz} disabled supportText="(в рублях)" icon="info">
                План на месяц
              </InputLabel>
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
