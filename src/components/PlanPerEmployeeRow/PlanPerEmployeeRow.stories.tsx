import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Stack, Stateful, Width } from '../../catalog/Catalog'
import { PlanPerEmployeeRow } from './PlanPerEmployeeRow'

/**
 * Строка «План для каждого» в создании задачи (SCR-06). Figma: kpi-bro · web, ext `PlanPerEmployeeRow` `176:2659` —
 * State: default · error (2 ячейки); текст name.
 *
 * Имя сотрудника, поле плана и подсказка об остатке плана группы. Своих состояний наведения нет: hover / focus — у поля кита.
 * `state="error"` — поле danger и красная подсказка; компонент только показывает ошибку,
 * можно ли сохранить при несовпадении плана — решение заказчика.
 */
const meta = {
  title: 'Components/PlanPerEmployeeRow',
  component: PlanPerEmployeeRow,
  tags: ['autodocs'],
  args: {
    state: 'default',
    name: 'Иван Петров',
    value: '20',
    onValueChange: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['default', 'error'] },
    name: { control: 'text' },
    value: { control: 'text' },
    onValueChange: { control: false },
    hint: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Width size="md">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof PlanPerEmployeeRow>

export default meta
type Story = StoryObj<typeof meta>

/** План распределён полностью. */
export const Default: Story = {}
/** Сумма планов не сходится с планом группы. */
export const ErrorState: Story = { name: 'Error', args: { state: 'error', value: '10' } }
/** Без подсказки. */
export const WithoutHint: Story = { args: { hint: null } }

/** Живой ввод: план группы 100 встреч делится на трёх сотрудников; ошибка, пока сумма не равна 100. */
export const LiveInput: Story = {
  render: () => (
    <Stateful initial={{ ivan: '40', anna: '40', oleg: '10' }}>
      {(v, set) => {
        const left = 100 - Number(v.ivan || 0) - Number(v.anna || 0) - Number(v.oleg || 0)
        const state = left === 0 ? 'default' : 'error'
        const hint = left === 0 ? 'в группе SMART осталось 0 из 100' : left > 0 ? `не хватает ${left} до плана группы` : `больше плана группы на ${-left}`
        return (
          <Stack>
            <PlanPerEmployeeRow name="Иван Петров" state={state} hint={hint} value={v.ivan} onValueChange={(ivan) => set({ ...v, ivan })} />
            <PlanPerEmployeeRow name="Анна Смирнова" state={state} hint={null} value={v.anna} onValueChange={(anna) => set({ ...v, anna })} />
            <PlanPerEmployeeRow name="Олег Кузнецов" state={state} hint={null} value={v.oleg} onValueChange={(oleg) => set({ ...v, oleg })} />
          </Stack>
        )
      }}
    </Stateful>
  ),
}

/** State default · error для сверки с Figma; поле можно навести и сфокусировать — состояния у поля нативные. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="State">
        <Width size="md">
          <Stack>
            <Labeled label="default">
              <PlanPerEmployeeRow state="default" name="Иван Петров" value="20" />
            </Labeled>
            <Labeled label="error">
              <PlanPerEmployeeRow state="error" name="Анна Смирнова" value="10" />
            </Labeled>
            <Labeled label="длинное имя">
              <Stateful initial="25">
                {(v, set) => <PlanPerEmployeeRow name="Константин Константинопольский-Задунайский" value={v} onValueChange={set} />}
              </Stateful>
            </Labeled>
          </Stack>
        </Width>
      </Block>
    </Stack>
  ),
}
