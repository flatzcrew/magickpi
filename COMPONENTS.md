# Карта компонентов — React-база KPI Bro

Фаза 2 директивы `react_base` (2026-11-25). Источник: каталог ДС (`design-system/components.md`, `INDEX.md`) и сверка в Figma только чтением:
кит «Pitonize Design System» (Atomize PRO 3.4, fileKey `eXsMwWilMH7f3cOWXFRwM5`) и файл «kpi-bro · web» (fileKey `g7J26Px38QrCpxkS043gXB`, секция «UI Kit — v2» `164:659`).
Колонка «Зависит от» снята из Figma: вложенные инстансы во всех вариантах компонента.

**Итого:** 92 компонента = 69 из кита (68 наборов + `Icon`-заглушка для 198 `Icons / *`) + 23 ext. 8 пачек.

## Правила именования

1. **React-имя = якорь.** По нему компонент ищется в Figma, в каталоге ДС, в Storybook и на экранах. Переименовать — только вместе с каталогом ДС.
2. **Имя из Figma → PascalCase:** части через `-`, `/` и пробел; у каждой части первая буква заглавная, остальные строчные.
   `Input-field` → `InputField`, `Button-danger` → `ButtonDanger`, `Sidebar-item-compact` → `SidebarItemCompact`, `QR-code` → `QrCode`, `Logomark-KPI` → `LogomarkKpi`.
3. **Исключение — `Modal-actions/CTAs` → `ModalActions`.** «/CTAs» описывает, что внутри блока (кнопки), а не уровень иерархии. Коллизий нет.
4. **ext-компоненты** уже названы в PascalCase (`KpiStatus`, `TaskRow`) — имя переносится как есть.
5. **`Icons / <name>` (198 шт.)** → один компонент `Icon` с пропом `name` в kebab-case (`Icons / Pie-chart` → `<Icon name="pie-chart" />`). У пар контур / заливка залитая — с суффиксом `-filled` (`user` / `user-filled`). SVG — `src/assets/icons/<name>.svg`, выгружены из кита через ds-keeper 2026-11-26.
6. **Пропсы = свойства Figma в camelCase, значения — как в Figma:** `Type` → `type`, `Size` → `size`, `State` → `state`, `showLabel` → `showLabel`.
   Эмодзи-префиксы у значений отбрасываются (`🟢-active-primary` → `'active-primary'`, `⚫️-active-neutral` → `'active-neutral'`, `🔴-inactive` → `'inactive'`, `#️⃣-digit` → `'digit'`).
   Опечатки Figma сохраняются, потому что имя = якорь (Tooltip `botom-left`, `botom-right`).
   HTML-атрибут `type` у кнопок и полей передаётся как `htmlType`, чтобы не конфликтовать с `type` из Figma.
7. **Состояния** hover / pressed / focus / disabled — нативно (`:hover`, `:active`, `:focus-visible`, `:disabled`). Проп `state` их принудительно включает для каталога и Showcase.
   Тема-варианты кита (`default-dark`, `filled-dark` и т. п.) повторяют тему и в React не нужны: тему переключает `[data-theme]`. Значение в union остаётся, чтобы матрица совпадала с Figma.
8. **Папка:** `src/components/<ReactName>/<ReactName>.tsx` + `<ReactName>.module.css` + `index.ts`; реэкспорт — `src/components/index.ts`.
9. **Токены:** CSS-переменная = имя Variable в Figma в kebab-case с сохранением иерархии (`Surface/s0` → `--surface-s0`, `Text/primary-med-em` → `--text-primary-med-em`, `Space/xl` → `--space-xl`, `Radius/small-component/md` → `--radius-small-component-md`). Effect style — так же (`Elevation/e3` → `--elevation-e3`, `Pressed/primary` → `--pressed-primary`). TextStyle → класс (`UI/body-1/medium` → `.ui-body-1-medium`). Компоненты берут только семантику (`--surface-*`, `--text-*`, `--outline-*`, `--overlay-*`, `--elevation-*`), `--space-*`, `--radius-*`, `--typeface-*` и типоклассы; примитивы `--color-*` / `--project-*` напрямую нельзя (CONTRACT).

`image` во вложениях кита — служебный слот картинки (у Button, Input-cell, Tag и др.). Отдельным компонентом не переносится: в React это слот (`<img>` / `ReactNode`).

## Таблица

Матрица: только VARIANT-свойства; `+N` — boolean / text / instance-swap свойства. Node ID кита — в `eXsMwWilMH7f3cOWXFRwM5`, ext — в `g7J26Px38QrCpxkS043gXB`.

| React | Figma | Источник | Node ID | Варианты и состояния | Зависит от | Пачка |
| --- | --- | --- | --- | --- | --- | --- |
| Icon | Icons / * (198) | кит | страница `10003:179` | `name` (198 иконок кита, SVG в `src/assets/icons/`), размер по контейнеру; имени нет в ките — рамка-заглушка | — | 1 |
| Status | Status | кит | `10009:933` | Type: success · warning · danger · disabled; Outline: false · true | — | 1 |
| DividerHorizontal | Divider-horizontal | кит | `12124:22493` | Align: bottom · center · top · center-double; Ends: pointed · rounded | — | 1 |
| Button | Button | кит | `8003:300` | Type: primary · primary-gradient · primary-light · secondary · tertiary · quaternary · neutral · flat · primary-flat; Size: xs…xl; State: default · hover · pressed · disabled; +10 (иконки слева/справа, тексты, изображение) — 180 ячеек | Icon, image | 1 |
| IconButton | Icon-button | кит | `10078:2975` | Type: как у Button; Size: xs…xl; State: default · hover · pressed · disabled; +1 (иконка) | Icon | 1 |
| Link | Link | кит | `10055:1344` | Type: primary · secondary · tertiary; Size: xs…xl; State: default · hover · disabled; +7 | Icon | 1 |
| Avatar | Avatar | кит | `10010:1415` | Type: image · text · icon; Size: xxs · xs · sm · md · lg · xl; +3 (иконка, статус) | Icon, Status | 1 |
| Tag | Tag | кит | `10106:4651` | Type: primary · secondary · tertiary · neutral · info · success · warning · danger · primary-light; Size: xs · sm · md; State: default · hover · disabled; +10 | Icon, image | 1 |
| InputLabel | Input-label | кит | `12021:6068` | Size: sm · md · lg; +3 | Icon | 1 |
| HintLabel | Hint-label | кит | `12021:6331` | Size: sm · md · lg; +3 | Icon | 1 |
| DigitInput | Digit-input | кит | `12045:686` | State: default · hover · default-dark · filled · active · danger · disabled · filled-dark · hover-dark | — | 1 |
| InputCell | Input-cell | кит | `8016:286` | Type: default · default-with-button · textarea; Size: xs…xl; +10 | Icon, Button, image | 1 |
| InputField | Input-field | кит | `12022:7132` | State: default · hover · filled · active · danger · disabled · naked · digit · digit-lg · default-dark · default-dark-hover · filled-dark · naked-disabled; +3 (label, hint, separator) | InputLabel, InputCell, HintLabel, DigitInput, Icon | 1 |
| DividerVertical | Divider-vertical | кит | `12124:22532` | Align: right · center · left · center-double; Ends: pointed · rounded | — | 2 |
| ButtonDanger | Button-danger | кит | `10076:1687` | Type: primary · primary-gradient · primary-light · secondary · tertiary · quaternary; Size: xs…xl; State: default · hover · pressed · disabled; +10 | Icon, image | 2 |
| ButtonSuccess | Button-success | кит | `10078:1874` | как у ButtonDanger | Icon, image | 2 |
| Checkbox | Checkbox | кит | `10030:982` | State: unchecked · hover · checked · disabled · indeterminate · indeterminate-disabled · checked-pressed; Size: sm · md · lg | — | 2 |
| Radio | Radio | кит | `10053:1943` | State: inactive · hover · active · disabled · active-pressed; Size: sm · md | — | 2 |
| Toggle | Toggle | кит | `10023:1125` | State: switch-off · switch-off-disabled · switch-on · switch-on-disabled · switch-on-pressed; Size: sm · md · lg · mobile | — | 2 |
| FeatureIcon | Feature-icon | кит | `12051:4447` | Type: primary · primary-light · secondary · tertiary · quaternary · neutral · primary-flat; Size: xs…xl; +1 | Icon | 2 |
| InfoNote | Info-note | кит | `12126:4670` | State: default · info · success · warning · danger · brand; Size: sm · md · lg; +1 | Icon | 2 |
| Scroller | Scroller | кит | `12124:22602` | Type: vertical · horizontal | — | 2 |
| Indicator | Indicator | кит | `14225:4055` | State: active-1 · active-2 · inactive | — | 2 |
| ModalOverlay | Modal-overlay | кит | `12048:20` | одиночный | — | 2 |
| ModalDragger | Modal-dragger | кит | `16161:28428` | одиночный («ручка» шторки) | — | 2 |
| CheckboxLabel | Checkbox-label | кит | `10095:3846` | Direction: left · right; Size: sm · md; +2 | Checkbox | 3 |
| RadioLabel | Radio-label | кит | `10100:3931` | Direction: left · right; Size: sm · md; +2 | Radio | 3 |
| ToggleLabel | Toggle-label | кит | `10101:3995` | Direction: left · right; Size: sm · md; +1 | Toggle | 3 |
| SwitcherItem | Switcher-item | кит | `10004:1260` | Type: active-neutral · inactive · active · active-primary · active-primary-light · active-secondary; Size: xs…xl; State: default · hover; +10 | Icon, image | 3 |
| Switcher | Switcher | кит | `10004:1441` | Type: default · secondary; Size: xs…xl; State: default | SwitcherItem | 3 |
| Chip | Chip | кит | `10005:4414` | Type: unselected · selected · selected-solid; Size: xs · sm · md; State: default · hover · pressed · disabled · drag; +10 | Icon, image | 3 |
| ChipSpecial | Chip-special | кит | `10112:2912` | Type: unselected · selected; Size: xs · sm · md; State: default · hover · disabled · drag · pressed; +6 | Avatar, Icon | 3 |
| TagSpecial | Tag-special | кит | `10108:4237` | Type: как у Tag; Size: sm · md; State: default · hover · disabled; +6 | Avatar, Icon | 3 |
| ButtonGroup | Button-group | кит | `12147:7059` | Size: xs…xl; Type: combined · spaced-out; +4 (видимость кнопок 2–5) | Button | 3 |
| IconButtonGroup | Icon-button-group | кит | `12147:7934` | Size: xs…xl; +4 | IconButton | 3 |
| AvatarGroup | Avatar-group | кит | `10087:2600` | Size: xs…xl | Avatar, Button | 3 |
| NotificationBell | Notification-bell | кит | `37569:3495` | Type: numeric · status · numeric-sm · status-sm | Icon, Status, image | 3 |
| InputCellSpecial | Input-cell-special | кит | `12041:566` | Type: default · default-with-button · textarea; Size: md · lg; State: resting · pressed; +9 | Icon, Button, image | 4 |
| InputFieldSpecial | Input-field-special | кит | `12041:1143` | State: default · hover · default-dark · filled · active · danger · disabled · filled-dark · hover-dark; +1 | InputCellSpecial, HintLabel | 4 |
| Dropdown | Dropdown | кит | `12041:1595` | State: default · hover · pressed · active · danger · disabled · naked · default-dark · naked-disabled · primary-light; Auto-layout: FALSE · TRUE (технический, в React не нужен); +2 | InputLabel, InputCell, HintLabel, Icon, image | 4 |
| InputCellMobile | Input-cell-mobile | кит | `53469:2145` | Type: default · default-with-action · textarea; Size: md · lg; +6 | Icon, Button, image | 4 |
| InputFieldMobile | Input-field-mobile | кит | `53469:2117` | State: default · filled · active · danger · disabled; +1 | InputCellMobile, HintLabel | 4 |
| TopNavItem | Top-nav-item | кит | `10092:4521` | Type: active-neutral · inactive · inactive-outlined · active · active-naked · active-primary · active-primary-light · active-secondary; Size: xs…xl; State: default · hover; +10 | Icon, image | 4 |
| TopNav | Top-nav | кит | `10004:2719` | Size: xs…xl | TopNavItem, Icon | 4 |
| TabNavItem | Tab-nav-item | кит | `10048:1068` | Type: inactive · active-primary; Size: xs…xl; State: default · hover; +10 | Icon, image | 4 |
| TabNav | Tab-nav | кит | `10048:1249` | Type: default; Size: xs…xl; State: default | TabNavItem | 4 |
| SidebarItem | Sidebar-item | кит | `12018:6386` | Type: active-neutral · inactive · active · active-primary · active-primary-light · active-secondary · active-tertiary; Size: sm · md · lg · xl; State: default · hover; +9 | Icon, Tag | 4 |
| SidebarItemCompact | Sidebar-item-compact | кит | `42927:1227` | Type: как у SidebarItem; Size: md · lg; State: default · hover; +3 | Icon | 4 |
| PageIndicator | Page-indicator | кит | `14195:5866` | одиночный; +2 | Indicator | 4 |
| TableCell | Table-cell | кит | `16115:25252` | Size: md · lg; State: default · loading; Type: default · header; +31 (lead-элементы, теги, трейлинг-тексты, кнопки, dropdown) | Checkbox, Icon, Tag, IconButton, Dropdown, InputCell, Button, image | 5 |
| List | List | кит | `10063:2066` | Size: sm · md · lg · xl; State: default · hover · active; +31 | Checkbox, Icon, Tag, IconButton, Button, image | 5 |
| Dropmenu | Dropmenu | кит | `12127:30113` | одиночный; +1 (Body — слот строк List) | InputField, InputCell, List, DividerHorizontal, Tag, Icon, image | 5 |
| Pagination | Pagination | кит | `12124:22612` | Page: first · center · last · less-pages · mobile · load-more; +4 | IconButton, Button, InputField, InputCell, DividerVertical, Dropdown, Icon | 5 |
| Table | Table | кит | `12123:12697` | одиночный; +3 (Pagination, Scroller, Sheet) | TableCell, Pagination, Scroller, Avatar, Dropdown, InputField, InputCell, IconButton, Button, DividerVertical, Icon | 5 |
| ModalHeader | Modal-header | кит | `14160:29188` | Spacing: compact · large; +10 | FeatureIcon, Link, IconButton, Button, ModalDragger, Icon | 5 |
| ModalActions | Modal-actions/CTAs | кит | `14158:28302` | одиночный; +2 | Button, Link, Icon | 5 |
| Modal | Modal | кит | `16414:19664` | Size: compact · large; +3 | ModalHeader, ModalActions, Scroller | 5 |
| Tooltip | Tooltip | кит | `12089:7621` | Direction: botom-left · botom-right · bottom-center · left-center · right-center · top-center · top-left · top-right; +7 | FeatureIcon, Button; Video (Media, не переносим — слот медиа пустой) | 5 |
| Alert | Alert | кит | `12074:6202` | State: default · info · success · warning · danger; +11 | FeatureIcon, Button, ButtonSuccess, ButtonDanger, Link, IconButton | 5 |
| Toast | Toast | кит | `12071:5771` | State: default · info · success · warning · danger; +8 | FeatureIcon, Button, IconButton | 5 |
| ProfileDropdown | Profile-dropdown | кит | `16451:77325` | одиночный; +6 | Avatar, IconButton | 5 |
| Sidebar | Sidebar | кит | `12171:3030` | State: expanded · collapsed-compact; +5 (CTAs, профиль, секции, header) | SidebarItem, SidebarItemCompact, List, Switcher, Button, IconButton, Avatar | 6 |
| Datepicker | Datepicker | кит | `14131:86649` | Type: range · single · single-sm; +3 (shortcuts, date-field, sidebar-nav) | SidebarItem, InputField, InputCell, IconButton, Button, DividerHorizontal, Icon | 6 |
| Chart | Chart | кит | `16187:3670` | одиночный, без свойств | FeatureIcon, TopNav, TopNavItem, Icon | 6 |
| DashboardInfo | Dashboard-info | кит | `16189:4286` | одиночный, без свойств (тень `--elevation-e2`, фон `--blur-96`) | FeatureIcon, Icon | 6 |
| MobileNavItem | Mobile-nav-item | кит | `14246:19681` | Type: active-neutral · inactive · active · active-naked · active-primary · active-primary-light · active-primary-naked; Size: lg · xl; State: default · pressed; +5 | Icon, image | 6 |
| MobileNav | Mobile-nav | кит | `14246:19645` | Type: default · floating; Size: md · lg | MobileNavItem | 6 |
| QrCode | QR-code | кит | `16158:27561` | Type: round · square | — | 6 |
| LogomarkKpi | Logomark-KPI | кит | set key `012e8b44f8c07a479db2cf18c162b0b3916fa5e9` (id узла в ките не определён); копия в kpi-bro · web `46:1418`; знак — `src/assets/logomark-kpi/logomark.svg` из Sidebar экранов `91:969` | Type: default | — | 6 |
| KipiAvatar | KipiAvatar | ext · illustration | `165:719` | State: welcome · idle · thinking · error · success; Size: 36 · 96 — 10 ячеек; hex/градиенты допустимы только в слое Art | — | 6 |
| NavDot | NavDot | ext | `165:840` | одна ячейка (8×8, `--surface-danger-high-em`, обводка `--surface-s0`) | — | 6 |
| KpiStatus | KpiStatus | ext | `164:663` | Status: done · progress · fail · nodata; Type: 1 · 1+1 — 8 ячеек; showLabel | Icon | 6 |
| MetaChip | MetaChip | ext | `164:732` | Icon: none · calendar · users — 3 ячейки; label | Icon | 6 |
| TaskStatus | TaskStatus | ext | `164:707` | Status: on-approval · in-progress · done · closed-plan · closed-fact · rejected — 6 ячеек | Tag | 7 |
| MonthProgress | MonthProgress | ext | `174:1319` | Status: done · progress · fail · nodata; Value: 0 · 25 · 50 · 75 · 100 — 20 ячеек; label, value, period, showPeriod | — | 7 |
| ScaleChart | ScaleChart | ext | `209:1144` | Marker: show · hide — 2 ячейки; you | — | 7 |
| KipiLauncher | KipiLauncher | ext | `165:897` | State: idle · thinking · error · success — 4 ячейки | KipiAvatar | 7 |
| KipiMessage | KipiMessage | ext | `174:1350` | Author: kipi · user; State: default · thinking · error (у user только default) — 4 ячейки; text | KipiAvatar, Avatar | 7 |
| ResultBanner | ResultBanner | ext | `174:1349` | Type: month-result · my-matrix — 2 ячейки; title | KpiStatus, Link | 7 |
| EmployeeHeader | EmployeeHeader | ext | `171:1491` | одна ячейка; name, role, showStatus, showInfo | KpiStatus, Avatar, Icon | 7 |
| EmployeeCard | EmployeeCard | ext | `171:1455` | Footer: false · true; State: default · hover · focus · selected — 8 ячеек; name, role, footer, showStatus, showExpand | KpiStatus, Avatar, IconButton | 7 |
| KpiCard | KpiCard | ext | `171:1251` | State: default · hover · focus · selected — 4 ячейки; name, sub, weight, plan, fact | KpiStatus, Checkbox, IconButton | 7 |
| FileItem | FileItem | ext | `225:1041` | State: loading · done · error — 3 ячейки; name, size | FeatureIcon, IconButton | 7 |
| MonthCell | MonthCell | ext | `226:1029` | Period: closed · open · future; State: default · hover · focus · selected · disabled — 9 ячеек; month. На экранах не используется (SCR-10 на Datepicker, решение 2026-11-25) | Status | 7 |
| NotificationItem | NotificationItem | ext | `227:1038` | Read: false · true; State: default · hover — 4 ячейки; text, time | FeatureIcon, NavDot | 7 |
| TaskCard | TaskCard | ext | `167:1582` | Status: on-approval · in-progress · done · closed-plan · closed-fact · rejected; State: default · hover · focus · selected — 24 ячейки; title, description, showDescription, showAssignees | TaskStatus, MetaChip, Checkbox, Button, IconButton | 8 |
| TaskRow | TaskRow | ext | `176:2263` | Selectable: false · true; State: default · hover · focus · selected (selected при Selectable=true) — 7 ячеек; title, meta, showAction1, showAction2 | TaskStatus, Checkbox, Button | 8 |
| MatrixRow | MatrixRow | ext | `176:1831` | Level: group · item; State: default · hover · focus; Expanded: false · true (только group) — 9 ячеек; data, noData, showCompletion, showAction, showTasksLink, name | KpiStatus, Checkbox, Link, IconButton, Button, Icon | 8 |
| BatchBar | BatchBar | ext | `176:2623` | State: default · hint — 2 ячейки; count, hint, showClear | Button | 8 |
| PlanPerEmployeeRow | PlanPerEmployeeRow | ext | `176:2659` | State: default · error — 2 ячейки; name | InputField, HintLabel | 8 |
| EmployeeGroupHeader | EmployeeGroupHeader | ext | `176:2694` | Offer: false · true — 2 ячейки; name, role, count | CheckboxLabel, Avatar, Link, Button | 8 |
| SidePanel | SidePanel | ext | `209:997` | один компонент; showActions, Body (слот). На экранах не используется (решение дизайнера 2026-11-25), в ДС остаётся | ModalHeader, ModalActions | 8 |

## Пачки

| Пачка | Компонентов | Состав | Что даёт |
| --- | --- | --- | --- |
| 1 | 13 | Icon, Status, DividerHorizontal, Button, IconButton, Link, Avatar, Tag, InputLabel, HintLabel, DigitInput, InputCell, InputField | атомы и основное поле ввода |
| 2 | 12 | DividerVertical, ButtonDanger, ButtonSuccess, Checkbox, Radio, Toggle, FeatureIcon, InfoNote, Scroller, Indicator, ModalOverlay, ModalDragger | остальные атомы |
| 3 | 12 | CheckboxLabel, RadioLabel, ToggleLabel, SwitcherItem, Switcher, Chip, ChipSpecial, TagSpecial, ButtonGroup, IconButtonGroup, AvatarGroup, NotificationBell | выбор и группы из атомов |
| 4 | 12 | InputCellSpecial, InputFieldSpecial, Dropdown, InputCellMobile, InputFieldMobile, TopNavItem, TopNav, TabNavItem, TabNav, SidebarItem, SidebarItemCompact, PageIndicator | поля и пункты навигации |
| 5 | 12 | TableCell, List, Dropmenu, Pagination, Table, ModalHeader, ModalActions, Modal, Tooltip, Alert, Toast, ProfileDropdown | данные, оверлеи, фидбэк |
| 6 | 12 | Sidebar, Datepicker, Chart, DashboardInfo, MobileNavItem, MobileNav, QrCode, LogomarkKpi, KipiAvatar, NavDot, KpiStatus, MetaChip | составные кита и атомы ext |
| 7 | 12 | TaskStatus, MonthProgress, ScaleChart, KipiLauncher, KipiMessage, ResultBanner, EmployeeHeader, EmployeeCard, KpiCard, FileItem, MonthCell, NotificationItem | ext первого уровня |
| 8 | 7 | TaskCard, TaskRow, MatrixRow, BatchBar, PlanPerEmployeeRow, EmployeeGroupHeader, SidePanel | составные ext |

Внутри пачки порядок сборки — сверху вниз по таблице: каждый компонент идёт после своих зависимостей.

## Не переносим

| Figma | Node ID | Почему |
| --- | --- | --- |
| Web3: Pepemoji, Wallet-selection, Token-with-network, Token-with-icon, Token-pair, Token, Network-group, Network, Wallet-group, Wallet (10) | `16329:6059`, `20234:19885`, `14144:778`, `22721:743`, `14144:297`, `14141:11983`, `14251:5476`, `14143:26`, `16410:9739`, `12053:69` | криптокошельки и токены — вне KPI-сервиса |
| Media: Video | `12089:6569` | видеоплеера в продукте нет; в Tooltip слот медиа остаётся пустым |
| Pricing: Plan-feature, Price-card | `20132:25187`, `20132:26455` | тарифов и продажи в продукте нет |
| Mobile Keyboard: Keyboard, Keyboard-key, Keyboard-spacebar, Keyboard-autocorrection | `22122:35874`, `22117:33345`, `22119:15165`, `22119:15138` | системная клавиатура телефона, в вебе её рисует ОС. Токены `Keyboard/*` перенесены в semantics.css ради полноты Theme |
| Рамки для презентаций: Browser-window, Mobile-browser-window, Web-showcase-frame, window-controls, Status-bar, Mobile-device | `12152:927`, `12175:2691`, `16385:8708`, `43724:721`, `12051:10`, `16168:173` | рамки окна, браузера и телефона для показа макетов, не UI продукта |
| Cursors | `43329:3968` | курсоры для прототипов; в вебе — CSS `cursor` |
| Payment-method | `14145:7529` | логотипы платёжных систем (visa, apple-pay, g-pay, mastercard): платежей в продукте нет, логотипы — чужие бренды |
| Служебные страницы кита: File assets, Artboards, Logo, Project Thumbnail | `4001:2`, `12174:521`, `4021:6`, `12140:2596` | документация файла, не UI |
| ~~TeamMemberRow~~ (ext) | ~~`74:1070`~~ | удалён 2026-11-20, заменён EmployeeCard |

## Соглашения кода (с пачки 1, 2026-11-25)

- `Icon` — SVG кита встраивается в разметку (цвет `currentColor`, многоцветные по замыслу кита: add, icons-placeholder, verification-tick, google, figma); имени нет в ките — рамка-заглушка и предупреждение в консоли. Имена — только из кита: вместо отсутствующих взяты ближайшие (close → `cross`, trash → `bin`, calendar → `calender` (опечатка кита), more → `more-horizontal`, grid → `all`, help-circle → `help`, alert-circle / alert-triangle → `alert`, archive → `folder`, bar-chart → `chart`, file → `doc`, check-square → `tick`, target → `analytics`, sidebar → `panel`, placeholder-sm / md → `placeholder`); Variant `calendar` у MetaChip остаётся (имя = якорь), внутри — `calender`. Размер — проп `size` или CSS-переменная `--icon-size` у родителя (аналогично `--status-size` у `Status`). Instance-swap иконки = строка `name`.
- Проп `state` ставит `data-state` на корень; CSS пишется парами `:hover` / `:active` / `:focus-visible` / `:disabled` + `[data-state='…']`. `state="disabled"` выставляет и атрибут `disabled`.
- Булевы видимости слоёв Figma → наличие контента (слот передан — слой показан). HTML-атрибут `type` → проп `htmlType`.
- `className` пробрасывается в корень. Типографика — глобальные классы `ui-*` в TSX.
- Варианты Type — CSS-переменные на классе типа; hover — второй слой фона `linear-gradient(overlay, overlay), var(--bg)`.
- Вложенные компоненты — импортом из соседних папок. Общий реэкспорт `src/components/index.ts` собирается в конце.
- Значения без токена допустимы только там, где токена нет (обводки 1px, служебные маски, позиции стопов) — перечисляются в отчёте пачки.
- Контролы выбора (Checkbox, Radio, Toggle) — нативный `<input>` с `opacity: 0` поверх визуального слоя, стили через `:checked` / `:indeterminate` / `:disabled` + `[data-state]`; `state` принудительно выставляет checked / indeterminate / disabled (с пачки 2).
- Цветовые ветки набора (ButtonDanger, ButtonSuccess) оборачивают базовый компонент и перекрывают его CSS-переменные классами `.root.<type>` (специфичность 0,2,0); размеры, слоты и состояния не дублируются (с пачки 2).
- Наборы-двойники (RadioLabel / ToggleLabel ← CheckboxLabel, ChipSpecial ← Chip, TagSpecial ← Tag, IconButtonGroup ← ButtonGroup) импортируют CSS-модуль базового набора, свои размеры пишут как `.root.<size>` (0,2,0), чтобы не зависеть от порядка CSS; группы (Switcher, ButtonGroup, IconButtonGroup, AvatarGroup) принимают массив `items` / `avatars` и сами задают Size детям (с пачки 3).
- Ячейки полей с собственным State в Figma (InputCellSpecial, InputCellMobile) принимают оверрайды поля отдельным пропом `tone` (значения = State поля, проставляется как `data-tone`); `state` остаётся за вариантом самой ячейки. Пункты-группы (TopNav, TabNav) — массив `items` + `value`/`onChange`, как Switcher (с пачки 4).
- Фиксированная ширина кита без токена — CSS-переменная `--<name>-width` на корне + `max-width: 100%`; слой ABSOLUTE из вложенной кнопки (Back / Close в шапке, крестик Alert) позиционирует обёртка `<span>`, а не `className`: у Button / IconButton свой `position`; взаимоисключающие булевы слоя (Heading-sm / md / lg) → один union-проп; действия-кнопки — объекты `{ label, onClick }` с ролью в имени (`primaryAction`, `secondaryAction`) (с пачки 5).
- Демо-содержимое кита (пункты, разделы, ряды, матрицы) — дефолт пропса и экспорт константой `DEMO_*`; графика без библиотек — inline SVG с цветом через `fill` / `stroke` / `stop-color` на токенах; Art ext-иллюстраций — файлы в `src/assets/<name>/` импортом URL, hex только там (с пачки 6).
- Интерактивные ext-карточки (EmployeeCard, KpiCard, MonthCell) — `state` + булев `selected`, корень фокусируемый; FocusRing / SelectRing — `::after` с inset box-shadow 2 / 1 px Outline/primary-high-em, правило `:focus-visible` идёт после selected; Liquid-glass → `backdrop-filter: var(--blur-16)` с пометкой «Приближение»; Figma-TEXT, совпадающий с HTML-атрибутом (`role`), остаётся пропсом, атрибут исключается через `Omit` (с пачки 7).
- Расхождения пачки 1 с Figma, к сверке на Showcase: у `Avatar` `icon` и `status` по умолчанию `false` (в Figma `true`); пропсы `state` у InputCell, `size` у DigitInput, `tone` у HintLabel — в Figma это оверрайды, не варианты.

## Каталог в Storybook (2026-11-26, `directive_storybook.md`)

Запуск: `npm run storybook` в `react/` → http://127.0.0.1:6006 (в приложении Claude — запуск `kpi-storybook`). Проверка всех stories без окна: `npx vitest run --project=storybook`.

- **Структура:** `Foundation/Primitive · Semantic · Typography` (`src/foundation/`, значения разбираются из `src/tokens/*.css?raw`, не копируются) · `Components/<React-имя>` (`src/components/<Name>/<Name>.stories.tsx`) · `Sandboxes/*` (`src/sandboxes/`).
- **Формат story компонента:** CSF3, `tags: ['autodocs']`, `argTypes` на каждый проп, именованные stories на варианты из таблицы выше, `AllVariants` — вся матрица на одном холсте; в матрице состояний есть колонка без `state`, где hover / нажатие / фокус работают нативно. Эталон — `Button.stories.tsx`.
- **Каркас раскладки** — `src/catalog/Catalog.tsx` (Stack, Block, Matrix, Row, Labeled, Frame, Width, Stateful); компоненты в stories — только импорт из базы.
- **Тема** — переключатель «Тема» на панели ставит `data-theme` на `<html>` (`.storybook/preview.tsx`); фон холста — из темы, фоны Storybook выключены.
- **Иконки** — заглушка `Icon` строкой, без сторонних библиотек (Lucide из директивы не ставили: в ките своя библиотека). Контент — KPI-сервис по-русски.
- **Переходы** — 0.15s ease (motion-токенов в ките нет) добавлены в EmployeeCard, KpiCard, MatrixRow, MonthCell, NotificationItem, TaskCard, TaskRow, Tag, Link; у остальных интерактивных уже были.
- **Глубже по сложным (по решению дизайнера 2026-11-26):** Table — LongContent, Empty, ManyColumns; Dropdown — LongValue, DangerWithoutLabel, WithMenu (связка с Dropmenu); Dropmenu — LongList, LongLabels, SearchNoResults, Appear; Toast — LongText, TitleOnly, StackAppear; Modal — LongBody, LongHeading, Appear; Datepicker — YearBoundary, LeapDay, SingleDayRange.
- **Анимации появления** (в ките их нет, motion-токенов нет; выключаются при `prefers-reduced-motion`): Modal — из прозрачности со scale 0.96, 0.2s; ModalOverlay — проявление 0.2s; Toast — снизу на Space/md, 0.2s; Dropmenu — сверху на Space/xs, 0.15s. Только появление: закрытие мгновенное (закрытые Modal и Toast не рендерятся).
- **Песочницы:** модальное окно, форма, навигация (Navbar и Breadcrumb в ките нет — их роль у Sidebar и TopNav), данные и обратная связь, KPI-матрица.

### Замечания к базе, найденные при сборке каталога (код не менялся, к решению)

| Компонент | Что | Как в каталоге |
| --- | --- | --- |
| KpiCard, TaskCard | чекбокс показывает `checked-pressed` только при `state="selected"`; при живом `selected` — обычный `checked`, расходится с Figma | видно в Live-stories |
| EmployeeCard | нет `onSelectedChange` (у KpiCard есть) | выбор по `onClick` на корне |
| MonthProgress | дефолты не согласованы: `value=0`, подпись `60%` | stories передают оба |
| TableCell | по умолчанию `type='header'`; для ячеек тела нужно `type="default"` | передаётся явно |
| Sidebar | слот `badge` (NavDot) встаёт под пунктом, а не на иконку; в `collapsed-compact` нет кнопки «развернуть»; демо-тексты по умолчанию английские и не экспортированы как `DEMO_*` | в stories — русские тексты; разворот через `cta` |
| Datepicker | тексты по умолчанию английские (месяцы, дни, Cancel/Apply, шорткаты) | stories передают русские |
| Chart, DashboardInfo | слой скрывается только `null`, `undefined` оставляет текст кита | stories передают `null` |
| MobileNav | `type=default` при `size=md` в ките нет — рендерится по аналогии | story DefaultMd |
| PageIndicator | `active` не ограничен `0…count-1` | — |
| Dropdown | только поле-триггер, список — отдельный Dropmenu | связка — в песочнице «Форма» |
| Scroller | положение и длина ползунка — только CSS-переменные, в контролы не вынесены | — |
| Table | длинный текст в ячейке режется многоточием в одну строку (ФИО, должность, отдел); много колонок сжимаются по 1fr без прокрутки вбок | stories LongContent, ManyColumns |
| Table | пустого состояния нет — только строка заголовков | story Empty; пустые состояния — к релизу (`prototype/coverage.md`) |
| Dropmenu | нет ограничения высоты: длинный список растёт целиком | stories LongList, Dropdown → WithMenu |
| Toast | не позиционируется сам (угол экрана и стопка — у экрана) | стопка — в песочнице «Данные и обратная связь» |

### Правки 2026-11-26 (запрос дизайнера после каталога)

- **Интерфейс Storybook под ДС** (`.storybook/manager.ts`, `.storybook/manager-head.html`): название «Magic UI» и подпись «by Pitonize DS v.1.0.1» (уточнение дизайнера), логотип — Logomark-KPI из сайдбара экранов; левая колонка — как Sidebar (панель Surface/s1 с обводкой Surface/s3 и Radius/7xl, шапка — блок Header, пункты — Sidebar-item md, текущая страница — active-neutral, заголовки разделов — UI/overline); цвета и шрифт — токены (`src/tokens` раздаются в интерфейс через staticDirs). Тема интерфейса Storybook только светлая; онбординг «Get started» скрыт.
- **Sidebar vs экраны** (сверка с инстансом `91:969`, story «Как в макете»): обводки корня и шапки — внутрь (inset box-shadow, как INSIDE в Figma; border сдвигал всё на 1px и делал шапку 58 вместо 56); между Header и Top-section без CTA — Space/3xl (16), как Top gap на экранах. После правки шапка 8 · 8 · 224×56, пункты с 88 по 40 — совпадает с макетом.
- **LogomarkKpi** — больше не плейсхолдер: SVG знака из макетов.
- **Кипи — движение** (в Figma нет, motion-токенов нет; выключено при prefers-reduced-motion): KipiAvatar подпрыгивает при смене State и по `bounceKey` (0.45s), в thinking «дышит»; KipiLauncher — клик сжимает круг и подбрасывает Кипи; KipiMessage — новая реплика въезжает (Кипи слева, пользователь справа, 0.25s), в thinking после текста бегут три точки. Живые stories: KipiAvatar «Смена состояния», KipiLauncher «Клик», KipiMessage «Чат».

### Правки 2026-11-26, второй заход (запрос дизайнера)

- **Раскладка интерфейса Storybook:** превью и панель настроек — скруглённые панели (Radius/7xl, обводка Surface/s3), между всеми областями Space/md (8); кнопка настроек — квадрат Space/16xl (56) во всю высоту блока логотипа, в его стиле; «+» (новая story) — квадрат Space/12xl (40), одной высоты с поиском.
- **Страница компонента** (`.storybook/DocsPage.tsx`, `preview.css`): главный пример закреплён (sticky) в пределах блока «пример + настройки» — при правке Controls изменения видны сразу; не выше 65% экрана.
- **Живые сценарии в каждой story** (`withLiveArgs` в `.storybook/preview.tsx`): событие компонента пишет значение в его args — клик по неактивному пункту Switcher / TabNav / TopNav / Sidebar, чекбоксу, Toggle, Radio, странице Pagination, раскрытие MatrixRow, выбор карточки, ввод в поле, закрытие Modal работают в любой story. Пары: onChange → value / checked / current, onCheckedChange → checked, onSelectedChange → selected, onExpandedChange → expanded, onThemeChange → theme, onShortcutChange → shortcut, onDigitChange → digitValue, onClose → open=false, у триггеров с open без onClose — onClick переключает open. Зафиксированный `state` (Unchecked, Hover…) снимается при первом живом действии. Date и объекты не пишутся (Datepicker работает без контроля). Отключить: `parameters.liveArgs = false`, сохранить state — `parameters.keepState = true`.
- **Sidebar свёрнутый — по макету экранов** (инстанс `83:730`), не по collapsed-compact кита: шапка 48×56 с Logomark-KPI 32 (клик — headerAction, «развернуть»), пункты 48×38 — только иконка 18 без подписей, шаг Space/md, текущий тёмный (active-neutral), внизу пункты с badge (NavDot на иконке) и Avatar 40; тема в свёрнутом виде не показывается. Сверено замером: шапка 8 · 12 · 48×56, пункты с 96 шагом 46, NavDot 32 · 8, Avatar 12 · 40×40 — как в макете. `SidebarItemCompact` в Sidebar больше не используется (в ДС остаётся). Story «Свёрнутая — как в макете» — живая: клик по логотипу разворачивает, кнопка в шапке сворачивает. LogomarkKpi получил размер 32.

### Правки 2026-11-26, третий заход (запрос дизайнера)

- **Шапка Storybook:** блок логотипа тянется до кнопки настроек, зазор Space/md (8); значок настроек Space/5xl (20); колонка по умолчанию 340 (у Storybook 300), чтобы «Magic UI · by Pitonize DS v.1.0.1» помещалась. Вкладка: значок — Logomark-KPI (`src/assets/logomark-kpi/logomark.svg`), заголовок — «Magic UI - KPI by Pitonize Design System» (и в Storybook, и в `index.html` приложения).
- **Datepicker:** дни внутри периода получили подложку Surface/primary-base-em-alpha (её перебивало правило прозрачного невыбранного дня); в ячейке дня обнулены поля кнопки — двузначные числа больше не обрезаются; поле даты 128 вместо 120 из кита («30 / 06 / 2026» не помещалась на 3px).
- **Toast success** — без зелёной подложки вокруг карточки (как default), карточка с обычной тенью Elevation/e5; иконка остаётся зелёной. warning / danger — как в ките.
- **Table** получил `onRowClick` (в ките не заведено): строка открывается кликом по названию или свободному месту и Enter / Space; клики по чекбоксам, кнопкам, ссылкам и полям строку не открывают. Открываемая строка — subgrid (у обычной `display: contents`), с наведением Surface/hover-overlay-inverse и кольцом фокуса.
- **Окна из макетов** — `src/sandboxes/screens/`: `ScreenPanel` (композиция экрана по локальному TaskCreatePanel: подложка Modal-overlay + панель 480 справа, секции Surface/s0 Radius/7xl через Space/md, кнопки lg внизу; въезжает справа 0.25s) и окна `KpiCardPanel` (272:17842, с правкой показателя), `TaskCardPanel` (276:19739), `TaskClosePanel` (290:14897), `EmployeeMatrixPanel`. Это не компоненты ДС — панели остаются локальными (решение 2026-11-25). Песочница «Окна из макетов»: задачи → карточка → закрытие; матрица → показатель → правка; таблица → матрица сотрудника или задача. В «KPI-матрице» клик по показателю открывает карточку с правкой, в «Данных и обратной связи» строка таблицы — матрицу сотрудника.

### Правки 2026-11-26, четвёртый заход (запрос дизайнера)

- **Песочница «Окна из макетов» — приложение целиком:** сайдбар переключает экраны (Ассистент Кипи · Моя матрица · Сотрудники · Задачи), сверху — роль (руководитель / сотрудник; у сотрудника нет «Сотрудников»). Истории: «Приложение · Ассистент Кипи», «Приложение · сотрудник», плюс входы сразу в задачи, матрицу и таблицу.
- **Экран «Ассистент Кипи»** (`src/sandboxes/screens/KipiPage.tsx`, по Screen/Home 95:2136, SCR-13): чат 464 (шапка KipiAvatar 36 + подпись-состояние словами, лента KipiMessage, подсказки Chip, поле с кнопкой) и сводки справа (Dashboard-info, «Моя матрица»). Состояния Кипи живые: welcome при входе → thinking (печатает, точки) → success (нашёл) или error (не понял вопрос) → idle. Экран не размонтируется при переходах — диалог и состояние сохраняются.
- **Кипи у всех ролей** (решение дизайнера, README): KipiLauncher в правом нижнем углу каждого экрана, кроме экрана Кипи; повторяет состояние Кипи (думает, нашёл, ошибка), клик — на экран Кипи.
- **Показатель из матрицы:** KpiCardPanel по умолчанию — только значения строки списком (`PanelList`: подпись слева, значение справа, строки через разделитель Outline/low-em) + «Изменить показатель»; полная карточка по макету 272:17842 — `details`.
