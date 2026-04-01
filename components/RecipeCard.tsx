'use client'

// components/RecipeCard.tsx
import { useState } from 'react'
import { RecipeData } from '@/lib/types'

function formatTime(minutes: number): string {
  if (minutes <= 0) return '—'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
  if (hours > 0) return `${hours}h`
  return `${mins} min`
}

interface RecipeCardProps {
  recipe: RecipeData
  title: string
}

export default function RecipeCard({ recipe, title }: RecipeCardProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const {
    prep_time_minutes,
    cook_time_minutes,
    total_time_minutes,
    yield_amount,
    yield_unit,
    difficulty,
    cuisine,
    ingredients,
    instructions,
    tips,
  } = recipe

  return (
    <div
      className="rounded-2xl overflow-hidden mb-12"
      style={{
        border: '1px solid var(--color-bg-secondary)',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      {/* Meta bar */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-5"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        {prep_time_minutes !== undefined && (
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-secondary)' }}>Prep</p>
            <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{formatTime(prep_time_minutes)}</p>
          </div>
        )}
        {cook_time_minutes !== undefined && (
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-secondary)' }}>Cook</p>
            <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{formatTime(cook_time_minutes)}</p>
          </div>
        )}
        {total_time_minutes !== undefined && (
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-secondary)' }}>Total</p>
            <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{formatTime(total_time_minutes)}</p>
          </div>
        )}
        {yield_amount !== undefined && yield_unit && (
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-secondary)' }}>Serves</p>
            <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{yield_amount} {yield_unit}</p>
          </div>
        )}
      </div>

      {/* Badges row */}
      {(difficulty || cuisine) && (
        <div className="flex flex-wrap gap-2 px-6 pt-4">
          {difficulty && (
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
            >
              {difficulty}
            </span>
          )}
          {cuisine && (
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
            >
              {cuisine}
            </span>
          )}
        </div>
      )}

      <div className="px-6 py-6 space-y-8">

        {/* Ingredients */}
        {ingredients && ingredients.length > 0 && (
          <div>
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
            >
              Ingredients
            </h2>
            <ul className="space-y-2">
              {ingredients.map((ingredient, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => toggleIngredient(i)}
                >
                  <div
                    className="flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: checkedIngredients.has(i) ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                      backgroundColor: checkedIngredients.has(i) ? 'var(--color-primary)' : 'transparent',
                    }}
                  >
                    {checkedIngredients.has(i) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm leading-relaxed transition-colors"
                    style={{
                      color: checkedIngredients.has(i) ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                      textDecoration: checkedIngredients.has(i) ? 'line-through' : 'none',
                    }}
                  >
                    {ingredient}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Divider */}
        {ingredients?.length && instructions?.length ? (
          <hr style={{ borderColor: 'var(--color-bg-secondary)' }} />
        ) : null}

        {/* Instructions */}
        {instructions && instructions.length > 0 && (
          <div>
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
            >
              Instructions
            </h2>
            <ol className="space-y-6">
              {instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    {step.name && (
                      <p className="font-semibold mb-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>
                        {step.name}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Tips */}
        {tips && tips.length > 0 && (
          <>
            <hr style={{ borderColor: 'var(--color-bg-secondary)' }} />
            <div>
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
              >
                Tips & Notes
              </h2>
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                    <span style={{ color: 'var(--color-primary)' }} className="mt-0.5 flex-shrink-0">✦</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
