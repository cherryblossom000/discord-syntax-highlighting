import hljs from 'highlight.js'

hljs.debugMode()
hljs.highlightAll()

// NodeListOf<HTMLLIElement> is different to NodeListOf<Element>
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/non-nullable-type-assertion-style -- ^
for (const category of document.querySelectorAll(
  '.categories > li'
) as NodeListOf<HTMLLIElement>) {
  category.addEventListener('click', ev => {
    const target = ev.target as HTMLLIElement
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style -- HTMLLIElement is different to Element
    const current = document.querySelector(
      '.categories .current'
    ) as HTMLLIElement
    const currentCategory = current.dataset.category
    const nextCategory = target.dataset.category

    if (currentCategory !== nextCategory) {
      current.classList.remove('current')
      target.classList.add('current')

      for (const language of document.querySelectorAll(`.${currentCategory}`))
        language.classList.add('hidden')
      for (const language of document.querySelectorAll(`.${nextCategory}`))
        language.classList.remove('hidden')

      window.scrollTo(0, 0)
    }
  })
}

document.getElementById('light-theme')!.addEventListener('input', () => {
  document.documentElement.classList.toggle('theme-dark')
  document.documentElement.classList.toggle('theme-light')
})
