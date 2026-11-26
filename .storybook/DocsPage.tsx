/*
 * Страница компонента (autodocs) каталога: как стандартная, но главный пример закреплён —
 * при прокрутке к таблице настроек (Controls) он остаётся сверху, и правки свойств видны сразу (решение дизайнера 2026-11-26).
 * Закрепление действует в пределах блока «пример + настройки»: дальше список stories прокручивается как обычно.
 */
import { Controls, Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks'

export function DocsPage() {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <section className="ds-docs-live">
        <div className="ds-docs-primary">
          <Primary />
        </div>
        <Controls />
      </section>
      <Stories />
    </>
  )
}
