import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Stack, Stateful, Width } from '../../catalog/Catalog'
import { EmployeeGroupHeader } from './EmployeeGroupHeader'

/**
 * Шапка группы задач сотрудника (SCR-14). Figma: kpi-bro · web, ext `EmployeeGroupHeader` `176:2694` —
 * Offer: false · true (2 ячейки); тексты name, role, count.
 *
 * «Выбрать все», аватар, имя и должность, число задач, ссылка на матрицу.
 * Offer=true — строка с предложением оценить; только во вкладке «Ждут закрытия» после закрытия всех задач сотрудника.
 * Сама шапка не интерактивна; чекбокс, ссылка и кнопки — со своими нативными состояниями.
 */
const meta = {
  title: 'Components/EmployeeGroupHeader',
  component: EmployeeGroupHeader,
  tags: ['autodocs'],
  args: {
    offer: false,
    name: 'Иван Петров',
    role: 'Менеджер по продажам',
    count: '3 задачи',
    initials: 'ИП',
    selectAllLabel: 'Выбрать все у Ивана',
    selectAllChecked: false,
    selectAllIndeterminate: false,
    onSelectAllChange: fn(),
    matrixLabel: 'Матрица',
    matrixArrow: false,
    onMatrixClick: fn(),
    offerText: 'Задачи Ивана закрыты. Поставить оценку за ноябрь?',
    assessAction: { label: 'Оценить', onClick: fn() },
    laterAction: { label: 'Позже', onClick: fn() },
  },
  argTypes: {
    offer: { control: 'boolean' },
    name: { control: 'text' },
    role: { control: 'text' },
    count: { control: 'text' },
    initials: { control: 'text' },
    selectAllLabel: { control: 'text' },
    selectAllChecked: { control: 'boolean' },
    selectAllIndeterminate: { control: 'boolean' },
    onSelectAllChange: { control: false },
    matrixLabel: { control: 'text' },
    matrixHref: { control: 'text' },
    onMatrixClick: { control: false },
    matrixArrow: { control: 'boolean' },
    offerText: { control: 'text' },
    assessAction: { control: 'object' },
    laterAction: { control: 'object' },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <Width size="xl">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof EmployeeGroupHeader>

export default meta
type Story = StoryObj<typeof meta>

/** Шапка группы без предложения. */
export const Default: Story = {}
/** С предложением поставить оценку за месяц. */
export const Offer: Story = { args: { offer: true } }
/** Выбрана часть задач — чекбокс в indeterminate. */
export const PartlySelected: Story = { args: { selectAllIndeterminate: true } }
/** Ссылка на матрицу со стрелкой. */
export const MatrixArrow: Story = { args: { matrixArrow: true } }

/** Живой «Выбрать все». */
export const LiveSelectAll: Story = {
  render: (args) => (
    <Stateful initial={false}>{(v, set) => <EmployeeGroupHeader {...args} selectAllChecked={v} onSelectAllChange={set} />}</Stateful>
  ),
}

/** Offer false · true для сверки с Figma; чекбокс живой. */
export const AllVariants: Story = {
  decorators: [],
  render: () => (
    <Stack>
      <Block title="Offer">
        <Width size="xl">
          <Stack>
            {[false, true].map((o) => (
              <Labeled key={String(o)} label={`offer=${o}`}>
                <Stateful initial={false}>
                  {(v, set) => (
                    <EmployeeGroupHeader
                      offer={o}
                      name="Анна Смирнова"
                      role="Руководитель отдела продаж"
                      count="16 задач"
                      initials="АС"
                      selectAllLabel="Выбрать все у Анны"
                      offerText="Задачи Анны закрыты. Поставить оценку за ноябрь?"
                      selectAllChecked={v}
                      onSelectAllChange={set}
                    />
                  )}
                </Stateful>
              </Labeled>
            ))}
          </Stack>
        </Width>
      </Block>
    </Stack>
  ),
}
