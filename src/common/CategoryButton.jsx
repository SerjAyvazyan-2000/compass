import React from 'react'

export function CategoryButton({
  className,
  isSelected,
  setSelectedCategories,
}) {
  return (
    <button
      onClick={() => () =>
        isSelected
          ? setSelectedCategories((prev) =>
              prev.filter((selected) => selected !== category.categoryName)
            )
          : setSelectedCategories((prev) => [...prev, category.categoryName])}
      className={className}
    >
      {children}
    </button>
  )
}
