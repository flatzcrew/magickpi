import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { FeatureIcon } from '../FeatureIcon'
import { Button } from '../Button'
import styles from './Tooltip.module.css'

/**
 * Tooltip — всплывающая подсказка. Figma: кит, `Tooltip` `12089:7621` (8 направлений; +7).
 * Body: Icon (Feature-icon secondary xs) · Text-wrap (заголовок + описание) · Video (медиа-слот, компонент не переносим)
 * · CTAs (Button-1 secondary sm, Button-2 tertiary sm). Pointer — треугольник со стороны направления.
 * Опечатка Figma `botom-*` сохранена (имя = якорь).
 */
export type TooltipDirection =
  | 'botom-left'
  | 'botom-right'
  | 'bottom-center'
  | 'left-center'
  | 'right-center'
  | 'top-center'
  | 'top-left'
  | 'top-right'

export interface TooltipAction {
  label: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** 🧭 Direction — с какой стороны и где стоит указатель. */
  direction?: TooltipDirection
  /** Icon — иконка в Feature-icon (передана — показана). */
  icon?: string
  /** Primary-text — заголовок. */
  heading?: ReactNode
  /** Description. */
  description?: ReactNode
  /** Video — слот медиа (видеоплеер в продукт не переносим; сюда можно положить картинку). */
  media?: ReactNode
  /** → Button-1 (secondary) и → Button-2 (tertiary). */
  actions?: TooltipAction[]
  /** Body — дополнительное содержимое в конце тела. */
  children?: ReactNode
}

export function Tooltip({
  direction = 'botom-left',
  icon,
  heading,
  description,
  media,
  actions,
  children,
  className,
  ...rest
}: TooltipProps) {
  return (
    <div
      role="tooltip"
      {...rest}
      data-direction={direction}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <div className={styles.body}>
        {icon && <FeatureIcon type="secondary" size="xs" icon={icon} />}
        {(heading != null || description != null) && (
          <div className={styles.textWrap}>
            {heading != null && <p className={[styles.heading, 'ui-para-medium'].join(' ')}>{heading}</p>}
            {description != null && <p className={[styles.description, 'ui-caption-2-normal'].join(' ')}>{description}</p>}
          </div>
        )}
        {media != null && <div className={styles.media}>{media}</div>}
        {actions && actions.length > 0 && (
          <div className={styles.ctas}>
            {actions.slice(0, 2).map((a, i) => (
              <Button key={i} type={i === 0 ? 'secondary' : 'tertiary'} size="sm" onClick={a.onClick}>
                {a.label}
              </Button>
            ))}
          </div>
        )}
        {children}
      </div>
      <span className={styles.pointer} aria-hidden="true">
        <span className={styles.arrow} />
      </span>
    </div>
  )
}
