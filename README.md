# Magic UI — KPI by Pitonize Design System

React-база и каталог компонентов для редизайна сервиса KPI сотрудников (MVP).
Зеркало дизайн-системы Atomize PRO 3.4 («Pitonize Design System» в Figma) и локальных компонентов макетов kpi-bro · web.

## Источник дизайн-системы

Единственный источник исходников, токенов, компонентов, stories и sandboxes — этот репозиторий.

Репозиторий [magickpi-ds-show](https://github.com/flatzcrew/magickpi-ds-show) оставлен как исторический собранный артефакт и больше не используется для редактирования дизайн-системы. Актуальный Storybook собирается workflow из этого репозитория и доступен как артефакт GitHub Actions. GitHub Pages можно подключить отдельно в настройках репозитория.

## Что внутри

| Часть | Где | Что |
| --- | --- | --- |
| Токены | `src/tokens/` | примитивы, семантика (темы Light и Dark через `[data-theme]`), типографика — сняты из Figma |
| Компоненты | `src/components/<Name>/` | 92 компонента: 69 из кита + 23 продуктовых (KPI-матрица, задачи, Кипи). Карта, варианты и соглашения — [`COMPONENTS.md`](COMPONENTS.md) |
| Иконки | `src/assets/icons/` | 198 SVG кита, компонент `Icon` (`<Icon name="pie-chart" />`) |
| Каталог | `.storybook/`, `*.stories.tsx` | Storybook: Foundation (все переменные), страницы компонентов с контролами и Copy code, песочницы |
| Песочницы | `src/sandboxes/` | компоненты в связке: формы, навигация, KPI-матрица, окна из макетов, экран «Ассистент Кипи» |
| Тестовая страница | `src/Showcase.tsx` | галерея всех компонентов (`npm run dev`) |

Стек: Vite 8, React 19, TypeScript, CSS Modules, CSS-переменные. Стили — только токенами (`var(--…)`), без чисел в обход системы.

## Запуск

Нужен Node.js 18+.

```bash
npm install
npm run storybook        # каталог → http://localhost:6006
npm run dev              # тестовая страница → http://localhost:5173
npm run build            # проверка типов и сборка
npx vitest run --project=storybook   # прогон всех stories в браузере без окна
```

## С чего начать разработчику

1. Storybook → **Foundation** — токены и типографика.
2. **Components** → нужный компонент: страница с таблицей свойств, контролами и Copy code; в каждой story клики работают как в продукте.
3. **Sandboxes → Окна из макетов** — экраны целиком: сайдбар, роли руководитель / сотрудник, окна справа, Ассистент Кипи.
4. Правила имён и кода — [`COMPONENTS.md`](COMPONENTS.md) (React-имя = имя в Figma, пропсы = свойства Figma).
