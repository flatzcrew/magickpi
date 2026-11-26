import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Stack, Width } from '../../catalog/Catalog'
import { ScaleChart } from './ScaleChart'

/**
 * Ступенчатый график шкалы: как выполнение плана превращается в результат.
 * Figma: kpi-bro · web, ext `ScaleChart` `209:1144` — Marker: show · hide (2 ячейки); текст you.
 *
 * Шкала фиксирована, как в Figma: до 80% выполнения — результат 0; 80…105% — равен выполнению; от 105% — 117,5%.
 * Marker=hide — когда факта за месяц ещё нет. `fact` двигает маркер по ступеням. Не интерактивен.
 */
const meta = {
  title: 'Components/ScaleChart',
  component: ScaleChart,
  tags: ['autodocs'],
  args: {
    marker: 'show',
    you: 'Вы здесь: 98%',
    fact: 98,
  },
  argTypes: {
    marker: { control: 'inline-radio', options: ['show', 'hide'] },
    you: { control: 'text' },
    fact: { control: { type: 'range', min: 0, max: 130, step: 1 } },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Width size="xl">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof ScaleChart>

export default meta
type Story = StoryObj<typeof meta>

/** Маркер «Вы здесь» на текущем выполнении. */
export const MarkerShow: Story = { args: { marker: 'show' } }
/** Факта нет — маркер скрыт. */
export const MarkerHide: Story = { args: { marker: 'hide' } }
/** Ниже порога 80%: результат 0. */
export const BelowThreshold: Story = { args: { fact: 72, you: 'Вы здесь: 72%' } }
/** Выше 105%: результат упирается в 117,5%. */
export const AboveCap: Story = { args: { fact: 112, you: 'Вы здесь: 112%' } }

/** Marker show · hide для сверки с Figma. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="Marker">
        <Stack>
          {(['show', 'hide'] as const).map((m) => (
            <Labeled key={m} label={`marker=${m}`}>
              <Width size="xl">
                <ScaleChart marker={m} fact={98} you="Вы здесь: 98%" />
              </Width>
            </Labeled>
          ))}
        </Stack>
      </Block>
    </Stack>
  ),
}
