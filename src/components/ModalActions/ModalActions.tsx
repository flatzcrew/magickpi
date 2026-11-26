import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Button } from '../Button'
import { Link } from '../Link'
import type { ModalHeaderLink } from '../ModalHeader'
import styles from './ModalActions.module.css'

/**
 * ModalActions — блок кнопок внизу модалки. Figma: кит, `Modal-actions/CTAs` `14158:28302` (одиночный; +2: CTAs-слот, Description).
 * CTAs в ките — две Button md поровну: secondary («Отмена») и primary («Подтвердить»).
 * Description — подпись UI/caption-2 + Link secondary sm.
 */
export interface ModalActionsProps extends HTMLAttributes<HTMLElement> {
  /** CTAs — свой набор кнопок вместо пары по умолчанию. */
  children?: ReactNode
  /** Primary-кнопка (null — скрыть). */
  primaryLabel?: ReactNode
  onPrimary?: MouseEventHandler<HTMLButtonElement>
  primaryDisabled?: boolean
  /** Secondary-кнопка (null — скрыть). */
  secondaryLabel?: ReactNode
  onSecondary?: MouseEventHandler<HTMLButtonElement>
  /** Description — подпись под кнопками. */
  description?: ReactNode
  /** Link после подписи. */
  link?: ModalHeaderLink
}

export function ModalActions({
  children,
  primaryLabel = 'Подтвердить',
  onPrimary,
  primaryDisabled,
  secondaryLabel = 'Отмена',
  onSecondary,
  description,
  link,
  className,
  ...rest
}: ModalActionsProps) {
  return (
    <footer {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.ctas}>
        {children ?? (
          <>
            {secondaryLabel != null && (
              <Button type="secondary" size="md" onClick={onSecondary}>
                {secondaryLabel}
              </Button>
            )}
            {primaryLabel != null && (
              <Button type="primary" size="md" onClick={onPrimary} disabled={primaryDisabled}>
                {primaryLabel}
              </Button>
            )}
          </>
        )}
      </div>
      {(description != null || link) && (
        <div className={styles.description}>
          {description != null && <p className={[styles.descriptionText, 'ui-caption-2-normal'].join(' ')}>{description}</p>}
          {link && (
            <Link type="secondary" size="sm" rightIcon="arrow-right" href={link.href} onClick={link.onClick}>
              {link.label}
            </Link>
          )}
        </div>
      )}
    </footer>
  )
}
