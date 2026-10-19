import React from 'react';

export function Card({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = 'p-4',
  footer
}) {
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden ${className}`}
    >
      {(title || subtitle || Icon || action) && (
        <div
          className={`px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 ${headerClassName}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="p-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={bodyClassName}>{children}</div>

      {footer && (
        <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
}
